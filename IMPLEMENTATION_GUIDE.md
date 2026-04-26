# Implementation Guide - Roofing & HVAC AI Agent

## Overview

This guide walks you through implementing the AI Agent for your roofing or HVAC business clients. The system is designed to be deployed quickly while maintaining flexibility for customization.

## Phase 1: Setup & Configuration (Days 1-2)

### Step 1: Server Setup
1. Deploy the Node.js server to your hosting provider
2. Configure PostgreSQL database
3. Set up Redis for job queue
4. Configure environment variables

### Step 2: API Key Configuration
1. **OpenAI API**
   - Sign up at https://platform.openai.com
   - Create API key
   - Set `OPENAI_API_KEY` in environment

2. **Twilio (SMS)**
   - Sign up at https://www.twilio.com
   - Get account SID and auth token
   - Purchase a phone number
   - Set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`

3. **SendGrid (Email)**
   - Sign up at https://sendgrid.com
   - Create API key
   - Set `SENDGRID_API_KEY`

4. **Stripe (Optional - Payment Processing)**
   - Sign up at https://stripe.com
   - Get secret and publishable keys
   - Set `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`

### Step 3: Database Setup
```sql
-- Create main database
CREATE DATABASE roofing_hvac_db;

-- Create tables (run Prisma migrations)
npx prisma migrate dev --name init
```

## Phase 2: Lead Capture Integration (Days 3-4)

### Option A: Web Form Integration
Add this HTML form to client website:

```html
<form id="lead-form" action="https://your-api.com/api/leads" method="POST">
  <input type="text" name="name" placeholder="Your Name" required>
  <input type="email" name="email" placeholder="Your Email" required>
  <input type="tel" name="phone" placeholder="Your Phone" required>
  <select name="service" required>
    <option value="">Select Service</option>
    <option value="roofing">Roofing</option>
    <option value="hvac">HVAC</option>
  </select>
  <textarea name="message" placeholder="Describe your issue" required></textarea>
  <input type="hidden" name="source" value="web">
  <button type="submit">Get Free Quote</button>
</form>

<script>
  document.getElementById('lead-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    const response = await fetch('https://your-api.com/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    alert('Thank you! We\'ll contact you shortly.');
    e.target.reset();
  });
</script>
```

### Option B: Phone Number Integration
1. Set up Twilio phone number for business
2. Configure IVR to capture caller information
3. Send lead data to API via webhook

### Option C: SMS Integration
1. Set up SMS keyword (e.g., "ROOFING" to 12345)
2. Capture phone number and message
3. Trigger instant response via Twilio

## Phase 3: Automated Response Setup (Days 5-6)

### Configure Response Templates

**Roofing Service Responses:**
```
Urgent (emergency/leak/damage):
"Hi [NAME], we received your urgent roofing request. A specialist is being dispatched now. 
Reply with photos if possible. ETA: 15 minutes. - [COMPANY] Roofing"

Standard (inspection/maintenance):
"Hi [NAME], thanks for contacting us! We'll schedule a free inspection within 24 hours. 
Expect a call shortly. - [COMPANY] Roofing"
```

**HVAC Service Responses:**
```
Urgent (no heat/AC):
"Hi [NAME], we understand your HVAC emergency. A technician is being sent to your location now. 
We'll have you comfortable shortly. - [COMPANY] HVAC"

Standard (maintenance/repair):
"Hi [NAME], thanks for reaching out! We'll schedule your HVAC service within 24 hours. 
A specialist will call you shortly. - [COMPANY] HVAC"
```

### Test Response System
```bash
curl -X POST http://localhost:3001/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Customer",
    "phone": "+1-555-0123",
    "email": "test@example.com",
    "service": "roofing",
    "message": "My roof has a leak",
    "source": "web"
  }'
```

Verify SMS/email is received within 60 seconds.

## Phase 4: Scheduling Integration (Days 7-8)

### Option A: Google Calendar Integration
1. Set up Google OAuth credentials
2. Connect business Google Calendar
3. Sync technician availability
4. Enable automatic appointment booking

### Option B: Calendly Integration
1. Create Calendly account for each technician
2. Configure availability windows
3. Connect via API
4. Enable customer self-booking

### Option C: Manual Scheduling
1. Use dashboard to create appointments
2. Manually assign to technicians
3. Send confirmations via SMS/email

## Phase 5: Technician Mobile App (Days 9-10)

### Setup Mobile Access
1. Provide technician login credentials
2. Install mobile app (iOS/Android)
3. Configure push notifications
4. Test job dispatch and updates

### Key Features for Technicians
- View assigned jobs for the day
- Navigation to job locations
- Customer information and history
- Photo capture for before/after
- Digital signature for completion
- Real-time chat with dispatcher

## Phase 6: Customer Communication (Days 11-12)

### Automated Sequences

**Pre-Appointment (24 hours before)**
```
SMS: "Hi [NAME], reminder: your [SERVICE] appointment is tomorrow at [TIME]. 
Reply CONFIRM to confirm or RESCHEDULE to change. - [COMPANY]"
```

**Appointment Day (2 hours before)**
```
SMS: "Hi [NAME], [TECHNICIAN] is on the way! ETA: [TIME]. 
Reply DELAY if you need more time. - [COMPANY]"
```

**Post-Service (same day)**
```
SMS: "Hi [NAME], thanks for choosing us! How was your experience? 
Reply with feedback or call [PHONE]. - [COMPANY]"

