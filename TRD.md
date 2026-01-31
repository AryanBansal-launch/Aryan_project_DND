# Technical Requirements Document (TRD)
# JobDekho - AI-Powered Job Discovery Platform

**Version:** 2.0  
**Last Updated:** January 2026  
**Author:** Aryan Bansal  
**Status:** Production Ready

---

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Database Schema](#database-schema)
4. [API Specifications](#api-specifications)
5. [Contentstack Integration](#contentstack-integration)
6. [Third-Party Integrations](#third-party-integrations)
7. [Security Requirements](#security-requirements)
8. [Performance Requirements](#performance-requirements)
9. [Deployment Architecture](#deployment-architecture)
10. [Development Guidelines](#development-guidelines)

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Browser)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Next.js    │  │   React 19   │  │  Tailwind    │         │
│  │  App Router  │  │  Components  │  │     CSS 4    │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                 │                   │
└─────────┼─────────────────┼─────────────────┼──────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EDGE LAYER (Launch)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Middleware │  │ Edge Functions│  │ Geolocation  │         │
│  │  (Auth)      │  │  ([proxy])   │  │   Headers    │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                 │                   │
└─────────┼─────────────────┼─────────────────┼──────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER (Next.js)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  API Routes  │  │ Server       │  │ Client       │         │
│  │  (App Router)│  │ Components   │  │ Components   │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                 │                   │
└─────────┼─────────────────┼─────────────────┼──────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Contentstack │  │   Algolia    │  │   NeonDB     │         │
│  │     CMS      │  │    Search    │  │  PostgreSQL  │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                 │                   │
└─────────┼─────────────────┼─────────────────┼──────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Lytics     │  │  Personalize │  │   Automate    │         │
│  │  Analytics   │  │  Edge API    │  │   Workflows   │         │
│  └──────────────┘  └──────────────┘  └───────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Component Architecture

```
/app
├── page.tsx                    # Homepage (Server Component)
├── HomeClient.tsx               # Homepage interactivity (Client)
├── layout.tsx                   # Root layout with navigation
├── globals.css                  # Global styles
│
├── jobs/
│   ├── page.tsx                 # Job listings (Server)
│   ├── JobsClient.tsx           # Job search & filters (Client)
│   └── [id]/
│       ├── page.tsx             # Job detail (Server)
│       └── JobDetailClient.tsx  # Application form (Client)
│
├── companies/
│   ├── page.tsx                 # Company listings (Server)
│   └── CompaniesClient.tsx      # Company search (Client)
│
├── profile/
│   ├── page.tsx                 # Profile page (Server)
│   └── ProfileClient.tsx        # Skill management (Client)
│
├── learnings/
│   ├── page.tsx                 # Learning Hub (Server)
│   ├── LearningsClient.tsx     # Learning filters (Client)
│   └── [slug]/
│       ├── page.tsx             # Learning detail (Server)
│       └── LearningDetailClient.tsx # Video player (Client)
│
├── applications/
│   └── page.tsx                 # Application tracking (Server)
│
├── admin/
│   └── page.tsx                 # Admin dashboard (Protected)
│
└── api/                         # API Routes
    ├── auth/[...nextauth]/route.ts
    ├── user/skills/route.ts
    ├── user/profile/route.ts
    ├── jobs/recommendations/route.ts
    ├── jobs/sync-algolia/route.ts
    ├── skill-gap/route.ts
    ├── applications/submit/route.ts
    ├── applications/route.ts
    ├── notifications/route.ts
    └── webhooks/new-job/route.ts

/components
├── Navigation.tsx               # Site navigation
├── BehaviorTracker.tsx          # Lytics + Personalize init
├── PersonalizedBanner.tsx      # Behavior-based banners
├── RecommendedForYou.tsx       # Personalized recommendations
├── SkillGapBanner.tsx          # Skill gap awareness banner
├── SkillGapRecommendations.tsx # Profile skill gap analysis
├── NotificationDropdown.tsx    # In-app notifications
├── LanguageSwitcher.tsx        # Locale switcher
└── WelcomePopup.tsx            # First-time user popup

/lib
├── contentstack.ts             # CMS integration
├── algolia.ts                  # Search integration
├── auth.ts                     # NextAuth configuration
├── users.ts                    # Database operations
├── behavior-tracking.ts        # User behavior utilities
├── skill-gap-analyzer.ts       # Skill gap analysis engine
├── contentstack-personalize.ts # Personalize integration
├── contentstack-notifications.ts # Notification management
├── ga-client.ts                # Google Analytics client
├── ga-top-paths.ts             # Top paths analytics
└── utils.ts                    # Utility functions
```

---

## 2. Technology Stack

### 2.1 Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.4 | React framework with App Router |
| **React** | 19.1.1 | UI library |
| **TypeScript** | 5.x | Type-safe development |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **Lucide React** | 0.460.0 | Icon library |
| **date-fns** | 2.30.0 | Date formatting |
| **clsx** | 2.0.0 | Conditional class names |
| **DOMPurify** | 3.2.7 | HTML sanitization |

### 2.2 Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js API Routes** | 15.5.4 | Server-side API endpoints |
| **NextAuth.js** | 4.24.5 | Authentication |
| **bcryptjs** | 3.0.3 | Password hashing |
| **@neondatabase/serverless** | 1.0.2 | PostgreSQL client |

### 2.3 Data & Services

| Service | Purpose | Integration |
|---------|---------|-------------|
| **Contentstack CMS** | Content management | Delivery SDK, Management API |
| **Algolia** | Search engine | algoliasearch client |
| **NeonDB** | PostgreSQL database | Serverless driver |
| **Lytics** | Analytics | jstag tracking |
| **Contentstack Personalize** | Personalization | Edge SDK |
| **Contentstack Automate** | Workflow automation | HTTP webhooks |
| **Contentstack Launch** | Hosting | Edge deployment |

### 2.4 Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting |
| **TypeScript** | Type checking |
| **Playwright** | E2E testing |
| **Husky** | Git hooks |
| **Docker** | Containerization |

---

## 3. Database Schema

### 3.1 NeonDB PostgreSQL Schema

```sql
-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  auth_provider VARCHAR(50) DEFAULT 'email',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- User Skills Table
CREATE TABLE IF NOT EXISTS user_skills (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  skill VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(email, skill)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_skills_email ON user_skills(email);

-- Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  application_id VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  job_id VARCHAR(255) NOT NULL,
  job_title VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'submitted',
  cover_letter TEXT,
  portfolio VARCHAR(500),
  expected_salary VARCHAR(100),
  availability VARCHAR(255),
  additional_info TEXT,
  resume_file_name VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
```

### 3.2 Contentstack Content Types

#### Job Content Type
```json
{
  "uid": "job",
  "title": "Job",
  "schema": [
    { "uid": "title", "data_type": "text", "mandatory": true },
    { "uid": "description", "data_type": "richtext", "mandatory": true },
    { "uid": "requirements", "data_type": "richtext" },
    { "uid": "responsibilities", "data_type": "richtext" },
    { "uid": "company", "data_type": "reference", "reference_to": ["company"] },
    { "uid": "location", "data_type": "text", "mandatory": true },
    { "uid": "type", "data_type": "text", "enum": ["Full-time", "Part-time", "Contract", "Freelance"] },
    { "uid": "experience", "data_type": "text", "enum": ["Entry", "Mid", "Senior", "Lead"] },
    { "uid": "salary", "data_type": "group" },
    { "uid": "skills", "data_type": "group", "multiple": true },
    { "uid": "category", "data_type": "text" },
    { "uid": "status", "data_type": "text", "enum": ["draft", "active", "closed"] },
    { "uid": "posted_at", "data_type": "isodate" }
  ]
}
```

#### Company Content Type
```json
{
  "uid": "company",
  "title": "Company",
  "schema": [
    { "uid": "title", "data_type": "text", "mandatory": true },
    { "uid": "description", "data_type": "richtext" },
    { "uid": "location", "data_type": "text" },
    { "uid": "industry", "data_type": "text" },
    { "uid": "size", "data_type": "text" },
    { "uid": "logo", "data_type": "file" },
    { "uid": "benefits", "data_type": "group", "multiple": true }
  ]
}
```

#### Learning Resource Content Type
```json
{
  "uid": "learning_resource",
  "title": "Learning Resource",
  "schema": [
    { "uid": "title", "data_type": "text", "mandatory": true },
    { "uid": "slug", "data_type": "text", "mandatory": true, "unique": true },
    { "uid": "description", "data_type": "richtext" },
    { "uid": "technology", "data_type": "text", "mandatory": true },
    { "uid": "difficulty_level", "data_type": "text", "enum": ["Beginner", "Intermediate", "Advanced"] },
    { "uid": "youtube_url", "data_type": "link", "mandatory": true },
    { "uid": "youtube_video_id", "data_type": "text", "mandatory": true },
    { "uid": "duration", "data_type": "text" },
    { "uid": "thumbnail", "data_type": "file" },
    { "uid": "key_takeaways", "data_type": "group", "multiple": true },
    { "uid": "skills_covered", "data_type": "group", "multiple": true },
    { "uid": "instructor", "data_type": "text" },
    { "uid": "published_date", "data_type": "isodate" },
    { "uid": "featured", "data_type": "boolean" },
    { "uid": "order", "data_type": "number" }
  ]
}
```

---

## 4. API Specifications

### 4.1 Authentication APIs

#### POST /api/auth/register
**Purpose**: Register new user with email/password

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST /api/auth/[...nextauth]
**Purpose**: NextAuth.js authentication handlers
- `/api/auth/signin` - Sign in
- `/api/auth/signout` - Sign out
- `/api/auth/callback/google` - Google OAuth callback
- `/api/auth/session` - Get current session

### 4.2 User APIs

#### GET /api/user/skills
**Purpose**: Get user's skills

**Headers**: 
- `Cookie`: NextAuth session cookie

**Response**:
```json
{
  "skills": ["React", "TypeScript", "Node.js"]
}
```

#### POST /api/user/skills
**Purpose**: Update user's skills

**Request Body**:
```json
{
  "skills": ["React", "TypeScript", "Python"]
}
```

**Response**:
```json
{
  "success": true,
  "skills": ["React", "TypeScript", "Python"]
}
```

#### GET /api/user/profile
**Purpose**: Get user profile

**Response**:
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "skills": ["React", "TypeScript"]
}
```

### 4.3 Job APIs

#### POST /api/jobs/recommendations
**Purpose**: Get job recommendations based on skills and location

**Request Body**:
```json
{
  "skills": ["React", "Node.js"],
  "limit": 10,
  "prioritizeLocal": true
}
```

**Response**:
```json
{
  "success": true,
  "recommendations": [
    {
      "id": "blt123",
      "title": "Frontend Developer",
      "location": "San Francisco, CA",
      "matchScore": 0.85,
      "matchingSkillsCount": 2,
      "locationScore": 0.8,
      "isLocalJob": true
    }
  ],
  "totalFound": 6,
  "searchedSkills": ["React", "Node.js"],
  "geolocation": {
    "detected": true,
    "country": "US",
    "region": "California",
    "city": "San Francisco",
    "localJobsFound": 4
  }
}
```

**Geolocation Headers** (injected by Launch):
- `visitor-ip-country`: ISO 2-letter country code
- `visitor-ip-region`: Region/state name
- `visitor-ip-city`: City name

#### POST /api/jobs/sync-algolia
**Purpose**: Sync jobs from Contentstack to Algolia

**Response**:
```json
{
  "success": true,
  "synced": 150,
  "errors": 0
}
```

### 4.4 Skill Gap API

#### POST /api/skill-gap
**Purpose**: Analyze skill gaps for user

**Request Body**:
```json
{
  "userSkills": ["React", "JavaScript", "CSS"]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "totalJobsAnalyzed": 150,
    "userSkillCount": 3,
    "matchingJobsCount": 45,
    "matchPercentage": 30,
    "topMarketSkills": [
      { "skill": "python", "jobCount": 85, "percentage": 57 },
      { "skill": "typescript", "jobCount": 72, "percentage": 48 }
    ],
    "skillGaps": [
      {
        "skill": "python",
        "jobCount": 85,
        "percentage": 57,
        "priority": "high",
        "learningResources": [...]
      }
    ],
    "recommendations": {
      "message": "You're on the right track!",
      "suggestedNextSkill": "python",
      "potentialJobIncrease": 85
    }
  }
}
```

### 4.5 Application APIs

#### POST /api/applications/submit
**Purpose**: Submit job application

**Request Body**:
```json
{
  "jobId": "blt123",
  "coverLetter": "I am interested...",
  "portfolio": "https://portfolio.com",
  "expectedSalary": "$120,000",
  "availability": "Immediate"
}
```

**Response**:
```json
{
  "success": true,
  "applicationId": "APP-123456",
  "message": "Application submitted successfully"
}
```

#### GET /api/applications
**Purpose**: Get user's applications

**Response**:
```json
{
  "applications": [
    {
      "applicationId": "APP-123456",
      "jobId": "blt123",
      "jobTitle": "Frontend Developer",
      "status": "submitted",
      "createdAt": "2026-01-15T10:00:00Z"
    }
  ]
}
```

#### DELETE /api/applications
**Purpose**: Withdraw application

**Request Body**:
```json
{
  "applicationId": "APP-123456"
}
```

### 4.6 Notification APIs

#### GET /api/notifications
**Purpose**: Get user notifications

**Response**:
```json
{
  "notifications": [
    {
      "uid": "blt123",
      "type": "application_update",
      "title": "Application Status Updated",
      "message": "Your application has been reviewed",
      "read": false,
      "createdAt": "2026-01-15T10:00:00Z"
    }
  ]
}
```

#### PATCH /api/notifications
**Purpose**: Mark notification as read

**Request Body**:
```json
{
  "notificationUid": "blt123"
}
```

### 4.7 Webhook APIs

#### POST /api/webhooks/new-job
**Purpose**: Handle Contentstack webhook for new job

**Headers**:
- `x-webhook-secret`: Webhook secret for verification

**Request Body** (from Contentstack):
```json
{
  "event": "entry.publish",
  "data": {
    "entry": {
      "uid": "blt123",
      "title": "Software Engineer",
      "location": "San Francisco",
      ...
    }
  }
}
```

**Process**:
1. Verify webhook secret
2. Fetch all users from NeonDB
3. Call Contentstack Automate for each user
4. Send email notifications

---

## 5. Contentstack Integration

### 5.1 Delivery SDK Configuration

```typescript
import contentstack from "@contentstack/delivery-sdk";

export const stack = contentstack.stack({
  apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
  deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN,
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
  region: process.env.NEXT_PUBLIC_CONTENTSTACK_REGION,
});
```

### 5.2 Management API Configuration

**Used for**: Creating/updating notifications

```typescript
const headers = {
  'api_key': process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
  'authorization': process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN,
  'Content-Type': 'application/json'
};
```

### 5.3 Personalize Edge SDK

```typescript
import { PersonalizeEdgeSDK } from '@contentstack/personalize-edge-sdk';

const personalize = new PersonalizeEdgeSDK({
  projectUid: process.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID,
  userUid: process.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_USER_UID,
  authToken: process.env.NEXT_PUBLIC_CONTENTSTACK_AUTHTOKEN,
});
```

### 5.4 Webhook Configuration

**Webhook URL**: `https://yourdomain.com/api/webhooks/new-job`

**Events**: Entry → Publish → Job content type

**Headers**:
- `x-webhook-secret`: Secret for verification

### 5.5 Automate Workflows

#### Application Confirmation Email
**Trigger**: HTTP Request from `/api/applications/submit`

**Body Template**:
```json
{
  "recipient_email": "{{1.body.email}}",
  "recipient_name": "{{1.body.name}}",
  "job_title": "{{1.body.job_title}}",
  "application_id": "{{1.body.application_id}}"
}
```

#### New Job Alert Email
**Trigger**: HTTP Request from `/api/webhooks/new-job`

**Body Template**:
```json
{
  "recipient_email": "{{1.body.recipient_email}}",
  "recipient_name": "{{1.body.recipient_name}}",
  "job_title": "{{1.body.job_title}}",
  "job_location": "{{1.body.job_location}}",
  "job_url": "{{1.body.job_url}}"
}
```

---

## 6. Third-Party Integrations

### 6.1 Algolia Search

#### Configuration
```typescript
import { liteClient as algoliasearch } from 'algoliasearch/lite';

export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);
```

#### Index Configuration
- **Index Name**: `job`
- **Searchable Attributes**: `title`, `description`, `skillNames`, `skillsText`, `category`
- **Typo Tolerance**: Enabled
- **Optional Words**: Skills (OR logic)

#### Data Sync
- **Manual Sync**: `/api/jobs/sync-algolia`
- **Automatic Sync**: Via Contentstack Marketplace app (if configured)

### 6.2 Lytics Analytics

#### Implementation
```typescript
// In layout.tsx
<script
  dangerouslySetInnerHTML={{
    __html: `
      (function(j,s,t,a,g){j.jstag=j.jstag||function(){(j.jstag.q=j.jstag.q||[]).push(arguments);};
      j.jstag.s=+new Date;var p=document.createElement(t);p.async=!0;p.src=a;
      var q=document.getElementsByTagName(t)[0];q.parentNode.insertBefore(p,q);
      })(window,document,'script','https://cdn.lytics.io/api/tag/2/jstag.min.js');
    `,
  }}
/>
```

#### Events Tracked
- `session_start`
- `job_view`
- `blog_read`
- `job_application`
- `search`
- `learning_view`

### 6.3 Google OAuth

#### Configuration
```typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
})
```

#### Redirect URIs
- Development: `http://localhost:3000/api/auth/callback/google`
- Production: `https://yourdomain.com/api/auth/callback/google`

---

## 7. Security Requirements

### 7.1 Authentication

#### Password Hashing
- **Algorithm**: bcrypt
- **Cost Factor**: 12
- **Library**: bcryptjs

#### Session Management
- **Strategy**: JWT tokens
- **Provider**: NextAuth.js
- **Storage**: HTTP-only cookies

#### OAuth Security
- **State Parameter**: Validated to prevent CSRF
- **PKCE**: Enabled for OAuth flows
- **Token Storage**: Secure, HTTP-only cookies

### 7.2 API Security

#### Webhook Verification
```typescript
const webhookSecret = request.headers.get('x-webhook-secret');
if (webhookSecret !== process.env.CONTENTSTACK_WEBHOOK_SECRET) {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
```

#### Admin Panel Protection
- **Method**: HTTP Basic Authentication
- **Implementation**: Next.js Edge Middleware
- **Route**: `/admin/*`

```typescript
// middleware.ts
if (pathname.startsWith('/admin')) {
  const authHeader = request.headers.get('authorization');
  if (!isValidCredentials(authHeader)) {
    return unauthorizedResponse();
  }
}
```

### 7.3 Data Security

#### SQL Injection Prevention
- **Method**: Parameterized queries
- **Library**: @neondatabase/serverless (automatic)

#### XSS Prevention
- **Method**: DOMPurify for HTML sanitization
- **Library**: dompurify

#### CSRF Protection
- **Method**: SameSite cookies
- **Framework**: NextAuth.js (built-in)

### 7.4 Environment Variables

**Never commit to git**:
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_SECRET`
- `DATABASE_URL`
- `CONTENTSTACK_WEBHOOK_SECRET`
- `ALGOLIA_ADMIN_KEY`
- `ADMIN_PASSWORD`

---

## 8. Performance Requirements

### 8.1 Response Time Targets

| Endpoint | Target | Measurement |
|----------|--------|-------------|
| **Page Load** | < 2s | Lighthouse |
| **Search API** | < 100ms | Algolia dashboard |
| **Job Recommendations** | < 500ms | Server logs |
| **Skill Gap Analysis** | < 2s | Server logs |
| **Application Submit** | < 1s | Server logs |

### 8.2 Caching Strategy

#### Static Assets
- **CDN**: Contentstack Launch
- **Cache Headers**: Long-term caching for static assets

#### API Responses
- **Next.js Caching**: Revalidate for dynamic content
- **Algolia**: Built-in caching
- **Contentstack**: CDN caching

#### Database Queries
- **Connection Pooling**: NeonDB serverless driver
- **Query Optimization**: Indexed columns

### 8.3 Optimization Techniques

#### Code Splitting
- **Next.js**: Automatic code splitting
- **Dynamic Imports**: For heavy components

#### Image Optimization
- **Next.js Image**: Automatic optimization
- **Contentstack Images**: CDN delivery

#### Bundle Size
- **Tree Shaking**: Automatic with Next.js
- **Minification**: Production builds

---

## 9. Deployment Architecture

### 9.1 Contentstack Launch

#### Hosting Configuration
- **Platform**: Contentstack Launch
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node Version**: 18+

#### Edge Functions
- **Location**: `/functions/[proxy].edge.js`
- **Purpose**: Geolocation headers, top paths

#### Environment Variables
- Set in Launch dashboard
- Synced across environments

### 9.2 Database (NeonDB)

#### Configuration
- **Type**: Serverless PostgreSQL
- **Connection**: Connection pooling
- **Backups**: Automatic
- **Scaling**: Auto-scaling

#### Migration Strategy
- **Schema**: `scripts/init-db.sql`
- **Migrations**: Manual via SQL scripts

### 9.3 CI/CD Pipeline

#### Build Process
1. Install dependencies: `npm install`
2. Type check: `npm run lint`
3. Build: `npm run build`
4. Test: `npm test` (optional)

#### Deployment
1. Git push to main branch
2. Launch triggers build
3. Deploy to edge
4. Health check

---

## 10. Development Guidelines

### 10.1 Code Style

#### TypeScript
- **Strict Mode**: Enabled
- **Type Coverage**: 100% for new code
- **Naming**: camelCase for variables, PascalCase for components

#### React
- **Server Components**: Default
- **Client Components**: Mark with `'use client'`
- **Hooks**: Follow React rules

#### File Structure
- **Components**: PascalCase (`Navigation.tsx`)
- **Utilities**: camelCase (`utils.ts`)
- **API Routes**: kebab-case (`skill-gap/route.ts`)

### 10.2 Testing

#### E2E Testing
- **Framework**: Playwright
- **Location**: `/e2e`
- **Run**: `npm test`

#### Manual Testing
- **Local Development**: `npm run dev`
- **Production Build**: `npm run build && npm start`

### 10.3 Error Handling

#### API Errors
```typescript
try {
  // API logic
} catch (error) {
  console.error('Error:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

#### Client Errors
```typescript
try {
  // Client logic
} catch (error) {
  console.error('Error:', error);
  // Show user-friendly error message
}
```

### 10.4 Logging

#### Server Logs
- **Level**: Error, Warn, Info
- **Format**: JSON (production)
- **Destination**: Launch logs

#### Client Logs
- **Development**: Console logs
- **Production**: Lytics events

---

## 📎 Appendix

### A. API Response Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | Success | GET, PATCH requests |
| 201 | Created | POST requests (new resource) |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid auth |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 422 | Validation Error | Invalid data format |
| 500 | Server Error | Internal server error |
| 503 | Service Unavailable | External service down |

### B. Contentstack API Endpoints

#### Delivery API
- **Base URL**: `https://cdn.contentstack.io/v3`
- **Authentication**: Delivery Token in header

#### Management API
- **Base URL**: `https://api.contentstack.io/v3`
- **Authentication**: Management Token in header

#### Personalize Edge API
- **Base URL**: `https://personalize-api.contentstack.com`
- **Authentication**: Auth Token in header

---

**Document Version History:**

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 14, 2025 | Initial TRD |
| 2.0 | Jan 2026 | Comprehensive rewrite with all technical details |

---

*This document is maintained by the JobDekho development team.*

