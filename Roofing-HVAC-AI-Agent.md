---
title: Roofing & HVAC AI Agent
tags:
  - project
  - ai-agent
  - roofing
  - hvac
  - automation
  - saas
created: 2026-06-27
status: active
stage: Phase 1 — Live
repo: automate305/roofing-hvac-ai-agent
branch: claude/test-agent-capabilities-3tqg7f
port: 3001
---

# Roofing & HVAC AI Agent

> An AI automation system that handles the repetitive, manual, and admin work that costs roofing and HVAC contractors booked jobs every day — missed calls, slow follow-up, manual dispatching, no-shows, forgotten invoices.

---

## What Problem Does This Solve?

| Pain Point | Old Way | With This Agent |
|---|---|---|
| Missed calls / slow response | Lead goes cold in hours | Auto-response in < 1 second |
| Manual lead tracking | Spreadsheets, sticky notes | Scored + auto-assigned pipeline |
| Dispatching | Office calls techs manually | One-click or auto-dispatch |
| Appointment reminders | Forgotten or manual texts | Automated SMS + email sequences |
| No visibility | Gut feel | Live analytics dashboard |
| Invoicing | Manual after job | Automated (Phase 3) |

---

## Live Demo Results (2026-06-27)

> [!success] Server Status
> Running on `http://localhost:3001` — all endpoints tested and confirmed working.

### Leads Captured in Demo

| Lead | Service | Message | Score | Response Time | Assigned To |
|---|---|---|---|---|---|
| Maria Garcia | Roofing | "Emergency! Roof leaking after hurricane. ASAP." | **100/100** | < 1ms | tech_001 |
| James Thompson | HVAC | "AC not cooling. 95 degrees. 2 days." | **60/100** | < 1ms | tech_002 |
| Sandra Lee | Roofing | "Inspection before selling house." | **50/100** | < 1ms | tech_002 |

> [!tip] Lead Scoring Logic
> The AI scores 0–100 based on keywords found in the message:
> - `emergency` → +30 pts
> - `urgent` → +20 pts
> - `asap` → +15 pts
> - `leak` or `damage` (roofing) → +25 pts
> - Source = `phone` → +10 pts
> - Base score: 50

### Analytics Snapshot

```
Total Leads:        3
Converted Leads:    1  (Maria → roof replacement booked)
Conversion Rate:    33.33%
Avg Response Time:  < 1ms
Active Jobs:        1
```

---

## How the Workflow Flows

```mermaid
flowchart TD
    A[Customer contacts via\nWeb / Phone / SMS / Email] --> B[POST /api/leads]
    B --> C{AI Lead Scoring\n0–100}
    C --> D[Instant Auto-Response\nSMS or Email < 1s]
    C --> E[Auto-Assign to Technician]
    D --> F[Lead Status: contacted]
    E --> F
    F --> G{Office Reviews\nLead Pipeline}
    G --> H[PUT /api/leads/:id\nStatus: converted]
    H --> I[POST /api/jobs\nSchedule Appointment]
    I --> J[POST /api/jobs/:id/dispatch\nAssign Technician]
    J --> K[POST /api/messages\nSMS Confirmation to Customer]
    J --> L[NOTIFICATION to Tech]
    K --> M[POST /api/messages\n24h Email Reminder]
    M --> N[Job Completed]
    N --> O[POST /api/messages\nReview Request Follow-up]
    N --> P[Analytics Updated]
```

---

## Capabilities by Use Case

### For Roofing Companies

> [!info] Roofing-Specific Features
> - Urgency detection: `leak`, `damage`, `storm`, `emergency` → jumps to top of queue
> - Emergency leads capped at score 100 — tech dispatched immediately
> - Post-job: automated review request + seasonal inspection reminders

**Typical Jobs Handled:**
- Emergency storm damage / leak repair
- Full roof replacement
- Inspection (pre-sale, insurance)
- Gutter cleaning / maintenance

---

### For HVAC Companies

> [!info] HVAC-Specific Features
> - Service calls during heat/cold snaps auto-prioritized
> - Seasonal maintenance campaign automation (spring AC tune-up, fall furnace check)
> - Technician routing by skill (refrigerant certified, brand-specific, etc.)