Email: "Please rate your experience and leave a review: [REVIEW_LINK]"
```

**Follow-up (1 week later)**
```
SMS: "Hi [NAME], hope you're satisfied with your [SERVICE]! 
Need anything else? Call [PHONE] - [COMPANY]"
```

## Phase 7: Dashboard & Analytics (Days 13-14)

### Setup Dashboard Access
1. Create admin account
2. Configure dashboard widgets
3. Set up automated reports
4. Configure alert thresholds

### Key Metrics to Track
- **Lead Metrics**: Total leads, conversion rate, average response time
- **Revenue Metrics**: Total revenue, average job value, customer lifetime value
- **Operational Metrics**: Technician utilization, on-time completion rate
- **Marketing Metrics**: Cost per lead, cost per acquisition, marketing ROI

### Automated Reports
- Daily: Lead summary and response times
- Weekly: Revenue and technician performance
- Monthly: Full business analytics and trends

## Phase 8: Training & Handoff (Days 15-16)

### Client Training
1. **Admin Training** (2 hours)
   - Dashboard navigation
   - Lead management
   - Analytics interpretation
   - Settings and customization

2. **Technician Training** (1 hour)
   - Mobile app usage
   - Job dispatch system
   - Customer communication
   - Photo and documentation

3. **Team Training** (1 hour)
   - Lead response procedures
   - Scheduling best practices
   - Customer communication standards

### Documentation Provided
- API Documentation
- User Guides (Admin, Technician, Customer)
- Troubleshooting Guide
- FAQ

## Phase 9: Optimization & Tuning (Weeks 3-4)

### Monitor Key Metrics
- Lead response time (target: < 60 seconds)
- Lead conversion rate (target: +25-40%)
- Technician utilization (target: 80%+)
- Customer satisfaction (target: 4.5+ stars)

### Optimization Actions
1. **Response Time**: Ensure SMS/email service is configured correctly
2. **Conversion Rate**: A/B test response messages
3. **Utilization**: Optimize scheduling and route planning
4. **Satisfaction**: Improve follow-up communication

### Continuous Improvement
- Weekly review of metrics
- Monthly optimization meetings
- Quarterly feature updates
- Annual system audit

## Troubleshooting

### Lead Not Responding
**Problem**: Leads created but no response sent
**Solution**: 
1. Check OpenAI API key is valid
2. Verify Twilio/SendGrid configuration
3. Check server logs for errors
4. Test API directly with curl

### Slow Response Time
**Problem**: Leads taking > 60 seconds to respond
**Solution**:
1. Check server performance (CPU, memory)
2. Verify database connection
3. Check API rate limits
4. Scale server if needed

### Scheduling Issues
**Problem**: Appointments not syncing with calendar
**Solution**:
1. Verify Google Calendar/Calendly integration
2. Check API credentials
3. Verify timezone settings
4. Test calendar sync manually

### Communication Not Sending
**Problem**: SMS/emails not being delivered
**Solution**:
1. Verify Twilio/SendGrid account has credits
2. Check phone number/email format
3. Verify API keys are correct
4. Check spam folder for emails

## Success Checklist

- [ ] Server deployed and running
- [ ] Database configured and migrated
- [ ] API keys configured (OpenAI, Twilio, SendGrid)
- [ ] Lead capture form integrated
- [ ] Instant response system tested
- [ ] Scheduling system configured
- [ ] Technician mobile app deployed
- [ ] Customer communication sequences set up
- [ ] Dashboard configured
- [ ] Analytics reports running
- [ ] Team trained
- [ ] Metrics being tracked
- [ ] Optimization plan in place

## Next Steps

1. **Week 1**: Monitor lead response times and conversion rates
2. **Week 2**: Optimize response messages based on performance
3. **Week 3**: Analyze scheduling efficiency and technician utilization
4. **Week 4**: Review customer satisfaction and feedback
5. **Month 2**: Plan feature enhancements and integrations

## Support

For implementation support:
- Email: implementation@yourcompany.com
- Phone: 1-800-XXX-XXXX
- Slack: #implementation-support
- Documentation: https://docs.yourcompany.com
