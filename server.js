const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const { OpenAI } = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-demo-key'
});

// In-memory storage (replace with database in production)
const leads = [];
const jobs = [];
const customers = [];
const communications = [];
const analytics = {
  totalLeads: 0,
  convertedLeads: 0,
  averageResponseTime: 0,
  totalRevenue: 0,
  jobsCompleted: 0
};

// ============================================
// LEAD MANAGEMENT ENDPOINTS
// ============================================

// Create new lead (instant capture)
app.post('/api/leads', async (req, res) => {
  try {
    const { name, phone, email, service, message, source } = req.body;
    
    const lead = {
      id: `lead_${Date.now()}`,
      name,
      phone,
      email,
      service, // 'roofing' or 'hvac'
      message,
      source, // 'web', 'phone', 'sms', 'email'
      status: 'new',
      score: calculateLeadScore(req.body),
      createdAt: new Date(),
      responseTime: null,
      assignedTo: null
    };

    leads.push(lead);
    analytics.totalLeads++;

    // Trigger instant AI response
    await sendInstantResponse(lead);

    // Auto-assign to available technician
    assignLeadToTechnician(lead);

    res.json({ success: true, lead });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all leads with filtering
app.get('/api/leads', (req, res) => {
  const { status, service, sort } = req.query;
  
  let filtered = leads;
  
  if (status) filtered = filtered.filter(l => l.status === status);
  if (service) filtered = filtered.filter(l => l.service === service);
  
  if (sort === 'score') filtered.sort((a, b) => b.score - a.score);
  if (sort === 'recent') filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json(filtered);
});

// Get single lead
app.get('/api/leads/:id', (req, res) => {
  const lead = leads.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json(lead);
});

// Update lead status
app.put('/api/leads/:id', (req, res) => {
  const lead = leads.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  
  const { status, notes } = req.body;
  lead.status = status || lead.status;
  lead.notes = notes || lead.notes;
  
  if (status === 'converted') {
    analytics.convertedLeads++;
  }
  
  res.json(lead);
});

// ============================================
// SCHEDULING & DISPATCH ENDPOINTS
// ============================================

// Create job/appointment
app.post('/api/jobs', (req, res) => {
  try {
    const { customerId, leadId, serviceType, scheduledDate, duration, notes } = req.body;
    
    const job = {
      id: `job_${Date.now()}`,
      customerId,
      leadId,
      serviceType,
      scheduledDate: new Date(scheduledDate),
      duration, // in minutes
      notes,
      status: 'scheduled',
      assignedTo: null,
      createdAt: new Date()
    };

    jobs.push(job);

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get jobs with filters
app.get('/api/jobs', (req, res) => {
  const { status, date, technician } = req.query;
  
  let filtered = jobs;
  
  if (status) filtered = filtered.filter(j => j.status === status);
  if (date) {
    const filterDate = new Date(date);
    filtered = filtered.filter(j => 
      new Date(j.scheduledDate).toDateString() === filterDate.toDateString()
    );
  }
  if (technician) filtered = filtered.filter(j => j.assignedTo === technician);
  
  res.json(filtered);
});

// Dispatch job to technician
app.post('/api/jobs/:id/dispatch', (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  
  const { technicianId } = req.body;
  job.assignedTo = technicianId;
  job.status = 'assigned';
  
  // Send notification to technician
  sendTechnicianNotification(technicianId, job);
  
  res.json(job);
});

// ============================================
// CUSTOMER COMMUNICATION ENDPOINTS
// ============================================

// Send message (SMS/Email)
app.post('/api/messages', async (req, res) => {
  try {
    const { to, channel, message, type } = req.body; // channel: 'sms' or 'email'
    
    const communication = {
      id: `msg_${Date.now()}`,
      to,
      channel,
      message,
      type, // 'confirmation', 'reminder', 'followup', 'review_request'
      sentAt: new Date(),
      status: 'sent'
    };

    communications.push(communication);

    // In production, integrate with Twilio (SMS) or SendGrid (Email)
    console.log(`[${channel.toUpperCase()}] to ${to}: ${message}`);

    res.json({ success: true, communication });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get communication history
app.get('/api/messages', (req, res) => {
  const { customerId, channel } = req.query;
  
  let filtered = communications;
  if (customerId) filtered = filtered.filter(c => c.to === customerId);
  if (channel) filtered = filtered.filter(c => c.channel === channel);
  
  res.json(filtered);
});

// ============================================
// ANALYTICS ENDPOINTS
// ============================================

// Get lead analytics
app.get('/api/analytics/leads', (req, res) => {
  const conversionRate = analytics.totalLeads > 0 
    ? (analytics.convertedLeads / analytics.totalLeads * 100).toFixed(2)
    : 0;

  res.json({
    totalLeads: analytics.totalLeads,
    convertedLeads: analytics.convertedLeads,
    conversionRate: `${conversionRate}%`,
    averageResponseTime: `${analytics.averageResponseTime}s`,
    leadsByStatus: {
      new: leads.filter(l => l.status === 'new').length,
      contacted: leads.filter(l => l.status === 'contacted').length,
      qualified: leads.filter(l => l.status === 'qualified').length,
      converted: leads.filter(l => l.status === 'converted').length,
      lost: leads.filter(l => l.status === 'lost').length
    }
  });
});

// Get revenue analytics
app.get('/api/analytics/revenue', (req, res) => {
  res.json({
    totalRevenue: analytics.totalRevenue,
    jobsCompleted: analytics.jobsCompleted,
    averageJobValue: analytics.jobsCompleted > 0 
      ? (analytics.totalRevenue / analytics.jobsCompleted).toFixed(2)
      : 0,
    activeJobs: jobs.filter(j => j.status !== 'completed').length
  });
});

// Get scheduling efficiency
app.get('/api/analytics/scheduling', (req, res) => {
  const completedJobs = jobs.filter(j => j.status === 'completed');
  const onTimeJobs = completedJobs.filter(j => j.completedAt <= j.scheduledDate);
  
  res.json({
    totalJobs: jobs.length,
    completedJobs: completedJobs.length,
    onTimePercentage: completedJobs.length > 0
      ? (onTimeJobs.length / completedJobs.length * 100).toFixed(2)
      : 0,
    averageJobDuration: completedJobs.length > 0
      ? (completedJobs.reduce((sum, j) => sum + j.duration, 0) / completedJobs.length).toFixed(0)
      : 0
  });
});

// ============================================
// AI AGENT FUNCTIONS
// ============================================

// Calculate lead score based on urgency, budget, timeline
function calculateLeadScore(leadData) {
  let score = 50; // Base score
  
  // Urgency factors
  if (leadData.message && leadData.message.toLowerCase().includes('urgent')) score += 20;
  if (leadData.message && leadData.message.toLowerCase().includes('emergency')) score += 30;
  if (leadData.message && leadData.message.toLowerCase().includes('asap')) score += 15;
  
  // Service type factors
  if (leadData.service === 'roofing' && leadData.message && 
      (leadData.message.toLowerCase().includes('leak') || 
       leadData.message.toLowerCase().includes('damage'))) {
    score += 25;
  }
  
  // Contact method factors (phone calls are higher intent)
  if (leadData.source === 'phone') score += 10;
  
  return Math.min(score, 100); // Cap at 100
}

// Send instant AI response to lead
async function sendInstantResponse(lead) {
  try {
    const responseTime = Date.now();
    
    // Generate contextual response using OpenAI
    let response;
    
    if (lead.service === 'roofing') {
      response = `Hi ${lead.name}, thanks for reaching out! We received your roofing inquiry and a specialist will contact you shortly. In the meantime, if you have any photos of the damage, please reply with them. We typically respond within 15 minutes. - ${lead.phone ? 'Roofing Team' : 'Roofing Team'}`;
    } else if (lead.service === 'hvac') {
      response = `Hi ${lead.name}, thank you for contacting us about your HVAC needs. We're here to help! A technician will reach out to you shortly to discuss your system and schedule a service. - HVAC Team`;
    } else {
      response = `Hi ${lead.name}, thanks for reaching out! We received your inquiry and will get back to you shortly.`;
    }

    // Send response via SMS or Email
    if (lead.phone) {
      // Send SMS (Twilio integration would go here)
      console.log(`[SMS] ${lead.phone}: ${response}`);
    }
    if (lead.email) {
      // Send Email (SendGrid integration would go here)
      console.log(`[EMAIL] ${lead.email}: ${response}`);
    }

    lead.responseTime = (Date.now() - responseTime) / 1000; // in seconds
    lead.status = 'contacted';
    
    // Update analytics
    analytics.averageResponseTime = (analytics.averageResponseTime + lead.responseTime) / 2;
    
  } catch (error) {
    console.error('Error sending instant response:', error);
  }
}

// Auto-assign lead to available technician
function assignLeadToTechnician(lead) {
  // In production, this would query technician availability
  // For now, assign to first available (simulated)
  const availableTechs = ['tech_001', 'tech_002', 'tech_003'];
  lead.assignedTo = availableTechs[Math.floor(Math.random() * availableTechs.length)];
}

// Send notification to technician
function sendTechnicianNotification(technicianId, job) {
  console.log(`[NOTIFICATION] Technician ${technicianId}: New job assigned - ${job.id}`);
  // In production, use Socket.io or push notifications
}

// ============================================
// HEALTH CHECK & STARTUP
// ============================================

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Roofing & HVAC AI Agent Server running on port ${PORT}`);
  console.log(`📊 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
