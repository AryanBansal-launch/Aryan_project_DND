# Product Requirements Document (PRD)
# JobPortal - AI-Powered Job Discovery Platform

**Version:** 1.2  
**Last Updated:** January 10, 2026  
**Author:** Aryan Bansal  
**Status:** Production Ready

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Solution Overview](#solution-overview)
4. [Target Users](#target-users)
5. [Core Features](#core-features)
6. [Technical Architecture](#technical-architecture)
7. [Contentstack Integration](#contentstack-integration)
8. [Third-Party Integrations](#third-party-integrations)
9. [Data Flow Diagrams](#data-flow-diagrams)
10. [User Journeys](#user-journeys)
11. [API Specifications](#api-specifications)
12. [Security & Authentication](#security--authentication)
13. [Personalization Engine](#personalization-engine)
14. [Success Metrics](#success-metrics)

---

## 1. Executive Summary

**JobPortal** is a modern, AI-powered job discovery platform that connects job seekers with employers through personalized experiences. Built on a composable architecture using Contentstack as the headless CMS backbone, the platform leverages real-time behavior tracking, intelligent search, and automated notifications to deliver a seamless hiring experience.

### Key Differentiators

| Feature | Technology | Value |
|---------|------------|-------|
| **Intelligent Search** | Algolia | Fuzzy matching, typo tolerance, instant results |
| **Behavior-Based Personalization** | Lytics + Personalize | Real-time content adaptation based on user behavior |
| **Location-Based Recommendations** | Launch Geolocation | Prioritize local jobs using visitor's country/region/city |
| **Skill Gap Analysis** | Algolia + Contentstack | Identify missing skills and recommend learning resources |
| **Learning Hub** | Contentstack + YouTube | Curated video tutorials with Brand Kit AI content |
| **Automated Notifications** | Contentstack Automate | Instant email alerts for new jobs and applications |
| **Headless Architecture** | Contentstack CMS | Omnichannel content delivery, live preview |
| **Edge-First Security** | Next.js Middleware | Fast authentication at the edge |

---

## 2. Problem Statement

### For Job Seekers
- **Information Overload**: Thousands of job listings without personalized filtering
- **Irrelevant Recommendations**: Generic job suggestions not matching skills/interests
- **Poor Notification Experience**: Missing out on relevant opportunities
- **Fragmented Experience**: Disconnected job search across platforms

### For Employers
- **Low Quality Applications**: Unqualified candidates applying to jobs
- **Manual Notification Process**: No automated way to notify interested candidates
- **Static Content**: Unable to personalize job listings for different user segments

---

## 3. Solution Overview

### Architecture Philosophy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPOSABLE ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐    │
│  │ Contentstack │   │   Algolia   │   │   Lytics    │   │  NeonDB     │    │
│  │    CMS      │   │   Search    │   │  Analytics  │   │  Database   │    │
│  └──────┬──────┘   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘    │
│         │                 │                 │                 │            │
│         └─────────────────┴─────────────────┴─────────────────┘            │
│                                    │                                        │
│                         ┌──────────▼──────────┐                            │
│                         │    Next.js 15       │                            │
│                         │    Frontend App     │                            │
│                         └──────────┬──────────┘                            │
│                                    │                                        │
│                         ┌──────────▼──────────┐                            │
│                         │  Contentstack       │                            │
│                         │  Launch (Hosting)   │                            │
│                         └─────────────────────┘                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Target Users

### 4.1 Job Seekers (Primary)

| Persona | Description | Needs |
|---------|-------------|-------|
| **Active Seekers** | Actively looking for jobs | Fast search, skill-based recommendations |
| **Passive Seekers** | Employed but open to opportunities | New job alerts, personalized banners |
| **First-Time Users** | New to the platform | Onboarding guidance, profile setup |
| **Returning Users** | Previous visitors | "What's new" updates, remembered preferences |

### 4.2 Employers (Secondary)

| Persona | Description | Needs |
|---------|-------------|-------|
| **Recruiters** | Post and manage job listings | Easy CMS workflow, application management |
| **HR Managers** | Review applications | Dashboard analytics, bulk actions |

### 4.3 Administrators

| Persona | Description | Needs |
|---------|-------------|-------|
| **Content Admins** | Manage all content | Protected admin panel, content CRUD |
| **System Admins** | Platform configuration | Environment management, monitoring |

---

## 5. Core Features

### 5.1 Job Discovery & Search

| Feature | Description | Technology |
|---------|-------------|------------|
| **Full-Text Search** | Search jobs by title, skills, description | Algolia |
| **Fuzzy Matching** | Handles typos and misspellings | Algolia typo tolerance |
| **Filter & Sort** | Location, job type, experience, salary | Contentstack queries |
| **Skill-Based Recommendations** | Jobs matching user's profile skills | Algolia + NeonDB |
| **Location-Based Recommendations** | Prioritize jobs in visitor's country/region/city | Launch Geolocation Headers |

### 5.2 User Management

| Feature | Description | Technology |
|---------|-------------|------------|
| **Email/Password Auth** | Traditional registration and login | NextAuth.js + NeonDB |
| **Google OAuth** | One-click social login | NextAuth.js + Google |
| **Profile Management** | Skills, experience, education | NeonDB |
| **Skill Persistence** | Skills saved and loaded on login | NeonDB user_skills table |

### 5.3 Application Flow

| Feature | Description | Technology |
|---------|-------------|------------|
| **Job Application** | Submit applications with resume | Next.js API routes |
| **Application Tracking** | View application status | NeonDB |
| **Email Confirmation** | Automated confirmation emails | Contentstack Automate |

### 5.4 Content Management

| Feature | Description | Technology |
|---------|-------------|------------|
| **Job Listings** | CRUD operations for jobs | Contentstack CMS |
| **Company Profiles** | Company information pages | Contentstack CMS |
| **Blog/Resources** | Career advice, industry news | Contentstack CMS |
| **Homepage Content** | Hero, stats, featured sections | Contentstack CMS |
| **Live Preview** | Real-time content preview | Contentstack Live Preview SDK |

### 5.5 Personalization

| Feature | Description | Technology |
|---------|-------------|------------|
| **Behavior Tracking** | Track job views, blog reads | Lytics + localStorage |
| **User Interest Profiling** | Build interest profiles (categories, skills) | behavior-tracking.ts |
| **Personalized Banners** | Show contextual banners based on behavior | Personalize Edge SDK |
| **Recommended For You** | Personalized job recommendations on homepage | RecommendedForYou.tsx |

### 5.6 Notifications

| Feature | Description | Technology |
|---------|-------------|------------|
| **New Job Alerts** | Email when new jobs are published | Contentstack Webhooks + Automate |
| **In-App Notifications** | Real-time notification dropdown | Contentstack Management API |
| **Application Updates** | Email on application status changes | Contentstack Automate |

### 5.7 Learning Hub

| Feature | Description | Technology |
|---------|-------------|------------|
| **Video Tutorials** | Curated YouTube learning resources | Contentstack + YouTube |
| **Technology Filtering** | Filter by React, Node.js, Python, etc. | Contentstack queries |
| **Difficulty Levels** | Beginner, Intermediate, Advanced | Content type field |
| **Skills Covered** | Tags showing skills taught | Modular block field |
| **Bookmarking** | Save resources for later | localStorage |
| **Related Resources** | Smart recommendations | Same technology filter |

### 5.8 Skill Gap Analysis & Learning Recommendations

| Feature | Description | Technology |
|---------|-------------|------------|
| **Job Market Analysis** | Analyze all jobs to identify in-demand skills | Algolia + skill-gap-analyzer.ts |
| **User Skill Comparison** | Compare user skills with market demand | NeonDB + Algolia |
| **Match Percentage** | Calculate how well user matches job market | Algorithm |
| **Gap Identification** | Identify skills user lacks but are in high demand | Analysis engine |
| **Learning Recommendations** | Suggest relevant learning resources for each gap | Contentstack learning_resource |
| **Personalized Banner** | Site-wide banner showing skill gap insights | SkillGapBanner.tsx |
| **Priority Ranking** | Rank skill gaps by job count (impact) | Sorting algorithm |

---

## 6. Technical Architecture

### 6.1 Frontend Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Framework:     Next.js 15 (App Router)                         │
│  Language:      TypeScript                                       │
│  Styling:       Tailwind CSS 4                                   │
│  Icons:         Lucide React                                     │
│  State:         React Hooks + Context                            │
│  Forms:         Native + Controlled Components                   │
│  Auth:          NextAuth.js                                      │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                      KEY COMPONENTS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  /app                                                            │
│  ├── page.tsx              → Homepage (Server Component)        │
│  ├── HomeClient.tsx        → Homepage interactivity             │
│  ├── jobs/[id]/page.tsx    → Job detail (Server + Client)       │
│  ├── profile/page.tsx      → User profile management            │
│  ├── learnings/page.tsx    → Learning Hub listing               │
│  ├── learnings/[slug]/     → Learning resource detail           │
│  └── admin/page.tsx        → Protected admin dashboard          │
│                                                                  │
│  /components                                                     │
│  ├── Navigation.tsx        → Site navigation                    │
│  ├── PersonalizedBanner.tsx → Behavior-based banners            │
│  ├── RecommendedForYou.tsx → Personalized recommendations       │
│  ├── BehaviorTracker.tsx   → Lytics + Personalize init          │
│  ├── SkillGapBanner.tsx    → Skill gap awareness banner         │
│  └── SkillGapRecommendations.tsx → Profile skill gap analysis   │
│                                                                  │
│  /lib                                                            │
│  ├── contentstack.ts       → CMS integration                    │
│  ├── algolia.ts            → Search integration                 │
│  ├── behavior-tracking.ts  → User behavior utilities            │
│  ├── skill-gap-analyzer.ts → Skill gap analysis engine          │
│  └── users.ts              → Database operations                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Backend Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  API Routes (Next.js App Router)                                │
│  ├── /api/auth/*           → NextAuth.js handlers               │
│  ├── /api/user/skills      → GET/POST user skills               │
│  ├── /api/user/profile     → GET user profile                   │
│  ├── /api/jobs/recommendations → POST skill-based search        │
│  ├── /api/jobs/sync-algolia → POST sync jobs to Algolia         │
│  ├── /api/skill-gap        → POST analyze skill gaps            │
│  ├── /api/applications/submit → POST job application            │
│  ├── /api/webhooks/new-job → POST Contentstack webhook          │
│  └── /api/notifications    → GET/POST/DELETE notifications      │
│                                                                  │
│  Middleware (Edge Functions)                                     │
│  └── middleware.ts         → Admin panel Basic Auth             │
│                                                                  │
│  Database (NeonDB PostgreSQL)                                    │
│  ├── users                 → User accounts                       │
│  ├── user_skills           → User skill associations             │
│  └── applications          → Job applications                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3 Database Schema

```sql
-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  auth_provider VARCHAR(50) DEFAULT 'email',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Skills Table
CREATE TABLE user_skills (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  skill VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(email, skill)
);

-- Applications Table
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  job_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  cover_letter TEXT,
  resume_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 7. Contentstack Integration

### 7.1 Products Used

| Product | Purpose | Implementation |
|---------|---------|----------------|
| **Headless CMS** | Content storage and delivery | Jobs, Companies, Blogs, Homepage |
| **Delivery SDK** | Content fetching | `lib/contentstack.ts` |
| **Management API** | CRUD operations | Notifications |
| **Live Preview** | Real-time preview | Visual editing |
| **Personalize** | User segmentation | Audience-based content |
| **Data & Insights (Lytics)** | Behavior tracking | Analytics |
| **Automate** | Workflow automation | Email notifications |
| **Webhooks** | Event triggers | New job alerts |
| **Launch** | Hosting + Geolocation | Production deployment with geo headers |
| **Marketplace** | App integrations | Algolia, AI Chatbot |

### 7.2 Content Types

| Content Type | Fields | Purpose |
|--------------|--------|---------|
| **job** | title, description, requirements, responsibilities, company (ref), location, type, salary, skills, category, status, posted_at | Job listings |
| **company** | title, description, location, industry, size, logo, benefits | Company profiles |
| **blog_post** | title, slug, content, author, featured_image, category | Blog articles |
| **homepage** | hero_title, hero_subtitle, featured_jobs, stats | Homepage content |
| **navigation** | nav_items | Site navigation |
| **notification** | user_email, type, title, message, read, metadata | User notifications |
| **personalized_banner** | banner_title, banner_message, cta_text, cta_link, user_segment, enabled | Personalized banners |
| **learning_resource** | title, slug, description, technology, difficulty_level, youtube_url, youtube_video_id, duration, thumbnail, key_takeaways, skills_covered, instructor, published_date, featured, order | Learning video tutorials |

### 7.3 Personalize Configuration

#### Experiences

| Experience Name | Short UID | Audience Target | Banner Type |
|-----------------|-----------|-----------------|-------------|
| first_time_user | 6 | Session count = 1 | Welcome banner |
| Personalized Banner | 4 | Default | General banner |
| Tech Job Seekers | 7 | top_category = Engineering | Tech jobs banner |
| Nudge Experience | 8 | ready_to_apply = true | Apply now banner |
| Welcome Back | 9 | session_count > 1 | Returning user banner |

#### Attributes Tracked

| Attribute | Type | Description |
|-----------|------|-------------|
| total_job_views | Number | Total jobs viewed in session |
| total_blog_reads | Number | Total blogs read |
| engagement_level | String | low/medium/high |
| session_count | Number | Number of sessions |
| top_category | String | Most viewed job category |
| top_skill | String | Most common skill in viewed jobs |
| is_returning_user | Boolean | Has visited before |
| has_applied | Boolean | Has applied to any job |
| ready_to_apply | Boolean | Viewed 3+ jobs, no applications |
| first_time_user | Boolean | First session |

---

## 8. Third-Party Integrations

### 8.1 Algolia Search

**Purpose:** Fast, relevant job search with fuzzy matching

**Configuration:**
- Index Name: `job`
- Searchable Attributes: `title`, `description`, `skillNames`, `skillsText`, `category`
- Typo Tolerance: Enabled
- Synonyms: Configurable in dashboard

**Data Flow:**
```
Contentstack (Jobs) → Sync API → Algolia Index → Search Queries → Results
```

### 8.2 Lytics (Data & Insights)

**Purpose:** Real-time user behavior tracking

**Events Tracked:**
- `session_start` - User starts a session
- `job_view` - User views a job
- `blog_read` - User reads a blog
- `job_application` - User applies to a job

**Implementation:**
```javascript
// Lytics tag in layout.tsx
jstag.send('job_view', {
  job_uid: job.uid,
  job_title: job.title,
  category: job.category,
  skills: job.skills
});
```

### 8.3 NeonDB

**Purpose:** User authentication and skill storage

**Features:**
- Serverless PostgreSQL
- Auto-scaling
- Branching support

### 8.4 NextAuth.js

**Purpose:** Authentication

**Providers:**
- Credentials (Email/Password)
- Google OAuth

---

## 9. Data Flow Diagrams

### 9.1 User Registration Flow

```
┌──────────┐    ┌──────────────┐    ┌──────────┐    ┌──────────┐
│  User    │───▶│  Register    │───▶│  NeonDB  │───▶│  Session │
│  Form    │    │  API Route   │    │  Insert  │    │  Created │
└──────────┘    └──────────────┘    └──────────┘    └──────────┘
```

### 9.2 Job Search Flow

```
┌──────────┐    ┌──────────────┐    ┌──────────┐    ┌──────────┐
│  Search  │───▶│  Algolia     │───▶│  Fuzzy   │───▶│  Results │
│  Query   │    │  Client      │    │  Match   │    │  Display │
└──────────┘    └──────────────┘    └──────────┘    └──────────┘
```

### 9.3 Personalization Flow

```
┌──────────┐    ┌──────────────┐    ┌──────────┐    ┌──────────┐
│  User    │───▶│  Behavior    │───▶│  Edge    │───▶│  Banner  │
│  Action  │    │  Tracking    │    │  API     │    │  Display │
└──────────┘    └──────────────┘    └──────────┘    └──────────┘
      │                │
      │                ▼
      │         ┌──────────────┐
      └────────▶│  Lytics      │
                │  Analytics   │
                └──────────────┘
```

### 9.4 New Job Notification Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  CMS: Job    │───▶│  Contentstack│───▶│  /api/webhooks│
│  Published   │    │  Webhook     │    │  /new-job     │
└──────────────┘    └──────────────┘    └──────────────┘
                                               │
                                               ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Email Sent  │◀───│  Automate    │◀───│  NeonDB:     │
│  to Users    │    │  Workflow    │    │  Get Users   │
└──────────────┘    └──────────────┘    └──────────────┘
```

### 9.5 Location-Based Job Recommendations Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  User Request│───▶│  Launch Edge │───▶│  Inject Geo  │
│  (Browser)   │    │  CDN         │    │  Headers     │
└──────────────┘    └──────────────┘    └──────────────┘
                                               │
                    ┌──────────────────────────┘
                    ▼
             ┌──────────────┐
             │ Edge Function│
             │ [proxy].edge │
             └──────┬───────┘
                    │ Forward: x-visitor-country
                    │          x-visitor-region
                    │          x-visitor-city
                    ▼
             ┌──────────────┐    ┌──────────────┐
             │  Next.js API │───▶│  Algolia     │
             │  /api/jobs/  │    │  Search      │
             │ recommendations│    │  (by skills) │
             └──────┬───────┘    └──────────────┘
                    │
                    ▼
             ┌──────────────────────────────────────────┐
             │          LOCATION SCORING                 │
             │  • Calculate location score per job      │
             │  • City match = 1.0, Region = 0.8        │
             │  • Country = 0.6, Remote = 0.3           │
             │  • Combined: skill(60%) + location(40%) │
             └──────────────────────────────────────────┘
                    │
                    ▼
             ┌──────────────┐
             │  Re-ranked   │
             │  Results     │
             │  (local first)│
             └──────────────┘
```

### 9.6 Skill Gap Analysis Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  User Skills │───▶│  /api/       │───▶│  Algolia:    │
│  (NeonDB)    │    │  skill-gap   │    │  All Jobs    │
└──────────────┘    └──────────────┘    └──────────────┘
                                               │
                                               ▼
                                        ┌──────────────┐
                                        │  Analyze     │
                                        │  Skill Demand│
                                        └──────┬───────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    │                          │                          │
                    ▼                          ▼                          ▼
             ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
             │  Compare w/  │    │  Calculate   │    │  Fetch       │
             │  User Skills │    │  Match %     │    │  Learnings   │
             └──────────────┘    └──────────────┘    └──────────────┘
                    │                          │                          │
                    └──────────────────────────┼──────────────────────────┘
                                               │
                                               ▼
             ┌──────────────────────────────────────────────────────┐
             │                SKILL GAP RECOMMENDATIONS              │
             │  • Missing skills ranked by job count (demand)       │
             │  • Relevant learning resources for each skill        │
             │  • Match percentage (how well user fits job market)  │
             └──────────────────────────────────────────────────────┘
```

---

## 10. User Journeys

### 10.1 First-Time User Journey

```
1. User lands on homepage
   └── BehaviorTracker initializes
   └── session_count = 1, first_time_user = true
   
2. Views job listings
   └── trackJobView() called
   └── Interests updated in localStorage
   
3. Views 3 jobs without applying
   └── ready_to_apply = true
   └── Personalized "Ready to Apply" banner appears
   
4. Creates account
   └── Skills saved to NeonDB
   └── Email stored for notifications
   
5. Gets personalized recommendations
   └── RecommendedForYou component shows matching jobs
```

### 10.2 Returning User Journey

```
1. User returns to site
   └── session_count > 1
   └── is_returning_user = true
   
2. "Welcome Back" banner appears
   └── Edge API returns variant for experience 9
   
3. Views profile
   └── Skills loaded from NeonDB
   └── Previous preferences displayed
   
4. Searches for new jobs
   └── Algolia returns skill-matched results
```

### 10.3 Skill Gap Learning Journey

```
1. User views profile page
   └── SkillGapRecommendations component loads
   └── API fetches all jobs from Algolia
   
2. Skill gap analysis runs
   └── Extracts skills from all jobs
   └── Compares with user's saved skills
   └── Calculates match percentage
   
3. Results displayed
   └── "Your Job Market Match: 35%"
   └── High-priority gaps identified
   └── "Learn Python to unlock 85 more jobs"
   
4. User clicks "Browse Learnings"
   └── Redirected to Learning Hub
   └── Pre-filtered by recommended skill
   
5. User watches tutorial
   └── trackLearningView() called
   └── Behavior profile updated
   
6. User adds new skill to profile
   └── Match percentage increases
   └── New job recommendations appear
```

### 10.4 Learning Hub Discovery Journey

```
1. User navigates to Learning Hub
   └── /learnings page loads
   └── All learning resources fetched from Contentstack
   
2. Filters by technology
   └── "React" selected
   └── Resources filtered client-side
   
3. Selects a tutorial
   └── Detail page with YouTube embed
   └── trackLearningView() tracks engagement
   
4. Views related resources
   └── Same technology suggestions
   └── Different difficulty levels
   
5. Bookmarks for later
   └── Saved to localStorage
   └── Quick access on return
```

---

## 11. API Specifications

### 11.1 User Skills API

**GET /api/user/skills**
```json
Response 200:
{
  "skills": ["React", "TypeScript", "Node.js"]
}
```

**POST /api/user/skills**
```json
Request:
{
  "skills": ["React", "TypeScript", "Python"]
}

Response 200:
{
  "success": true,
  "skills": ["React", "TypeScript", "Python"]
}
```

### 11.2 Job Recommendations API (with Geolocation)

**POST /api/jobs/recommendations**

The recommendations API now supports location-based prioritization using Launch's geolocation headers.

```json
Request:
{
  "skills": ["React", "Node.js"],
  "limit": 10,
  "prioritizeLocal": true
}

Response 200:
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

**Launch Geolocation Headers:**
| Header | Description | Example |
|--------|-------------|---------|
| `visitor-ip-country` | ISO 2-letter country code | `US`, `IN`, `GB` |
| `visitor-ip-region` | Region/state name | `California`, `Karnataka` |
| `visitor-ip-city` | City name | `San Francisco`, `Bangalore` |

**Scoring Algorithm:**
- City match: 1.0
- Region match: 0.8
- Country match: 0.6
- Remote jobs: 0.3 (base boost)
- Combined score: `(skillMatch × 60%) + (locationMatch × 40%)`

### 11.3 Webhook - New Job

**POST /api/webhooks/new-job**
```json
Headers:
{
  "x-webhook-secret": "your-secret"
}

Body (from Contentstack):
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

### 11.4 Skill Gap Analysis API

**POST /api/skill-gap**
```json
Request:
{
  "userSkills": ["React", "JavaScript", "CSS"]
}

Response 200:
{
  "success": true,
  "data": {
    "totalJobsAnalyzed": 150,
    "userSkillCount": 3,
    "matchingJobsCount": 45,
    "matchPercentage": 30,
    "topMarketSkills": [
      { "skill": "python", "jobCount": 85, "percentage": 57 },
      { "skill": "typescript", "jobCount": 72, "percentage": 48 },
      { "skill": "react", "jobCount": 65, "percentage": 43 }
    ],
    "skillGaps": [
      {
        "skill": "python",
        "jobCount": 85,
        "percentage": 57,
        "priority": "high",
        "learningResources": [
          {
            "title": "Python for Beginners",
            "slug": "python-beginners",
            "technology": "Python",
            "difficulty_level": "Beginner",
            "youtube_video_id": "abc123"
          }
        ]
      },
      {
        "skill": "typescript",
        "jobCount": 72,
        "percentage": 48,
        "priority": "high",
        "learningResources": [...]
      }
    ],
    "userMatchedSkills": ["react", "javascript", "css"],
    "recommendations": {
      "message": "You're on the right track!",
      "suggestedNextSkill": "python",
      "potentialJobIncrease": 85
    }
  }
}
```

---

## 12. Security & Authentication

### 12.1 Authentication Methods

| Method | Implementation | Use Case |
|--------|----------------|----------|
| Email/Password | NextAuth Credentials Provider | Traditional signup |
| Google OAuth | NextAuth Google Provider | Social login |
| API Routes | Session validation | Protected endpoints |

### 12.2 Admin Panel Protection

**Middleware-based Basic Auth:**
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check Basic Auth header
    // Return 401 if invalid
  }
}
```

### 12.3 Webhook Security

**Secret Verification:**
```typescript
const webhookSecret = request.headers.get('x-webhook-secret');
if (webhookSecret !== process.env.CONTENTSTACK_WEBHOOK_SECRET) {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
```

---

## 13. Personalization Engine

### 13.1 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   PERSONALIZATION ENGINE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │  Client-Side    │    │  Server-Side    │                    │
│  │  (localStorage) │    │  (Edge API)     │                    │
│  └────────┬────────┘    └────────┬────────┘                    │
│           │                      │                              │
│           ▼                      ▼                              │
│  ┌─────────────────────────────────────────┐                   │
│  │         PERSONALIZATION DECISION        │                   │
│  │                                         │                   │
│  │  1. Try Edge API manifest               │                   │
│  │  2. Check for active variants           │                   │
│  │  3. If match → Use Personalize content  │                   │
│  │  4. Else → Use local behavior fallback  │                   │
│  │                                         │                   │
│  └─────────────────────────────────────────┘                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 13.2 Banner Selection Logic

```javascript
// Priority order:
1. Edge API active variant (if available)
2. ready_to_apply (viewed 3+ jobs, no applications)
3. tech_job_seeker (interested in Engineering)
4. returning_user (session_count > 1)
5. first_time_user (session_count = 1, < 3 views)
6. default
```

### 13.3 Lytics Integration

**Events Sent:**
- Page views (automatic via jstag)
- session_start
- job_view
- blog_read
- job_application

**Data Available in Lytics Dashboard:**
- User segments
- Behavior patterns
- Conversion funnels
- Real-time activity

---

## 14. Success Metrics

### 14.1 User Engagement

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Session Duration** | > 3 min | Lytics analytics |
| **Jobs Viewed/Session** | > 5 | behavior-tracking.ts |
| **Return Rate** | > 40% | session_count > 1 |
| **Profile Completion** | > 60% | Skills saved |

### 14.2 Conversion

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Application Rate** | > 5% | Applications / Views |
| **Click-Through (Banner)** | > 15% | trackEdgeImpression |
| **Recommendation Clicks** | > 20% | RecommendedForYou |

### 14.3 Technical Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Page Load Time** | < 2s | Lighthouse |
| **Search Response** | < 100ms | Algolia dashboard |
| **API Response** | < 500ms | Server logs |
| **Uptime** | > 99.9% | Launch monitoring |

---

## 📎 Appendix

### A. Environment Variables

```env
# NextAuth
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Database
DATABASE_URL=

# Contentstack
NEXT_PUBLIC_CONTENTSTACK_API_KEY=
NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN=
NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT=
NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID=
NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_USER_UID=
NEXT_PUBLIC_CONTENTSTACK_AUTHTOKEN=

# Algolia
NEXT_PUBLIC_ALGOLIA_APP_ID=
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=
ALGOLIA_ADMIN_KEY=

# Admin
ADMIN_USERNAME=
ADMIN_PASSWORD=

# Webhooks
CONTENTSTACK_WEBHOOK_SECRET=
CONTENTSTACK_NEW_JOB_EMAIL_WEBHOOK=
```

### B. Related Documentation

- [Contentstack Documentation](https://www.contentstack.com/docs/)
- [Contentstack Personalize Edge API](https://www.contentstack.com/docs/developers/apis/personalize-edge-api)
- [Algolia Documentation](https://www.algolia.com/doc/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [NeonDB Documentation](https://neon.tech/docs)

---

**Document Version History:**

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 14, 2025 | Initial PRD |
| 1.1 | Dec 14, 2025 | Added Learning Hub & Skill Gap Analysis features |
| 1.2 | Jan 10, 2026 | Added Location-Based Job Recommendations using Launch Geolocation Headers |

---

*This document is maintained by the JobPortal development team.*

