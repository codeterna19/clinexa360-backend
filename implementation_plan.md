# Clinexa360 – Multi-Tenant Clinic Management SaaS Platform Implementation Plan

This document outlines the architectural approach, database schema, source code structure, and phased execution plan for building Clinexa360, a comprehensive Multi-Tenant Clinic Management SaaS Platform.

> [!CAUTION]
> Building a production-ready multi-tenant SaaS is a significant undertaking. We will proceed iteratively, focusing first on the MVP (Phase 1) after this plan is approved.

## User Review Required

> [!IMPORTANT]
> Please review the following design decisions before we begin implementation:
> 1. **Repository Structure**: The plan assumes a monorepo approach (e.g., using `npm` workspaces or just separate folders in this directory) containing both the backend and frontend for ease of development. Is this acceptable, or do you prefer strictly separated repositories?
> 2. **Database ODM**: We will use Mongoose for MongoDB. Is this acceptable?
> 3. **Authentication**: The requirements mention both JWT and Firebase Authentication. We will use Firebase Auth for managing user identities/OTPs and our backend will issue a custom JWT for our internal RBAC and tenant resolution. Does this align with your expectations?
> 4. **Mobile App**: The mobile app (Flutter) is slated for Phase 2. We will set up the foundational APIs in Phase 1 to support it later.

## Architecture Overview

### Multi-Tenant Infrastructure
We will use **Logical Separation (Row-level multi-tenancy)**.
- Every tenant-specific collection will include a `clinic_id`.
- The backend will use a multi-tenant middleware that extracts the user's `clinic_id` from their JWT token and automatically scopes all database queries to that specific clinic to prevent data leakage.
- Global collections (e.g., `Clinics`, `Subscriptions`, `SuperAdmins`) will not have a `clinic_id`.

### Deployment Architecture
- **Frontend**: AWS S3 + CloudFront (or Vercel/Netlify for easier CI/CD).
- **Backend**: AWS EC2 or ECS (Dockerized Node.js applications) behind an Application Load Balancer.
- **Database**: MongoDB Atlas (managed service).
- **Storage**: AWS S3 for prescriptions, reports, and profile pictures.

## Proposed Source Code Structure

We will structure the project into three main directories within `f:\clinic_application`:

```text
/clinic_application
├── /backend                 # Node.js + Express backend
│   ├── /src
│   │   ├── /config          # DB, Firebase, AWS configs
│   │   ├── /controllers     # Route handlers
│   │   ├── /middlewares     # Auth, RBAC, Multi-tenant scoped queries
│   │   ├── /models          # Mongoose schemas
│   │   ├── /routes          # API endpoints
│   │   ├── /services        # Business logic
│   │   └── /utils           # Helpers
│   └── package.json
├── /frontend                # React.js + Tailwind + Vite
│   ├── /src
│   │   ├── /components      # Reusable UI components
│   │   ├── /contexts        # Global state (Auth, Tenant)
│   │   ├── /hooks           # Custom React hooks
│   │   ├── /pages           # Page layouts by role (SuperAdmin, ClinicAdmin, Doctor, etc.)
│   │   ├── /services        # API client calls
│   │   └── /utils           # Helpers
│   └── package.json
└── /mobile                  # Flutter App (Phase 2)
```

## Database Schema (MongoDB Collections)

Here are the primary collections required for the system:

1. **Clinics** (Global)
   - `_id`, `name`, `email`, `phone`, `address`, `status` (Active, Suspended, Expired), `subscription_plan_id`, `createdAt`, `updatedAt`

2. **Branches** (Tenant-scoped)
   - `_id`, `clinic_id`, `name`, `address`, `timings`

3. **Users** (Global + Tenant-scoped)
   - `_id`, `clinic_id` (null for SuperAdmin), `branch_id`, `firebase_uid`, `name`, `email`, `phone`, `role` (SuperAdmin, ClinicAdmin, Doctor, Receptionist, Patient, etc.), `status`

4. **Roles & Permissions** (Tenant-scoped / Global default)
   - `_id`, `clinic_id`, `role_name`, `permissions` (Array of actions like `view_patients`, `add_appointments`)

5. **Doctors** (Tenant-scoped extensions of User)
   - `_id` (refs User._id), `clinic_id`, `branch_id`, `qualification`, `specialization`, `registration_number`, `consultation_fee`, `available_timings`

6. **Patients** (Tenant-scoped extensions of User)
   - `_id` (refs User._id), `clinic_id`, `gender`, `dob`, `blood_group`, `emergency_contact`, `allergies`, `medical_history`

