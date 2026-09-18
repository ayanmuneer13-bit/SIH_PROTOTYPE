/**
 * MediKiosk & MedConnect REST API Server
 * SIH26047 - Patient Case-Taking Software
 * 
 * Implemented using Node.js standard HTTP module (Zero extra dependencies required)
 * Fully compatible with Node 18+ and Node 24
 */

import http from 'node:http';
import url from 'node:url';

const PORT = process.env.PORT || 5001;

// Seeded pseudo-random for KNN dataset
const DEPARTMENTS = [
  'General Medicine',
  'Cardiology',
  'Orthopedics',
  'Pediatrics',
  'ENT',
  'Dermatology',
  'Ophthalmology',
  'Gynecology'
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = [
  'Morning (08:00 - 11:00)',
  'Midday (11:00 - 14:00)',
  'Afternoon (14:00 - 17:00)',
  'Evening (17:00 - 20:00)'
];

const DOCTOR_AVGS = {
  'General Medicine': 10,
  Cardiology: 17,
  Orthopedics: 14,
  Pediatrics: 12,
  ENT: 9,
  Dermatology: 8,
  Ophthalmology: 9,
  Gynecology: 14
};

// Generate 450 synthetic OPD records for KNN regression
function generateOPDRecords() {
  const records = [];
  let seed = 77123;
  function rand() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  for (let i = 1; i <= 450; i++) {
    const dept = DEPARTMENTS[Math.floor(rand() * DEPARTMENTS.length)];
    const day = DAYS_OF_WEEK[Math.floor(rand() * DAYS_OF_WEEK.length)];
    const slot = TIME_SLOTS[Math.floor(rand() * TIME_SLOTS.length)];
    const avgMin = DOCTOR_AVGS[dept] || 10;
    const token = Math.floor(rand() * 90) + 1;
    const patientsAhead = Math.max(0, Math.round(token * (0.25 + rand() * 0.5)));
    const queueSize = Math.max(patientsAhead + 4, token + 5);

    const rushFactor = (day === 'Monday' ? 1.25 : 1.0) * (slot.startsWith('Morning') ? 1.2 : 1.0);
    const noise = (rand() - 0.45) * 12;
    const actualWait = Math.max(5, Math.round(patientsAhead * avgMin * rushFactor + noise));

    records.push({
      id: `rec-${i}`,
      department: dept,
      dayOfWeek: day,
      timeSlot: slot,
      tokenNumber: token,
      patientsAhead,
      queueSize,
      actualWaitMinutes: actualWait
    });
  }
  return records;
}

const HISTORICAL_OPD_DATA = generateOPDRecords();

// KNN Regression Core Logic
function predictWaitingTimeKNN(input) {
  const token = Number(input.tokenNumber) || 1;
  const dept = input.department || 'General Medicine';
  const ahead = Number(input.patientsAhead) || Math.max(0, Math.round(token * 0.4));
  const queue = Number(input.queueSize) || Math.max(ahead + 5, token + 2);
  const k = 6;

  // Filter or prioritize department
  const deptPool = HISTORICAL_OPD_DATA.filter((r) => r.department === dept);
  const pool = deptPool.length >= k ? deptPool : HISTORICAL_OPD_DATA;

  // Distance weights
  // Feature 0: patientsAhead (weight 3.5)
  // Feature 1: tokenNumber (weight 1.5)
  // Feature 2: queueSize (weight 1.0)
  const distances = pool.map((rec) => {
    const diffAhead = (ahead - rec.patientsAhead) / 50;
    const diffToken = (token - rec.tokenNumber) / 100;
    const diffQueue = (queue - rec.queueSize) / 80;
    const dist = Math.sqrt(
      3.5 * diffAhead * diffAhead +
      1.5 * diffToken * diffToken +
      1.0 * diffQueue * diffQueue
    );
    return { record: rec, distance: dist };
  });

  distances.sort((a, b) => a.distance - b.distance);
  const neighbors = distances.slice(0, k);

  let totalWeight = 0;
  let weightedSum = 0;
  const waitTimes = [];

  const nearestNeighbors = neighbors.map((n) => {
    const r = n.record;
    const w = 1 / (n.distance + 0.001);
    totalWeight += w;
    weightedSum += w * r.actualWaitMinutes;
    waitTimes.push(r.actualWaitMinutes);
    return {
      id: r.id,
      department: r.department,
      tokenNumber: r.tokenNumber,
      patientsAhead: r.patientsAhead,
      distance: parseFloat(n.distance.toFixed(3)),
      actualWaitMinutes: r.actualWaitMinutes
    };
  });

  const rawPred = weightedSum / totalWeight;
  const mean = waitTimes.reduce((acc, v) => acc + v, 0) / waitTimes.length;
  const variance = waitTimes.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / waitTimes.length;
  const stdDev = Math.sqrt(variance);

  const margin = Math.max(6, Math.min(18, Math.round(stdDev * 1.15)));
  const estimatedWaitMinutes = Math.max(5, Math.round(rawPred));
  const lowerBound = Math.max(3, Math.round(rawPred - margin));
  const upperBound = Math.round(rawPred + margin);

  let confidence = 'moderate';
  const avgDist = neighbors.reduce((acc, n) => acc + n.distance, 0) / k;
  if (avgDist < 0.65 && stdDev < 9) confidence = 'high';
  else if (avgDist > 1.3 || stdDev > 22) confidence = 'low';

  return {
    tokenNumber: token,
    department: dept,
    patientsAhead: ahead,
    queueSize: queue,
    estimatedWaitMinutes,
    lowerBound,
    upperBound,
    confidence,
    similarCasesFound: nearestNeighbors.length,
    nearestNeighbors,
    isFallback: false,
    disclaimer: 'Notice: This is an approximate machine learning estimate based on historical OPD trends. Actual consultation times vary with emergency cases and clinical complexity.'
  };
}

// In-Memory Database for API testing
const db = {
  intakes: [],
  verifications: [],
  talkRequests: []
};

// Helper: read JSON body
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
      if (body.length > 5 * 1024 * 1024) { // 5MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// Helper: send JSON
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Server handler
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  try {
    // 1. Health check
    if (pathname === '/api/health' && method === 'GET') {
      return sendJson(res, 200, { status: 'healthy', project: 'MediKiosk & MedConnect SIH26047', time: new Date().toISOString() });
    }

    // 2. OPD Queue Waiting Time Prediction (KNN ML Endpoint)
    if (pathname === '/api/queue/predict-wait-time' && method === 'POST') {
      const body = await readJsonBody(req);
      if (!body.tokenNumber) {
        return sendJson(res, 400, { error: 'Token number is required' });
      }
      const prediction = predictWaitingTimeKNN(body);
      return sendJson(res, 200, prediction);
    }

    // 3. Clinical Intake Submission
    if (pathname === '/api/intake/submit' && method === 'POST') {
      const body = await readJsonBody(req);
      const intakeRecord = {
        id: body.id || `intake-${Date.now()}`,
        ...body,
        receivedAt: new Date().toISOString()
      };
      db.intakes.unshift(intakeRecord);
      return sendJson(res, 201, { success: true, intake: intakeRecord });
    }

    // 4. Get Intakes
    if (pathname === '/api/intake' && method === 'GET') {
      return sendJson(res, 200, db.intakes);
    }

    // 5. Physician Review Confirmation
    if (pathname.startsWith('/api/intake/') && pathname.endsWith('/physician-review') && method === 'PUT') {
      const parts = pathname.split('/');
      const id = parts[3];
      const body = await readJsonBody(req);
      const intake = db.intakes.find((i) => i.id === id);
      if (!intake) {
        return sendJson(res, 404, { error: 'Intake record not found' });
      }
      intake.physicianReview = {
        ...intake.physicianReview,
        ...body,
        isConfirmed: true,
        reviewedAt: new Date().toISOString()
      };
      return sendJson(res, 200, { success: true, intake });
    }

    // 6. Medical Document OCR Extraction simulation
    if (pathname === '/api/documents/ocr-extract' && method === 'POST') {
      const body = await readJsonBody(req);
      const fileName = body.fileName || 'medical_document.pdf';
      const docType = body.documentType || 'Prescription';

      // Generate intelligent OCR structured extraction
      const extracted = {
        id: `doc-${Date.now()}`,
        fileName,
        documentType: docType,
        documentDate: body.documentDate || '2026-08-15',
        ocrExtractedText: `Extracted clinical report from ${fileName}. Primary findings: Evaluated patient vitals and laboratory parameters.`,
        extractedDiagnosis: ['Follow-up case review', 'Metabolic parameter check'],
        extractedMedications: ['Prescribed regular dosing per clinical instructions'],
        extractedLabValues: [
          { testName: 'Hemoglobin', value: '11.8', unit: 'g/dL', referenceRange: '13.0 - 17.0', status: 'Abnormal' },
          { testName: 'Random Blood Sugar', value: '142', unit: 'mg/dL', referenceRange: '70 - 140', status: 'Abnormal' },
          { testName: 'Platelet Count', value: '185,000', unit: '/uL', referenceRange: '150,000 - 450,000', status: 'Normal' }
        ],
        uploadedAt: new Date().toISOString()
      };
      return sendJson(res, 200, extracted);
    }

    // 7. Student Verification Registration & Steps
    if (pathname === '/api/students/register' && method === 'POST') {
      const body = await readJsonBody(req);
      const newApp = {
        id: `verif-${Date.now()}`,
        studentId: `stu-${Date.now().toString().slice(-6)}`,
        name: body.name || 'Medical Student',
        email: body.email,
        phone: body.phone,
        college: body.college,
        course: body.course || 'MBBS',
        year: body.year || 'MBBS Final Year',
        studentIdNumber: body.studentIdNumber || 'PENDING',
        languages: body.languages || ['English', 'Hindi'],
        areasOfInterest: body.areasOfInterest || ['Community Health'],
        bio: body.bio || '',
        documents: body.documents || [],
        identityCheck: body.identityCheck || { submitted: false, status: 'submitted_awaiting_verification' },
        overallStatus: 'PENDING',
        submittedAt: new Date().toISOString()
      };
      db.verifications.unshift(newApp);
      return sendJson(res, 201, { success: true, application: newApp });
    }

    // 8. Admin Verifications Listing
    if (pathname === '/api/admin/verifications' && method === 'GET') {
      return sendJson(res, 200, db.verifications);
    }

    // 9. Admin Update Verification Status
    if (pathname.startsWith('/api/admin/verifications/') && pathname.endsWith('/status') && method === 'PUT') {
      const parts = pathname.split('/');
      const id = parts[4];
      const body = await readJsonBody(req);
      const app = db.verifications.find((a) => a.id === id);
      if (!app) {
        return sendJson(res, 404, { error: 'Verification application not found' });
      }
      app.overallStatus = body.status;
      app.reviewedAt = new Date().toISOString();
      app.reviewerName = body.reviewerName || 'Institutional Admin';
      if (body.rejectionReason) app.rejectionReason = body.rejectionReason;
      if (body.adminNotes) app.adminNotes = body.adminNotes;
      return sendJson(res, 200, { success: true, application: app });
    }

    // 10. MedConnect Request Talk
    if (pathname === '/api/medconnect/request' && method === 'POST') {
      const body = await readJsonBody(req);
      const request = {
        id: `talk-req-${Date.now()}`,
        studentId: body.studentId,
        patientName: body.patientName,
        phone: body.phone,
        reason: body.reason,
        createdAt: new Date().toISOString(),
        status: 'Confirmed'
      };
      db.talkRequests.push(request);
      return sendJson(res, 201, { success: true, request });
    }

    // 404 fallback
    sendJson(res, 404, { error: 'API route not found' });
  } catch (err) {
    console.error('Server error:', err);
    sendJson(res, 500, { error: 'Internal Server Error', message: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`[MediKiosk & MedConnect Backend] Running on http://localhost:${PORT}`);
});
