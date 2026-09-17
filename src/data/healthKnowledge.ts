import { DiseaseKnowledge } from '../types';

export const HEALTH_KNOWLEDGE_BASE: DiseaseKnowledge[] = [
  {
    id: 'dengue',
    name: 'Dengue Fever',
    localNames: {
      hi: 'डेंगू बुखार (हड्डी तोड़ बुखार)',
      mr: 'डेंग्यू ताप (हाडमोडी ताप)'
    },
    category: 'vector-borne',
    overview: 'Dengue is a mosquito-borne viral infection caused by the dengue virus (DENV, serotypes 1-4), transmitted primarily by female Aedes aegypti mosquitoes which bite mostly during daytime. It is prevalent in tropical and subtropical climates, particularly during and post-monsoon.',
    commonSymptoms: [
      'High sudden fever (104°F / 40°C)',
      'Severe headache and pain behind the eyes (retro-orbital pain)',
      'Severe joint and muscle pain ("breakbone fever")',
      'Nausea and vomiting',
      'Skin rash appearing 2-5 days after fever onset',
      'Mild bleeding such as nosebleeds or bleeding gums'
    ],
    redFlagSymptoms: [
      'Persistent vomiting (unable to keep fluids down)',
      'Severe continuous abdominal pain or tenderness',
      'Bleeding from mucous membranes, nose, gums, or blood in vomit/stool',
      'Extreme fatigue, restlessness, or altered mental state',
      'Rapid drop in blood platelet count with plasma leakage signs',
      'Cold, clammy skin or weak rapid pulse (Dengue Shock Syndrome)'
    ],
    prevention: [
      'Eliminate standing water in coolers, flowerpots, tires, and open drums once a week (Dry Day campaign)',
      'Apply mosquito repellents containing DEET, Picaridin, or Oil of Lemon Eucalyptus',
      'Wear long-sleeved clothing and long pants, especially during early morning and late afternoon',
      'Use insecticide-treated bed nets and window/door wire mesh',
      'Cover all water storage containers tightly'
    ],
    selfCareAndPrecautions: [
      'Drink plenty of clean fluids (ORS, coconut water, lime water, clear soups) to maintain hydration',
      'Rest adequately and monitor body temperature and urine output',
      'Use paracetamol for fever reduction if advised by a healthcare provider',
      'CRITICAL: Strictly AVOID Aspirin, Ibuprofen, and other NSAIDs as they increase the risk of severe bleeding'
    ],
    whenToSeekImmediateCare: [
      'Severe abdominal pain or continuous vomiting',
      'Noticeable bleeding from nose, gums, or skin bruises',
      'Drowsiness, confusion, or difficulty breathing',
      'Fever drops suddenly below normal (hypothermia) while feeling worse'
    ],
    sources: [
      {
        name: 'World Health Organization (WHO) Dengue Guidelines',
        url: 'https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue',
        organization: 'WHO',
        lastReviewed: '2024-04-15'
      },
      {
        name: 'National Vector Borne Disease Control Programme (NVBDCP - MoHFW India)',
        url: 'https://nvbdcp.gov.in/index4.php?lang=1&level=0&linkid=431&lid=3715',
        organization: 'MoHFW',
        lastReviewed: '2024-07-10'
      }
    ],
    keywords: ['dengue', 'aedes', 'platelets', 'breakbone', 'mosquito', 'dengue fever', 'retro-orbital', 'डेंगू', 'डेंग्यू']
  },
  {
    id: 'malaria',
    name: 'Malaria',
    localNames: {
      hi: 'मलेरिया (कंपकंपी वाला बुखार)',
      mr: 'हिवताप (मलेरिया)'
    },
    category: 'vector-borne',
    overview: 'Malaria is a life-threatening disease caused by Plasmodium parasites (predominantly P. falciparum and P. vivax in India), transmitted to people through the bites of infected female Anopheles mosquitoes, which typically bite between dusk and dawn.',
    commonSymptoms: [
      'Periodic high fever accompanied by shaking chills and rigor',
      'Profuse sweating as body temperature drops',
      'Headache, body aches, and joint discomfort',
      'Fatigue, generalized malaise, and loss of appetite',
      'Mild nausea and vomiting'
    ],
    redFlagSymptoms: [
      'Confusion, drowsiness, repeated seizures, or coma (Cerebral Malaria)',
      'Severe anemia manifested by extreme pallor and weakness',
      'Difficulty breathing, deep rapid breathing, or respiratory distress',
      'Dark or tea-colored urine (Blackwater fever / hemoglobinuria)',
      'Jaundice (yellowing of eyes and skin) indicating liver compromise'
    ],
    prevention: [
      'Sleep under Long-Lasting Insecticidal Nets (LLINs) every night',
      'Use indoor residual spraying (IRS) in endemic zones',
      'Prevent stagnant water accumulation in ditches, puddles, and domestic containers',
      'Apply mosquito repellents during evening and nighttime hours',
      'Use screen netting on windows and doors'
    ],
    selfCareAndPrecautions: [
      'Seek prompt blood smear testing or Rapid Diagnostic Test (RDT) at the first onset of periodic fever with chills',
      'Drink adequate fluids and rest',
      'Do not self-medicate with anti-malarials without microscopic or RDT confirmation'
    ],
    whenToSeekImmediateCare: [
      'Inability to sit or stand, extreme drowsiness or confusion',
      'Inability to retain oral fluids or persistent vomiting',
      'Convulsions or seizures',
      'Severe breathlessness or yellowish discoloration of eyes'
    ],
    sources: [
      {
        name: 'World Health Organization (WHO) Malaria Guidelines',
        url: 'https://www.who.int/news-room/fact-sheets/detail/malaria',
        organization: 'WHO',
        lastReviewed: '2024-03-27'
      },
      {
        name: 'MoHFW India - National Strategic Plan for Malaria Elimination',
        url: 'https://mohfw.gov.in',
        organization: 'MoHFW',
        lastReviewed: '2024-06-18'
      }
    ],
    keywords: ['malaria', 'anopheles', 'plasmodium', 'chills', 'rigor', 'falciparum', 'vivax', 'मलेरिया', 'हिवताप']
  },
  {
    id: 'influenza',
    name: 'Seasonal Influenza (Flu)',
    localNames: {
      hi: 'मौसमी इन्फ्लुएंजा / फ्लू',
      mr: 'हंगामी इन्फ्लुएंझा / फ्लू'
    },
    category: 'respiratory',
    overview: 'Influenza is an acute respiratory infection caused by influenza viruses (types A, B, C, D) circulating worldwide. It spreads easily from person to person through respiratory droplets when coughing, sneezing, or talking, and through contaminated surfaces.',
    commonSymptoms: [
      'Sudden onset of fever and chills',
      'Dry cough and sore throat',
      'Runny or stuffy nose',
      'Significant muscle or body aches and headache',
      'Moderate to severe fatigue and exhaustion'
    ],
    redFlagSymptoms: [
      'Difficulty breathing or shortness of breath',
      'Persistent pain or pressure in the chest or abdomen',
      'Persistent dizziness, confusion, or inability to wake up',
      'Bluish lips, face, or nail beds (cyanosis / low oxygen)',
      'Fever or cough that improves but then returns with greater severity'
    ],
    prevention: [
      'Annual seasonal influenza vaccination for high-risk groups (elderly, pregnant, immunocompromised)',
      'Frequent handwashing with soap and water or alcohol-based hand rub',
      'Cover coughs and sneezes with a tissue or flexed elbow',
      'Wear a well-fitting mask in crowded indoor spaces during flu outbreaks',
      'Avoid touching eyes, nose, and mouth with unwashed hands'
    ],
    selfCareAndPrecautions: [
      'Stay home and isolate to prevent transmission to vulnerable individuals',
      'Ensure plenty of bed rest and fluid intake (warm soups, herbal infusions, water)',
      'Steam inhalation and saline gargles to soothe throat and nasal passages',
      'Consult a physician early if you have underlying asthma, diabetes, or heart conditions'
    ],
    whenToSeekImmediateCare: [
      'Chest pain, shortness of breath, or wheezing',
      'Confusion, lethargy, or unresponsiveness',
      'High fever persisting beyond 3-4 days without relief'
    ],
    sources: [
      {
        name: 'CDC Influenza Prevention and Treatment Factsheet',
        url: 'https://www.cdc.gov/flu/about/index.html',
        organization: 'CDC',
        lastReviewed: '2024-08-12'
      },
      {
        name: 'WHO Global Influenza Programme',
        url: 'https://www.who.int/teams/global-influenza-programme',
        organization: 'WHO',
        lastReviewed: '2024-05-02'
      }
    ],
    keywords: ['flu', 'influenza', 'cough', 'cold', 'sore throat', 'body ache', 'fever', 'respiratory', 'फ्लू', 'इन्फ्लुएंजा']
  },
  {
    id: 'tuberculosis',
    name: 'Tuberculosis (TB)',
    localNames: {
      hi: 'क्षयरोग / टीबी (तपेदिक)',
      mr: 'क्षयरोग / टीबी'
    },
    category: 'respiratory',
    overview: 'Tuberculosis is an infectious bacterial disease caused by Mycobacterium tuberculosis, primarily affecting the lungs (pulmonary TB). It spreads through airborne droplets when a person with untreated active pulmonary TB coughs, sneezes, or spits. India has the National TB Elimination Programme (NTEP) offering free diagnosis and treatment.',
    commonSymptoms: [
      'Persistent cough lasting 2 weeks or more',
      'Coughing up blood or blood-streaked sputum (hemoptysis)',
      'Low-grade fever, especially in late afternoon or evening',
      'Drenching night sweats',
      'Unexplained weight loss and loss of appetite (anorexia)',
      'General weakness and chronic fatigue'
    ],
    redFlagSymptoms: [
      'Massive coughing up of blood (hemoptysis >100 ml)',
      'Severe respiratory distress or inability to catch breath',
      'Severe pleuritic chest pain',
      'Marked wasting and inability to walk'
    ],
    prevention: [
      'BCG vaccination at birth under National Immunization Schedule',
      'Prompt diagnosis and full course completion of Directly Observed Therapy (DOTS)',
      'Good room ventilation and natural sunlight in living areas',
      'Cough etiquette: covering mouth and nose with tissue or cloth',
      'Screening household contacts of confirmed active TB patients'
    ],
    selfCareAndPrecautions: [
      'High-protein nutritious diet (pulses, milk, eggs, nuts) to aid immune recovery',
      'Strict adherence: NEVER discontinue anti-TB medicines without doctor instruction to prevent Drug-Resistant TB (MDR-TB)',
      'Avail government Nikshay Poshan Yojana nutritional financial benefit'
    ],
    whenToSeekImmediateCare: [
      'Any cough lasting longer than 2 weeks requires sputum testing at nearest government Health & Wellness Center (Arogya Mandir)',
      'Sudden breathlessness or coughing fresh red blood'
    ],
    sources: [
      {
        name: 'Central TB Division, MoHFW India (NTEP / Ni-kshay)',
        url: 'https://tbcindia.gov.in',
        organization: 'MoHFW',
        lastReviewed: '2024-06-20'
      },
      {
        name: 'WHO Global Tuberculosis Report',
        url: 'https://www.who.int/teams/global-tuberculosis-programme/tb-reports',
        organization: 'WHO',
        lastReviewed: '2024-04-30'
      }
    ],
    keywords: ['tb', 'tuberculosis', 'cough 2 weeks', 'sputum', 'hemoptysis', 'weight loss', 'night sweats', 'nikshay', 'टीबी', 'क्षयरोग']
  },
  {
    id: 'diabetes',
    name: 'Type 2 Diabetes Mellitus',
    localNames: {
      hi: 'टाइप 2 मधुमेह (शुगर)',
      mr: 'मधुमेह (डायबेटिस / साखर रोग)'
    },
    category: 'chronic',
    overview: 'Type 2 Diabetes is a chronic metabolic disorder characterized by elevated levels of blood glucose (hyperglycemia), which leads over time to serious damage to the heart, blood vessels, eyes, kidneys, and nerves. It results from the body becoming resistant to insulin or failing to produce enough insulin.',
    commonSymptoms: [
      'Frequent urination, especially at night (polyuria)',
      'Excessive thirst and dry mouth (polydipsia)',
      'Persistent hunger even after eating (polyphagia)',
      'Unexplained weight loss despite eating well',
      'Blurry vision',
      'Slow-healing cuts, sores, or recurrent infections',
      'Tingling, numbness, or pain in hands or feet (peripheral neuropathy)'
    ],
    redFlagSymptoms: [
      'Diabetic Ketoacidosis (DKA) / Hyperosmolar state: rapid deep breathing, fruity-smelling breath',
      'Extreme confusion, disorientation, delirium, or loss of consciousness',
      'Hypoglycemia crisis (low blood sugar <70 mg/dL): profuse sweating, trembling, paleness, palpitations, confusion',
      'Non-healing deep foot ulcer with blackish discoloration or foul odor (diabetic foot)'
    ],
    prevention: [
      'Maintain healthy body weight (BMI between 18.5 - 22.9 kg/m² for South Asian adults)',
      'Engage in at least 150 minutes of moderate aerobic exercise (brisk walking, cycling) per week',
      'Follow a balanced diet rich in whole grains, green leafy vegetables, legumes, and lean protein',
      'Limit refined sugars, sweets, sweetened beverages, and trans fats',
      'Regular screening of fasting blood sugar and HbA1c from age 30+'
    ],
    selfCareAndPrecautions: [
      'Daily foot inspection for cuts, blisters, or calluses',
      'Take prescribed medications regularly as directed by your physician',
      'Keep fast-acting glucose (sugar cubes or juice) handy in case of low blood sugar symptoms'
    ],
    whenToSeekImmediateCare: [
      'Blood sugar reading >350 mg/dL accompanied by nausea, vomiting, or deep breathing',
      'Severe hypoglycemia that does not resolve 15 minutes after consuming 15g simple carbohydrates',
      'Sudden loss of vision or severe chest tightness'
    ],
    sources: [
      {
        name: 'ICMR Guidelines for Management of Type 2 Diabetes',
        url: 'https://main.icmr.nic.in',
        organization: 'ICMR',
        lastReviewed: '2024-05-14'
      },
      {
        name: 'World Health Organization (WHO) Diabetes Key Facts',
        url: 'https://www.who.int/news-room/fact-sheets/detail/diabetes',
        organization: 'WHO',
        lastReviewed: '2024-04-10'
      }
    ],
    keywords: ['diabetes', 'sugar', 'glucose', 'insulin', 'hba1c', 'polyuria', 'thirst', 'diabetic', 'मधुमेह', 'शुगर']
  },
  {
    id: 'hypertension',
    name: 'Hypertension (High Blood Pressure)',
    localNames: {
      hi: 'उच्च रक्तचाप (हाई ब्लड प्रेशर)',
      mr: 'उच्च रक्तदाब (हाय बीपी)'
    },
    category: 'chronic',
    overview: 'Hypertension is defined when blood pressure readings consistently measure 140/90 mmHg or higher. Often called the "silent killer" because it typically has no warning symptoms until significant vascular damage or target organ damage (heart attack, stroke, kidney failure) has occurred.',
    commonSymptoms: [
      'Often asymptomatic ("Silent Killer")',
      'Morning headaches occurring in the back of the head (occipital)',
      'Dizziness or lightheadedness',
      'Tinnitus (buzzing or ringing in the ears)',
      'Occasional nosebleeds or mild shortness of breath upon exertion'
    ],
    redFlagSymptoms: [
      'Hypertensive Crisis (Systolic >180 and/or Diastolic >120 mmHg)',
      'Crushing chest pain radiating to arm, neck, or jaw',
      'Sudden numbness or paralysis of the face, arm, or leg (especially one side of the body)',
      'Sudden difficulty speaking, slurred speech, or confusion',
      'Sudden severe headache ("worst headache of life") or sudden vision loss'
    ],
    prevention: [
      'Reduce dietary sodium intake to less than 5 grams (1 teaspoon) of salt per day',
      'Adopt the DASH diet (rich in fruits, vegetables, potassium, low-fat dairy)',
      'Engage in 30 minutes of daily moderate cardiovascular exercise',
      'Avoid tobacco in all forms (smoking, bidi, gutkha) and limit alcohol',
      'Manage chronic mental stress through meditation, yoga, and adequate sleep'
    ],
    selfCareAndPrecautions: [
      'Monitor blood pressure at home with an automated, calibrated upper-arm cuff',
      'Never discontinue antihypertensive medication even if feeling completely fine',
      'Maintain a logbook of blood pressure measurements for doctor reviews'
    ],
    whenToSeekImmediateCare: [
      'BP reading > 180/120 with chest pain, shortness of breath, back pain, or neurological deficits (REQUIRES IMMEDIATE 112/108 EMERGENCY)'
    ],
    sources: [
      {
        name: 'India Hypertension Control Initiative (IHCI - MoHFW, ICMR, WHO)',
        url: 'https://www.ihci.in',
        organization: 'MoHFW',
        lastReviewed: '2024-05-25'
      },
      {
        name: 'World Health Organization (WHO) Hypertension Guidelines',
        url: 'https://www.who.int/news-room/fact-sheets/detail/hypertension',
        organization: 'WHO',
        lastReviewed: '2024-03-16'
      }
    ],
    keywords: ['hypertension', 'blood pressure', 'high bp', 'stroke', 'heart attack', 'silent killer', 'systolic', 'उच्च रक्तचाप', 'रक्तदाब']
  },
  {
    id: 'heat-stroke',
    name: 'Heat Stroke & Heat Exhaustion',
    localNames: {
      hi: 'लू लगना / हीट स्ट्रोक',
      mr: 'उष्माघात / उन्हाचा तडाखा'
    },
    category: 'environmental',
    overview: 'Heat stroke is a medical emergency caused by the failure of the body temperature-regulating mechanism when exposed to extreme ambient heat, especially with high humidity and physical exertion. The core body temperature rises above 40°C (104°F), risking permanent brain and multi-organ damage or fatality.',
    commonSymptoms: [
      'Heat Exhaustion (Early Stage): heavy sweating, pale cold clammy skin, fast weak pulse, muscle cramps, dizziness, nausea, headache'
    ],
    redFlagSymptoms: [
      'High core body temperature (104°F / 40°C or higher)',
      'Altered mental state, confusion, agitation, slurred speech, delirium, coma',
      'Hot, red, dry skin (or profuse sweating in exertional heat stroke)',
      'Rapid, shallow breathing and rapid bounding pulse',
      'Seizures or collapse'
    ],
    prevention: [
      'Avoid direct sun exposure between 11:00 AM and 4:00 PM during heatwave alerts',
      'Drink plenty of water, buttermilk (chaas), coconut water, aam panna, and ORS even before feeling thirsty',
      'Wear lightweight, loose-fitting, light-colored cotton clothes and wide-brimmed hats or umbrella',
      'Never leave children or pets inside parked vehicles even for a few minutes',
      'Check local IMD (India Meteorological Department) heatwave color warnings (Yellow/Orange/Red)'
    ],
    selfCareAndPrecautions: [
      'For Heat Exhaustion: Move immediately to a cool, shaded, or air-conditioned area',
      'Loosen tight clothing and sip cool water slowly',
      'Apply wet towels or ice packs to the neck, armpits, and groin'
    ],
    whenToSeekImmediateCare: [
      'Heat stroke is an IMMEDIATE MEDICAL EMERGENCY. Call 108/112 ambulance instantly. While waiting, immerse or douse the person in cold water and fan vigorously to lower body temperature.'
    ],
    sources: [
      {
        name: 'National Disaster Management Authority (NDMA) Heatwave Action Plan',
        url: 'https://ndma.gov.in',
        organization: 'NDMA',
        lastReviewed: '2024-04-01'
      },
      {
        name: 'MoHFW India - National Programme on Climate Change & Human Health (NPCCHH)',
        url: 'https://mohfw.gov.in',
        organization: 'MoHFW',
        lastReviewed: '2024-05-18'
      }
    ],
    keywords: ['heat stroke', 'heatwave', 'loo', 'dehydration', 'hyperthermia', 'sunstroke', 'लू', 'उष्माघात']
  },
  {
    id: 'food-poisoning',
    name: 'Food Poisoning / Acute Gastroenteritis',
    localNames: {
      hi: 'फूड पॉइजनिंग / खाद्य विषाक्तता (उल्टी-दस्त)',
      mr: 'अन्नाची विषबाधा / गॅस्ट्रो (उलट्या-जुलाब)'
    },
    category: 'gastrointestinal',
    overview: 'Food poisoning is an illness caused by consuming food or drinking water contaminated with infectious organisms (bacteria like Salmonella, E. coli, Campylobacter, or viruses like Norovirus, Rotavirus) or their toxins. It commonly surges during summer and monsoon seasons.',
    commonSymptoms: [
      'Nausea and vomiting',
      'Watery or loose diarrhea',
      'Abdominal cramps and stomach pain',
      'Low-grade fever and chills',
      'Weakness and loss of appetite'
    ],
    redFlagSymptoms: [
      'Signs of severe dehydration: excessive thirst, dry mouth, little to no urination, dark urine, sunken eyes, severe dizziness',
      'Frequent vomiting preventing retention of any oral liquids for >12-24 hours',
      'Bloody diarrhea or black tarry stools',
      'High fever (>102°F / 38.9°C)',
      'Severe intractable abdominal pain'
    ],
    prevention: [
      'Wash hands thoroughly with soap for 20 seconds before cooking or eating',
      'Drink only boiled, filtered, or sealed bottled water',
      'Cook food thoroughly, especially meat, poultry, and eggs',
      'Keep raw and cooked foods strictly separate to prevent cross-contamination',
      'Refrigerate perishable foods promptly within 2 hours of preparation'
    ],
    selfCareAndPrecautions: [
      'Continuous oral rehydration therapy with WHO-formulated ORS solution',
      'Eat bland, easy-to-digest foods: bananas, rice, applesauce, toast (BRAT diet), curd rice, khichdi',
      'Avoid spicy, oily foods, caffeine, and dairy products (except fresh curd/yogurt) until gut recovers',
      'Do not routinely take anti-motility drugs (like loperamide) without doctor approval if fever or bloody stools are present'
    ],
    whenToSeekImmediateCare: [
      'Inability to keep liquids down for more than 12 hours',
      'Blood in vomit or stool',
      'Extreme dizziness, fainting upon standing, or confusion'
    ],
    sources: [
      {
        name: 'World Health Organization (WHO) Food Safety Factsheet',
        url: 'https://www.who.int/news-room/fact-sheets/detail/food-safety',
        organization: 'WHO',
        lastReviewed: '2024-06-05'
      },
      {
        name: 'Food Safety and Standards Authority of India (FSSAI)',
        url: 'https://fssai.gov.in',
        organization: 'MoHFW',
        lastReviewed: '2024-07-22'
      }
    ],
    keywords: ['food poisoning', 'gastroenteritis', 'vomiting', 'diarrhea', 'ors', 'dehydration', 'stomach infection', 'फूड पॉइजनिंग', 'उल्टी', 'जुलाब']
  }
];