7. **Appointments** (Tenant-scoped)
   - `_id`, `clinic_id`, `branch_id`, `patient_id`, `doctor_id`, `date`, `time`, `type` (Consultation, Follow-up, Telemedicine), `status` (Pending, Confirmed, Completed, Cancelled, No Show)

8. **Subscriptions** (Global)
   - `_id`, `clinic_id`, `plan_name`, `start_date`, `end_date`, `status`, `features_enabled`

9. **Bills & Payments** (Tenant-scoped)
   - `_id`, `clinic_id`, `patient_id`, `appointment_id`, `amount`, `payment_mode`, `status` (Paid, Pending)

## API Documentation (Core Endpoints)

**Auth**
- `POST /api/auth/login` - Authenticate via Firebase OTP/Email and receive standard JWT
- `POST /api/auth/register` - Create new Super Admin or Tenant Admin

**Super Admin**
- `GET /api/super-admin/clinics` - List all clinics
- `POST /api/super-admin/clinics` - Onboard a new clinic
- `PUT /api/super-admin/clinics/:id/status` - Suspend/Activate

**Clinic Admin**
- `GET /api/clinic/doctors` - Get clinic's doctors
- `POST /api/clinic/doctors` - Add doctor to clinic
- `GET /api/clinic/dashboard` - Dashboard stats

**Appointments**
- `POST /api/appointments` - Book appointment
- `GET /api/appointments` - List appointments (filtered by doctor/patient)
- `PUT /api/appointments/:id/status` - Update status

## Phased Execution Plan

### Phase 1: MVP (Minimum Viable Product)
1. **Project Initialization**
   - Setup Node.js backend with Express and connect to MongoDB.
   - Setup React frontend with Vite and Tailwind CSS.
2. **Core Backend Foundation**
   - Implement Firebase Auth and custom JWT generation.
   - Implement Multi-Tenant Middleware (enforcing `clinic_id`).
   - Implement RBAC (Role-Based Access Control) middleware.
3. **Database Models Setup**
   - Define Mongoose schemas for Clinics, Users, Roles, Doctors, Patients, Appointments, and Bills.
4. **Super Admin Module (Backend & Frontend)**
   - Dashboard with basic stats.
   - API & UI for onboarding, editing, suspending, and managing clinics.
   - Subscription management base structure.
5. **Clinic Admin Module (Backend & Frontend)**
   - Dashboard with clinic stats.
   - API & UI for managing doctors, staff, and single branch settings.
6. **Appointment & Patient Management**
   - API & UI for Receptionist and Doctor to manage patient profiles and medical history.
   - Calendar views, appointment booking, and status tracking.
7. **Billing Module**
   - Basic invoice generation and payment tracking (cash/card/UPI statuses).

### Phase 2: Engagement & Reporting
1. **Mobile App (Flutter)**
   - Initialize Flutter application.
   - Implement Patient authentication (OTP/Email).
   - Features: Search clinics/doctors, book appointments, view prescriptions, digital health wallet.
2. **WhatsApp Integration**
   - Integrate WhatsApp Business API.
   - Set up webhook listeners for incoming messages ("Hi").
   - Automated booking flow via WhatsApp menu (Book, Reschedule, Cancel).
   - Automated notifications (Reminders, Payment Confirmations).
3. **Reports & Analytics**
   - Implement clinic, doctor, and revenue reports.
   - Export functionality (PDF, Excel, CSV).

### Phase 3: Advanced Clinical Features
1. **Telemedicine Module**
   - Integrate WebRTC or third-party SDK (like Agora/Twilio) for video consultations.
   - Implement appointment links, chat support, and prescription sharing during calls.
2. **Inventory Management**
   - Medicine and consumables inventory schemas.
   - Low stock alerts and purchase/supplier management UI.
3. **Lab Management Module**
   - Lab test order creation and tracking.
   - PDF result upload and patient portal access.

### Phase 4: AI & Scale
1. **AI Features**
   - Integrate LLM (e.g., OpenAI or Gemini) for AI chatbot support.
   - Implement AI Appointment Prediction & No-Show Prediction models.
   - AI Prescription Suggestions based on diagnosis history.
2. **Multi-Branch Analytics**
   - Enhance the dashboard to support multi-branch aggregation.
   - Cross-branch reporting and resource allocation insights.

## Next Steps

If this complete phased plan and the architectural decisions outlined above look good, please answer the questions in the **User Review Required** section, and we will begin building **Phase 1: Project Initialization**.
