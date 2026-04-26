# Roofing & HVAC AI Agent - API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Lead Management API

### Create New Lead
**POST** `/leads`

Instantly captures a new lead and triggers automated response.

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+1-555-0123",
  "email": "john@example.com",
  "service": "roofing",
  "message": "My roof has a leak after the storm",
  "source": "web"
}
```

**Response:**
```json
{
  "success": true,
  "lead": {
    "id": "lead_1714089600000",
    "name": "John Smith",
    "phone": "+1-555-0123",
    "email": "john@example.com",
    "service": "roofing",
    "status": "contacted",
    "score": 85,
    "responseTime": 2.5,
    "assignedTo": "tech_001",
    "createdAt": "2026-04-25T14:40:00Z"
  }
}
```

**Key Features:**
- Instant lead capture (< 1 second)
- Automatic AI scoring based on urgency
- Immediate response sent to customer
- Auto-assignment to available technician

---

### Get All Leads
**GET** `/leads?status=new&service=roofing&sort=score`

Retrieve leads with optional filtering and sorting.

**Query Parameters:**
- `status` (optional): 'new', 'contacted', 'qualified', 'converted', 'lost'
- `service` (optional): 'roofing' or 'hvac'
- `sort` (optional): 'score' or 'recent'

**Response:**
```json
[
  {
    "id": "lead_1714089600000",
    "name": "John Smith",
    "phone": "+1-555-0123",
    "email": "john@example.com",
    "service": "roofing",
    "status": "contacted",
    "score": 85,
    "responseTime": 2.5,
    "createdAt": "2026-04-25T14:40:00Z"
  }
]
```

---

### Get Single Lead
**GET** `/leads/:id`

Retrieve detailed information about a specific lead.

**Response:**
```json
{
  "id": "lead_1714089600000",
  "name": "John Smith",
  "phone": "+1-555-0123",
  "email": "john@example.com",
  "service": "roofing",
  "message": "My roof has a leak after the storm",
  "status": "contacted",
  "score": 85,
  "responseTime": 2.5,
  "assignedTo": "tech_001",
  "notes": "Customer prefers afternoon appointments",
  "createdAt": "2026-04-25T14:40:00Z"
}
```

---

### Update Lead Status
**PUT** `/leads/:id`

Update lead status and add notes.

**Request Body:**
```json
{
  "status": "qualified",
  "notes": "Customer approved quote, ready to schedule"
}
```

**Response:**
```json
{
  "id": "lead_1714089600000",
  "status": "qualified",
  "notes": "Customer approved quote, ready to schedule"
}
```

---

## Scheduling & Dispatch API

### Create Job/Appointment
**POST** `/jobs`

Schedule a new job or appointment.

**Request Body:**
```json
{
  "customerId": "cust_001",
  "leadId": "lead_1714089600000",
  "serviceType": "roof_inspection",
  "scheduledDate": "2026-04-26T10:00:00Z",
  "duration": 60,
  "notes": "Customer requested morning appointment"
}
```

**Response:**
```json
{
  "success": true,
  "job": {
    "id": "job_1714089600000",
    "customerId": "cust_001",
    "leadId": "lead_1714089600000",
    "serviceType": "roof_inspection",
    "scheduledDate": "2026-04-26T10:00:00Z",
    "duration": 60,
    "status": "scheduled",
    "assignedTo": null,
    "createdAt": "2026-04-25T14:40:00Z"
  }
}
```

---

### Get Jobs
**GET** `/jobs?status=scheduled&date=2026-04-26&technician=tech_001`

Retrieve jobs with optional filtering.

**Query Parameters:**
- `status` (optional): 'scheduled', 'assigned', 'in_progress', 'completed'
- `date` (optional): Filter by specific date (YYYY-MM-DD)
- `technician` (optional): Filter by assigned technician ID

**Response:**
```json
[
  {
    "id": "job_1714089600000",
    "customerId": "cust_001",
    "serviceType": "roof_inspection",
    "scheduledDate": "2026-04-26T10:00:00Z",
    "duration": 60,
    "status": "scheduled",
    "assignedTo": null
  }
]
```

---

### Dispatch Job to Technician
**POST** `/jobs/:id/dispatch`

Assign a job to a specific technician.

**Request Body:**
```json
{
  "technicianId": "tech_001"
}
```

**Response:**
```json
{
  "id": "job_1714089600000",
  "status": "assigned",
  "assignedTo": "tech_001"
}
```

**Triggers:**
- SMS/Push notification sent to technician
- Customer receives appointment confirmation
- Job appears on technician's mobile app

---

## Customer Communication API

### Send Message
**POST** `/messages`

Send SMS or email to customer.

**Request Body:**
```json
{
  "to": "+1-555-0123",
  "channel": "sms",
  "message": "Your appointment is confirmed for tomorrow at 10:00 AM. Reply CONFIRM to confirm.",
  "type": "confirmation"
}
```

**Response:**
```json
{
  "success": true,
  "communication": {
    "id": "msg_1714089600000",
    "to": "+1-555-0123",
    "channel": "sms",
    "type": "confirmation",
    "sentAt": "2026-04-25T14:40:00Z",
    "status": "sent"
  }
}
```

**Message Types:**
- `confirmation` - Appointment confirmation
- `reminder` - Pre-appointment reminder (24 hours before)
- `followup` - Post-service follow-up
- `review_request` - Request for customer review
- `promotion` - Seasonal offers or promotions

---

### Get Communication History
**GET** `/messages?customerId=cust_001&channel=sms`

Retrieve message history for a customer.

**Query Parameters:**
- `customerId` (optional): Filter by customer ID
- `channel` (optional): 'sms' or 'email'

**Response:**
```json
[
  {
    "id": "msg_1714089600000",
    "to": "+1-555-0123",
    "channel": "sms",
    "message": "Your appointment is confirmed...",
    "type": "confirmation",
    "sentAt": "2026-04-25T14:40:00Z",
    "status": "sent"
  }
]
```

---

## Analytics API

### Lead Analytics
**GET** `/analytics/leads`

Get lead performance metrics.

**Response:**
```json
{
  "totalLeads": 156,
  "convertedLeads": 42,
  "conversionRate": "26.92%",
  "averageResponseTime": "45s",
  "leadsByStatus": {
    "new": 12,
    "contacted": 28,
    "qualified": 34,
    "converted": 42,
    "lost": 40
  }
}
```

---

### Revenue Analytics
**GET** `/analytics/revenue`

Get revenue and job metrics.

**Response:**
```json
{
  "totalRevenue": 125000,
  "jobsCompleted": 48,
  "averageJobValue": 2604.17,
  "activeJobs": 12
}
```

---

### Scheduling Efficiency
**GET** `/analytics/scheduling`

Get scheduling and dispatch metrics.

**Response:**
```json
{
  "totalJobs": 60,
  "completedJobs": 48,
  "onTimePercentage": "91.67%",
  "averageJobDuration": "125"
}
```

---

## Error Handling

All errors return a standard error response:

```json
{
  "error": "Lead not found",
  "code": "LEAD_NOT_FOUND",
  "statusCode": 404
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

---

## Rate Limiting

API requests are rate-limited to prevent abuse:
- **Standard**: 1000 requests per hour
- **Premium**: 10,000 requests per hour

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1714089600
```

---

## Webhooks

Subscribe to real-time events:

**Lead Events:**
- `lead.created` - New lead captured
- `lead.converted` - Lead converted to customer
- `lead.lost` - Lead marked as lost

**Job Events:**
- `job.created` - New job scheduled
- `job.assigned` - Job assigned to technician
- `job.completed` - Job marked complete

**Communication Events:**
- `message.sent` - Message delivered
- `message.failed` - Message delivery failed
- `message.replied` - Customer replied to message

---

## Example Integration

### JavaScript/Node.js
```javascript
const axios = require('axios');

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Authorization': `Bearer ${process.env.JWT_TOKEN}`
  }
});

// Create lead
async function createLead(leadData) {
  const response = await apiClient.post('/leads', leadData);
  return response.data;
}

// Get analytics
async function getLeadAnalytics() {
  const response = await apiClient.get('/analytics/leads');
  return response.data;
}
```

### Python
```python
import requests

API_BASE = 'http://localhost:3001/api'
headers = {'Authorization': f'Bearer {JWT_TOKEN}'}

# Create lead
lead_data = {
    'name': 'John Smith',
    'phone': '+1-555-0123',
    'email': 'john@example.com',
    'service': 'roofing',
    'message': 'My roof has a leak'
}
response = requests.post(f'{API_BASE}/leads', json=lead_data, headers=headers)
lead = response.json()
```

---

## Support

For API support or questions:
- Email: api-support@yourcompany.com
- Documentation: https://docs.yourcompany.com
- Status Page: https://status.yourcompany.com
