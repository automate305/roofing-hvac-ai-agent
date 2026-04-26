# Roofing & HVAC AI Agent - Project Architecture

## Project Overview
A comprehensive AI automation system designed specifically for roofing and HVAC contractors to address their top 5 pain points: speed-to-lead response, lead management, scheduling, customer communication, and business intelligence.

## Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **UI Library**: shadcn/ui + Tailwind CSS 4
- **State Management**: React Context + Hooks
- **Charts/Visualization**: Recharts
- **Routing**: Wouter
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL (for production)
- **ORM**: Prisma
- **Authentication**: JWT + OAuth
- **AI Integration**: OpenAI API (for intelligent responses)
- **Task Scheduling**: Bull (Redis-based job queue)
- **Real-time**: Socket.io (for live updates)

### External Integrations
- **SMS**: Twilio
- **Email**: SendGrid or Mailgun
- **Calendar**: Google Calendar API
- **Scheduling**: Calendly API
- **Payment**: Stripe
- **CRM**: Salesforce or custom integration

## Core Features

### 1. Lead Management System
- **Instant Lead Capture**: Web form, SMS, email, phone integration
- **Lead Scoring**: AI-powered scoring based on urgency, budget, timeline
- **Lead Routing**: Automatic assignment to available technicians
- **Lead Status Tracking**: Pipeline view with conversion metrics

### 2. AI Response Agent
- **Instant Response**: Automated SMS/email response within 60 seconds
- **Intelligent Replies**: Context-aware responses based on lead type
- **Follow-up Sequences**: Automated multi-touch nurturing campaigns
- **Escalation Logic**: Route to human when needed

### 3. Scheduling & Dispatch
- **Smart Scheduling**: AI-optimized appointment booking
- **Route Optimization**: Minimize travel time between jobs
- **Technician Assignment**: Match jobs to available technicians
- **Real-time Updates**: Mobile app for technicians with live dispatch

### 4. Customer Communication
- **Appointment Confirmations**: Automated SMS/email confirmations
- **Maintenance Reminders**: Seasonal reminders for HVAC maintenance
- **Pre-visit Notifications**: Technician ETA and arrival alerts
- **Post-service Follow-up**: Review requests and satisfaction surveys
- **Proactive Outreach**: Birthday/anniversary offers and seasonal promotions

### 5. Business Dashboard
- **Lead Analytics**: Conversion rates, response times, source performance
- **Revenue Metrics**: Job value, average ticket size, customer lifetime value
- **Technician Performance**: Productivity, customer satisfaction, revenue per tech
- **Scheduling Efficiency**: Utilization rates, travel time, job completion rates
- **Marketing ROI**: Cost per lead, cost per acquisition, payback period

## Database Schema

### Core Tables
```
- users (contractors, technicians, admins)
- companies (business profiles)
- leads (lead information and status)
- customers (customer profiles and history)
- jobs (service appointments and work orders)
- technicians (technician profiles and availability)
- communications (SMS, email, call logs)
- analytics (metrics and KPIs)
- integrations (connected services and API keys)
```

## API Endpoints

### Lead Management
- `POST /api/leads` - Create new lead
- `GET /api/leads` - List leads with filters
- `GET /api/leads/:id` - Get lead details
- `PUT /api/leads/:id` - Update lead status
- `POST /api/leads/:id/assign` - Assign lead to technician

### Scheduling
- `POST /api/jobs` - Create job/appointment
- `GET /api/jobs` - List jobs with filters
- `PUT /api/jobs/:id` - Update job details
- `POST /api/jobs/:id/dispatch` - Dispatch to technician
- `GET /api/availability` - Get technician availability

### Communications
- `POST /api/messages/sms` - Send SMS
- `POST /api/messages/email` - Send email
- `GET /api/messages` - Get message history
- `POST /api/messages/template` - Create message template

### Analytics
- `GET /api/analytics/leads` - Lead metrics
- `GET /api/analytics/revenue` - Revenue metrics
- `GET /api/analytics/technicians` - Technician performance
- `GET /api/analytics/scheduling` - Scheduling efficiency

## User Roles

1. **Admin**: Full system access, user management, settings
2. **Owner/Manager**: Business management, team oversight, analytics
3. **Technician**: Job assignments, customer communication, time tracking
4. **Customer**: Self-service portal for scheduling, payment, support

## Deployment Strategy

### Phase 1: MVP (Weeks 1-4)
- Lead capture and instant response
- Basic scheduling system
- Customer communication templates
- Simple dashboard with core metrics

### Phase 2: Enhancement (Weeks 5-8)
- AI-powered lead scoring and routing
- Route optimization
- Advanced analytics
- Mobile app for technicians

### Phase 3: Integration (Weeks 9-12)
- Third-party integrations (Google Calendar, Calendly, Twilio)
- Payment processing
- Advanced reporting
- Customer self-service portal

## Success Metrics

1. **Lead Response Time**: <60 seconds average
2. **Lead Conversion Rate**: +25-40% improvement
3. **Scheduling Efficiency**: +30-50% technician utilization
4. **Customer Satisfaction**: +20-30% improvement
5. **Revenue Impact**: +15-25% revenue increase per contractor