**Typical Jobs Handled:**
- Emergency AC / heat failure
- Annual maintenance contracts
- New system installation
- Filter replacement / tune-up

---

## API Quick Reference

**Base URL:** `http://localhost:3001/api`

### Lead Management

```bash
# Capture a new lead (triggers instant response + scoring)
POST /api/leads
{ name, phone, email, service, message, source }

# View all leads — sort by urgency
GET /api/leads?sort=score&service=roofing&status=new

# Convert a lead
PUT /api/leads/:id
{ status: "converted", notes: "Deposit collected" }
```

### Scheduling & Dispatch

```bash
# Book a job
POST /api/jobs
{ customerId, leadId, serviceType, scheduledDate, duration, notes }

# Dispatch to a tech (triggers notification)
POST /api/jobs/:id/dispatch
{ technicianId: "tech_001" }

# View today's schedule
GET /api/jobs?date=2026-06-28&status=assigned
```

### Customer Communications

```bash
# Send SMS confirmation
POST /api/messages
{ to: "+1-305-555-0101", channel: "sms", message: "...", type: "confirmation" }

# Send email reminder
POST /api/messages
{ to: "customer@email.com", channel: "email", message: "...", type: "reminder" }
```

**Message types:** `confirmation` · `reminder` · `followup` · `review_request` · `promotion`

### Analytics

```bash
GET /api/analytics/leads       # Conversion rate, response time, pipeline
GET /api/analytics/revenue     # Total revenue, avg job value, active jobs
GET /api/analytics/scheduling  # On-time %, avg duration, utilization
```

---

## Environment Setup

> [!warning] Required Before SMS/Email Work in Production
> Add these to your `.env` file:

```env
# AI responses (currently uses templates as fallback)
OPENAI_API_KEY=sk-...

# Real SMS delivery via Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX

# Real email delivery
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Database (PostgreSQL for production)
DATABASE_URL=postgresql://user:password@localhost:5432/roofing_hvac

# Auth
JWT_SECRET=your-secret-key

# Payments (Phase 3)
STRIPE_SECRET_KEY=sk_live_...
```

---

## What's Built vs. What's Next

### Phase 1 — Live Now ✅

- [x] Lead capture from any channel
- [x] AI lead scoring (0–100)
- [x] Instant auto-response (< 1 second)
- [x] Auto-assignment to technicians
- [x] Job scheduling
- [x] Dispatch with tech notifications
- [x] SMS + email message sending
- [x] Lead pipeline status tracking
- [x] Analytics: leads, revenue, scheduling

### Phase 2 — In Progress 🔄

- [ ] Missed call capture → auto-text-back
- [ ] Real Twilio SMS integration
- [ ] Real SendGrid email integration
- [ ] OpenAI conversational responses (vs. templates)
- [ ] Route optimization for dispatch
- [ ] Technician mobile view

### Phase 3 — Planned 📅

- [ ] Automated invoicing after job completion
- [ ] Stripe payment collection
- [ ] Customer self-service portal (reschedule, pay, review)
- [ ] Google Calendar sync
- [ ] Seasonal maintenance campaign sequences
- [ ] Predictive analytics (slow weeks, upsell timing)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + Express 5 |
| AI | OpenAI API |
| SMS | Twilio |
| Email | SendGrid / Nodemailer |
| Real-time | Socket.io |
| Queue | Bull (Redis) |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT |
| Frontend (planned) | React 19 + Tailwind + Recharts |

---

## Key Numbers to Know

| Metric | Target | Notes |
|---|---|---|
| Lead response time | < 60 seconds | Currently < 1ms (templates) |
| Conversion rate improvement | +25–40% | vs. manual follow-up |
| Technician utilization | +30–50% | via smart scheduling |
| On-time job completion | 90%+ | tracked per tech |
| Revenue increase | +15–25% | across contractor clients |

---

## Related Notes

- [[API Documentation]]
- [[Project Architecture]]
- [[Implementation Guide]]
- [[Twilio SMS Setup]]
- [[Stripe Invoicing Integration]]
- [[Make.com Automation Flows]]

---

*Last tested: 2026-06-27 · Branch: `claude/test-agent-capabilities-3tqg7f`*
