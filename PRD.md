# Product Requirements Document (PRD)
# JobDekho - AI-Powered Job Discovery Platform

**Version:** 2.0  
**Last Updated:** January 2026  
**Author:** Aryan Bansal  
**Status:** Production Ready

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Solution Overview](#solution-overview)
4. [Target Users](#target-users)
5. [Core Features](#core-features)
6. [User Journeys](#user-journeys)
7. [Content Management](#content-management)
8. [Personalization & AI Features](#personalization--ai-features)
9. [Success Metrics](#success-metrics)
10. [Future Enhancements](#future-enhancements)

---

## 1. Executive Summary

**JobDekho** is an AI-powered job discovery platform that revolutionizes how job seekers find opportunities and employers connect with talent. Built on a modern composable architecture, the platform combines intelligent search, real-time personalization, skill gap analysis, and automated workflows to deliver a seamless hiring experience.

### Key Differentiators

| Feature | Technology | Value Proposition |
|---------|------------|-------------------|
| **Intelligent Search** | Algolia | Fuzzy matching, typo tolerance, instant results |
| **Behavior-Based Personalization** | Lytics + Personalize | Real-time content adaptation based on user behavior |
| **Location-Based Recommendations** | Launch Geolocation | Prioritize local jobs using visitor's country/region/city |
| **Skill Gap Analysis** | Algolia + Contentstack | Identify missing skills and recommend learning resources |
| **Learning Hub** | Contentstack + YouTube | Curated video tutorials with Brand Kit AI content |
| **Automated Notifications** | Contentstack Automate | Instant email alerts for new jobs and applications |
| **Headless Architecture** | Contentstack CMS | Omnichannel content delivery, live preview |
| **Edge-First Security** | Next.js Middleware | Fast authentication at the edge |

### Business Goals

- **Reduce time to find relevant jobs by 60%** through intelligent search and personalization
- **Increase application quality by 40%** through skill-based matching
- **Bridge skill gaps** with integrated learning resources
- **Improve user engagement** with behavior-driven content

---

## 2. Problem Statement

### For Job Seekers

- **Information Overload**: Thousands of job listings without personalized filtering
- **Irrelevant Recommendations**: Generic job suggestions not matching skills/interests
- **Poor Notification Experience**: Missing out on relevant opportunities
- **Fragmented Experience**: Disconnected job search across platforms
- **Skill Gap Blindness**: No insight into what skills to learn for better opportunities
- **Location Mismatch**: Jobs shown don't match geographic preferences

### For Employers

- **Low Quality Applications**: Unqualified candidates applying to jobs
- **Manual Notification Process**: No automated way to notify interested candidates
- **Static Content**: Unable to personalize job listings for different user segments
- **Limited Reach**: Difficulty reaching the right candidates

### For Administrators

- **Content Management Complexity**: Difficult to update content without technical knowledge
- **Multi-Channel Publishing**: Need to update content across multiple platforms
- **Analytics Gaps**: Limited visibility into user behavior and engagement

---

## 3. Solution Overview

### Architecture Philosophy

JobDekho follows a **composable architecture** approach, leveraging best-of-breed services:

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

### Core Value Propositions

1. **Personalized Job Discovery**: AI-powered recommendations based on skills, behavior, and location
2. **Skill Gap Analysis**: Identify missing skills and provide learning resources
3. **Intelligent Search**: Fuzzy matching, typo tolerance, instant results
4. **Automated Workflows**: Email notifications, application confirmations, job alerts
5. **Learning Integration**: Bridge skill gaps with curated video tutorials
6. **Real-Time Personalization**: Content adapts based on user behavior

---

## 4. Target Users

### 4.1 Job Seekers (Primary)

| Persona | Description | Needs | Pain Points |
|---------|-------------|-------|-------------|
| **Active Seekers** | Actively looking for jobs | Fast search, skill-based recommendations | Too many irrelevant results |
| **Passive Seekers** | Employed but open to opportunities | New job alerts, personalized banners | Don't want to actively search |
| **First-Time Users** | New to the platform | Onboarding guidance, profile setup | Overwhelmed by options |
| **Returning Users** | Previous visitors | "What's new" updates, remembered preferences | Forgot previous searches |
| **Career Changers** | Switching industries | Skill gap analysis, learning resources | Don't know what skills needed |

### 4.2 Employers (Secondary)

| Persona | Description | Needs | Pain Points |
|---------|-------------|-------|-------------|
| **Recruiters** | Post and manage job listings | Easy CMS workflow, application management | Manual notification process |
| **HR Managers** | Review applications | Dashboard analytics, bulk actions | Low quality applications |

### 4.3 Administrators

| Persona | Description | Needs | Pain Points |
|---------|-------------|-------|-------------|
| **Content Admins** | Manage all content | Protected admin panel, content CRUD | Technical knowledge required |
| **System Admins** | Platform configuration | Environment management, monitoring | Complex deployments |

---

## 5. Core Features

### 5.1 Job Discovery & Search

#### Full-Text Search
- **Technology**: Algolia
- **Features**:
  - Search by title, skills, description, company
  - Fuzzy matching (handles typos)
  - Typo tolerance enabled
  - Instant results as you type
  - Searchable attributes: `title`, `description`, `skillNames`, `skillsText`, `category`

#### Advanced Filtering
- **Location**: City, state, country, or "Remote"
- **Job Type**: Full-time, Part-time, Contract, Freelance
- **Experience Level**: Entry, Mid, Senior, Lead
- **Salary Range**: Slider-based filtering
- **Category**: Engineering, Design, Marketing, Sales, etc.
- **Multi-filter Support**: Combine multiple filters simultaneously

#### Skill-Based Recommendations
- **Technology**: Algolia + NeonDB
- **How it works**:
  1. User adds skills to profile
  2. Skills saved to NeonDB
  3. Algolia searches jobs matching ANY skill (OR logic)
  4. Results ranked by skill match score
  5. Highlights matching skills in results

#### Location-Based Recommendations
- **Technology**: Launch Geolocation Headers
- **How it works**:
  1. Launch automatically injects geolocation headers
  2. Headers: `visitor-ip-country`, `visitor-ip-region`, `visitor-ip-city`
  3. Jobs scored by location proximity
  4. Combined score: skill match (60%) + location match (40%)
  5. Local jobs prioritized in results

**Scoring Algorithm**:
- City match: 1.0
- Region match: 0.8
- Country match: 0.6
- Remote jobs: 0.3 (base boost)

### 5.2 User Management

#### Authentication
- **Email/Password Auth**: Traditional registration with secure password hashing (bcrypt)
- **Google OAuth**: One-click social login
- **Session Management**: JWT tokens via NextAuth.js
- **Password Requirements**: Minimum 6 characters

#### Profile Management
- **Skills**: Add/remove skills, auto-saved to NeonDB
- **Experience Level**: Entry, Mid, Senior, Lead
- **Location Preferences**: City, state, country
- **Job Preferences**: Job type, salary range, remote preference
- **Cross-Device Sync**: Skills and preferences sync across devices

#### Application Tracking
- **Status Tracking**: Submitted, Reviewed, Shortlisted, Interview, Rejected, Accepted
- **Application History**: View all applications in one place
- **Filter by Status**: Filter applications by current status
- **Withdraw Option**: Withdraw applications before review
- **Email Notifications**: Status update emails via Automate

### 5.3 Application Flow

#### Job Application Process
1. User clicks "Apply Now" on job detail page
2. If not logged in, redirected to login
3. Application form includes:
   - Cover letter (required)
   - Portfolio link (optional)
   - Expected salary (optional)
   - Availability (optional)
   - Additional information (optional)
4. Submit application
5. Instant email confirmation via Contentstack Automate
6. Application saved to NeonDB
7. Status tracked in database

#### Application Status Updates
- **Automated Emails**: Status changes trigger email notifications
- **In-App Notifications**: Real-time notification dropdown
- **Status Flow**: Submitted → Reviewed → Shortlisted → Interview → Accepted/Rejected

### 5.4 Content Management

#### Content Types
| Content Type | Purpose | Key Fields |
|--------------|---------|------------|
| **Job** | Job listings | title, description, requirements, responsibilities, company (ref), location, type, salary, skills, category, status, posted_at |
| **Company** | Company profiles | title, description, location, industry, size, logo, benefits |
| **Blog Post** | Blog articles | title, slug, content, author, featured_image, category, tags |
| **Homepage** | Homepage content | hero_title, hero_subtitle, featured_jobs, stats |
| **Navigation** | Site navigation | nav_items (links array) |
| **Notification** | User notifications | user_email, type, title, message, read, metadata |
| **Personalized Banner** | Behavior-based banners | banner_title, banner_message, cta_text, cta_link, user_segment, enabled, priority |
| **Learning Resource** | Video tutorials | title, slug, description, technology, difficulty_level, youtube_url, youtube_video_id, duration, thumbnail, key_takeaways, skills_covered, instructor, published_date, featured, order |

#### Multi-Locale Support
- **Supported Locales**: English (en-us), Hindi (hi-in)
- **Language Switcher**: Available on Blogs page
- **Content Localization**: All content types support multiple locales
- **Reference Resolution**: Jobs automatically link to Company entries with full data

#### Live Preview
- **Real-time Preview**: Contentstack Live Preview SDK
- **Visual Editing**: Edit content directly in preview mode
- **Editable Tags**: Content marked as editable in preview

### 5.5 Personalization

#### Behavior Tracking
- **Technology**: Lytics + localStorage
- **Events Tracked**:
  - `session_start`: User starts a session
  - `job_view`: User views a job
  - `blog_read`: User reads a blog
  - `job_application`: User applies to a job
  - `search`: User searches for jobs
  - `learning_view`: User views learning resource

#### User Interest Profiling
- **Categories**: Track most viewed job categories
- **Skills**: Track skills user is interested in
- **Locations**: Track locations user explores
- **Engagement Level**: low/medium/high based on views and applications

#### Personalized Banners
- **Technology**: Contentstack Personalize Edge SDK
- **Experiences**:
  - First-time user (session_count = 1)
  - Returning user (session_count > 1)
  - Tech job seekers (top_category = Engineering)
  - Ready to apply (viewed 3+ jobs, no applications)
  - Personalized Banner (default)

#### Recommended For You
- **Homepage Section**: Shows personalized job recommendations
- **Based on**: User skills + browsing behavior
- **Updates**: Real-time as user browses

### 5.6 Notifications

#### New Job Alerts
- **Trigger**: Job published in Contentstack
- **Technology**: Contentstack Webhooks + Automate
- **Recipients**: All registered users
- **Email Format**: HTML with job details, CTA button

#### In-App Notifications
- **Technology**: Contentstack Management API
- **Features**:
  - Real-time notification dropdown
  - Mark as read/unread
  - Delete notifications
  - Click to view details
  - Application notifications with "View Application" button

#### Application Updates
- **Trigger**: Application status changes
- **Technology**: Contentstack Automate
- **Recipients**: Applicant
- **Content**: Status update with job details

### 5.7 Learning Hub

#### Video Tutorials
- **Source**: YouTube integration
- **Content**: Curated learning resources from Contentstack
- **Features**:
  - Filter by technology (React, Node.js, Python, etc.)
  - Filter by difficulty (Beginner, Intermediate, Advanced)
  - Skills covered tags
  - Related resources
  - Bookmarking (localStorage)
  - Duration and instructor info

#### Learning Resource Details
- **YouTube Embed**: Full video player
- **Key Takeaways**: Bullet points of learning outcomes
- **Skills Covered**: Tags showing skills taught
- **Related Resources**: Same technology suggestions
- **Difficulty Level**: Clear indication of skill level required

### 5.8 Skill Gap Analysis & Learning Recommendations

#### Job Market Analysis
- **Technology**: Algolia + skill-gap-analyzer.ts
- **Process**:
  1. Fetch all jobs from Algolia
  2. Extract skills from all jobs
  3. Count skill demand (how many jobs require each skill)
  4. Calculate percentages

#### User Skill Comparison
- **Process**:
  1. Get user skills from NeonDB
  2. Compare with market demand
  3. Identify missing skills (gaps)
  4. Calculate match percentage

#### Match Percentage
- **Formula**: `(matchingJobs / totalJobs) * 100`
- **Display**: "Your Job Market Match: 35%"
- **Updates**: Real-time as user adds skills

#### Gap Identification
- **Priority Levels**:
  - High: Skill in 30%+ of jobs
  - Medium: Skill in 15-30% of jobs
  - Low: Skill in <15% of jobs
- **Job Impact**: Shows how many more jobs user would qualify for

#### Learning Recommendations
- **Process**:
  1. For each skill gap, find matching learning resources
  2. Match by technology (e.g., "Python" → Python tutorials)
  3. Match by skill name in learning resource tags
  4. Return top 3 resources per skill gap

#### Personalized Banner
- **Site-wide Banner**: Shows skill gap insights
- **Content**: "Learn Python to unlock 85 more jobs"
- **CTA**: "Browse Learnings" → Learning Hub

---

## 6. User Journeys

### 6.1 First-Time User Journey

```
1. User lands on homepage
   └── BehaviorTracker initializes
   └── session_count = 1, first_time_user = true
   └── Welcome popup appears (if configured)
   
2. Views job listings
   └── trackJobView() called
   └── Interests updated in localStorage
   └── Lytics event sent
   
3. Views 3 jobs without applying
   └── ready_to_apply = true
   └── Personalized "Ready to Apply" banner appears
   
4. Creates account
   └── Email/password or Google OAuth
   └── User saved to NeonDB
   └── Email stored for notifications
   
5. Adds skills to profile
   └── Skills saved to NeonDB
   └── Skills persist across sessions
   
6. Gets personalized recommendations
   └── RecommendedForYou component shows matching jobs
   └── Skill-based search via Algolia
   └── Location-based prioritization (if geo available)
```

### 6.2 Returning User Journey

```
1. User returns to site
   └── session_count > 1
   └── is_returning_user = true
   └── "Welcome Back" banner appears
   
2. Logs in
   └── Skills loaded from NeonDB
   └── Previous preferences displayed
   
3. Views profile
   └── Skill gap analysis runs
   └── Match percentage displayed
   └── Skill gaps identified
   
4. Searches for new jobs
   └── Algolia returns skill-matched results
   └── Location-based prioritization
   └── Fuzzy matching handles typos
   
5. Applies to job
   └── Application form submitted
   └── Email confirmation sent
   └── Status tracked in database
```

### 6.3 Skill Gap Learning Journey

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

### 6.4 Learning Hub Discovery Journey

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

### 6.5 Application Tracking Journey

```
1. User applies to job
   └── Application form submitted
   └── Email confirmation sent immediately
   
2. User views "My Applications"
   └── All applications listed
   └── Status displayed for each
   
3. Status updates
   └── Email notification sent
   └── In-app notification appears
   └── Status updated in database
   
4. User clicks notification
   └── Redirected to application details
   └── Can view job posting
```

---

## 7. Content Management

### 7.1 Contentstack Products Used

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

### 7.2 Content Workflows

#### Job Publishing Workflow
1. Content editor creates job in Contentstack
2. Job published to environment
3. Webhook triggered → `/api/webhooks/new-job`
4. Webhook handler:
   - Fetches all users from NeonDB
   - Calls Contentstack Automate for each user
   - Sends email notification
5. Algolia index synced (via Marketplace app or manual sync)

#### Application Confirmation Workflow
1. User submits application
2. Application saved to NeonDB
3. API calls Contentstack Automate
4. Email confirmation sent to applicant
5. Notification created in Contentstack (optional)

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

## 8. Personalization & AI Features

### 8.1 Behavior Tracking

#### Events Tracked
- **Page Views**: Automatic via Lytics jstag
- **Job Views**: Tracked with job details (title, category, skills, location)
- **Blog Reads**: Tracked with blog details (title, category, tags)
- **Job Applications**: Tracked with job details
- **Searches**: Tracked with query and filters
- **Learning Views**: Tracked with resource details

#### Data Stored
- **localStorage**: Immediate personalization data
- **Lytics**: Analytics and audience building
- **Contentstack Personalize**: Content personalization

### 8.2 AI-Powered Recommendations

#### Skill-Based Matching
- **Algorithm**: Algolia search with skill matching
- **Scoring**: Match score based on skill overlap
- **Ranking**: Jobs sorted by match score

#### Location-Based Prioritization
- **Algorithm**: Combined skill + location scoring
- **Formula**: `(skillMatch × 60%) + (locationMatch × 40%)`
- **Benefits**: Local jobs prioritized for better fit

#### Behavior-Based Recommendations
- **Algorithm**: Based on viewed jobs, categories, skills
- **Updates**: Real-time as user browses
- **Display**: "Recommended For You" section on homepage

### 8.3 Skill Gap Analysis

#### Market Analysis
- **Data Source**: All jobs in Algolia index
- **Process**: Extract skills, count demand, calculate percentages
- **Output**: Top demanded skills with job counts

#### Gap Identification
- **Process**: Compare user skills with market demand
- **Output**: Missing skills ranked by priority
- **Priority**: Based on job count (high/medium/low)

#### Learning Recommendations
- **Matching**: Skills → Learning Resources
- **Technology Mapping**: Skill names mapped to technologies
- **Output**: Top 3 learning resources per skill gap

---

## 9. Success Metrics

### 9.1 User Engagement

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Session Duration** | > 3 min | Lytics analytics |
| **Jobs Viewed/Session** | > 5 | behavior-tracking.ts |
| **Return Rate** | > 40% | session_count > 1 |
| **Profile Completion** | > 60% | Skills saved |
| **Learning Resource Views** | > 20% of users | Learning Hub analytics |

### 9.2 Conversion

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Application Rate** | > 5% | Applications / Views |
| **Click-Through (Banner)** | > 15% | trackEdgeImpression |
| **Recommendation Clicks** | > 20% | RecommendedForYou |
| **Skill Gap → Learning** | > 30% | Learning Hub clicks from skill gap |

### 9.3 Technical Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Page Load Time** | < 2s | Lighthouse |
| **Search Response** | < 100ms | Algolia dashboard |
| **API Response** | < 500ms | Server logs |
| **Uptime** | > 99.9% | Launch monitoring |

### 9.4 Business Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **User Registrations** | Growing 20% MoM | NeonDB analytics |
| **Job Applications** | Growing 15% MoM | Applications table |
| **Email Open Rate** | > 25% | Automate analytics |
| **Notification Engagement** | > 30% | Notification clicks |

---

## 10. Future Enhancements

### 10.1 Planned Features

1. **Resume Builder**: AI-powered resume creation tool
2. **Interview Preparation**: Mock interviews and practice questions
3. **Salary Insights**: Market salary data for roles and locations
4. **Company Reviews**: Employee reviews and ratings
5. **Job Alerts**: Customizable email alerts based on criteria
6. **Mobile App**: Native iOS and Android applications
7. **Video Applications**: Record and submit video applications
8. **AI Chatbot Enhancement**: More context-aware job recommendations

### 10.2 Technical Improvements

1. **GraphQL API**: More efficient data fetching
2. **Real-time Updates**: WebSocket support for live notifications
3. **Advanced Analytics**: Custom dashboard for admins
4. **A/B Testing**: Built-in experimentation framework
5. **Multi-language Support**: Expand beyond English and Hindi

---

## 📎 Appendix

### A. Related Documentation

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
| 2.0 | Jan 2026 | Comprehensive rewrite with all features documented |

---

*This document is maintained by the JobDekho development team.*

