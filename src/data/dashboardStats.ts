import { DashboardMetric } from '../types';

export const KEY_METRICS: DashboardMetric[] = [
  {
    title: 'Public Health Inquiries',
    value: '14,820',
    change: '+24.6% this week',
    trend: 'up',
    description: 'Total queries answered with grounded knowledge'
  },
  {
    title: 'Red-Flag Emergencies Triaged',
    value: '487',
    change: '100% intercepted',
    trend: 'neutral',
    description: 'Immediate emergency 112/108 escalation provided'
  },
  {
    title: 'MedConnect Guidance Sessions',
    value: '1,230',
    change: '+18% growth',
    trend: 'up',
    description: 'Verified MBBS student health awareness sessions'
  },
  {
    title: 'Knowledge Grounding Score',
    value: '99.4%',
    change: 'Zero hallucination',
    trend: 'up',
    description: 'Grounded against WHO, MoHFW, CDC and ICMR repositories'
  }
];

export const TOP_HEALTH_TOPICS = [
  { name: 'Dengue & Platelet Awareness', inquiries: 4210, percentage: 28.4, color: '#0d9488' },
  { name: 'Seasonal Influenza & Viral Cough', inquiries: 3120, percentage: 21.1, color: '#0284c7' },
  { name: 'Heat Stroke & Dehydration', inquiries: 2540, percentage: 17.1, color: '#f59e0b' },
  { name: 'Type 2 Diabetes Lifestyle', inquiries: 2010, percentage: 13.6, color: '#8b5cf6' },
  { name: 'Malaria & Vector Prevention', inquiries: 1620, percentage: 10.9, color: '#10b981' },
  { name: 'Hypertension Awareness', inquiries: 1320, percentage: 8.9, color: '#ec4899' }
];

export const LANGUAGE_DISTRIBUTION = [
  { language: 'English', code: 'en', queries: 6817, share: '46%' },
  { language: 'Hindi (हिन्दी)', code: 'hi', queries: 5187, share: '35%' },
  { language: 'Marathi (मराठी)', code: 'mr', queries: 2816, share: '19%' }
];

export const RED_FLAG_BREAKDOWN = [
  { category: 'Respiratory Distress / Shortness of Breath', count: 184, urgency: 'Critical 108' },
  { category: 'Severe Crushing Chest Pain / Cardiac', count: 142, urgency: 'Critical 108' },
  { category: 'Altered Mental Status / Severe Confusion', count: 76, urgency: 'Immediate Medical' },
  { category: 'Severe Bleeding / Mucosal Hemorrhage', count: 53, urgency: 'Emergency Hospital' },
  { category: 'Seizures / Loss of Consciousness', count: 32, urgency: 'Critical 108' }
];
