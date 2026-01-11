# JobPortal - Full-Featured Job Portal

A comprehensive job portal built with Next.js 15, TypeScript, and Tailwind CSS. This application provides a complete solution for job seekers and employers to connect and manage job opportunities.

## 🚀 Features

### For Job Seekers
- **Job Search & Discovery**: Advanced search with filters for location, job type, experience level, and more
- **Job Details**: Comprehensive job descriptions with company information
- **Application Management**: Track application status and manage submissions
- **User Profiles**: Create and manage professional profiles with skills, experience, and education
- **Application Tracking**: Real-time status updates and interview scheduling

### For Employers
- **Company Profiles**: Showcase company culture, benefits, and job opportunities
- **Job Posting**: Create and manage job listings
- **Application Review**: Review and manage incoming applications
- **Admin Dashboard**: Comprehensive management interface for all platform activities

### General Features
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, professional interface with smooth animations
- **Authentication**: Secure login and registration system
- **Search & Filters**: Advanced filtering and search capabilities
- **Real-time Updates**: Live status updates and notifications

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **CMS**: Contentstack (Headless CMS)
- **Search**: Algolia
- **Database**: NeonDB (PostgreSQL)
- **Authentication**: NextAuth.js
- **Hosting**: Contentstack Launch
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Date Handling**: date-fns

---

## 📦 Contentstack Features Used

This project leverages multiple Contentstack products and features for a complete headless CMS experience.

### 1. Content Delivery SDK (`@contentstack/delivery-sdk`)

| Feature | Description | Files |
|---------|-------------|-------|
| **Content Fetching** | Fetch jobs, companies, blogs, homepage, navigation | `lib/contentstack.ts` |
| **Query Operations** | Filter content by URL, UID, slug | `getPage()`, `getJobByUid()`, `getBlogBySlug()` |
| **Reference Resolution** | Fetch linked company data for jobs | `getJobs()`, `getJobByUid()` |
| **Multi-locale Support** | Fetch content in English (en-us) and Hindi (hi-in) | `getBlogs(locale)`, `getBlogByUid(uid, locale)` |


### 2. Management API

| Feature | Description | Files |
|---------|-------------|-------|
| **Create Entries** | Create notification entries programmatically | `lib/contentstack-notifications.ts` |
| **Update Entries** | Mark notifications as read | `markNotificationAsReadInContentstack()` |
| **Delete Entries** | Remove notifications | `deleteNotificationFromContentstack()` |
| **Publish Entries** | Auto-publish after create/update | `createNotificationInContentstack()` |

### 3. Personalize Edge SDK (`@contentstack/personalize-edge-sdk`)

| Feature | Description | Files |
|---------|-------------|-------|
| **User Attributes** | Track time_on_site, has_clicked_apply_now, first_time_user | `lib/contentstack-personalize.ts` |
| **Audiences** | Match users to segments (e.g., "users_not_applied_30s", "First_time_users") | Personalize Dashboard |
| **Experiences** | Deliver personalized banner content based on user behavior | `components/PersonalizedBanner.tsx` |
| **Event Tracking** | Track banner impressions and CTA clicks | `trackPersonalizeEvent()` |
| **Variant Content** | Fetch personalized content for matched audiences | `getPersonalizedContent()` |

### 4. Data & Insights (Lytics) Integration

This project integrates Contentstack's Data & Insights (Lytics) for real-time behavior tracking and personalized experiences.

| Feature | Description | Files |
|---------|-------------|-------|
| **Lytics Tracking Tag** | Captures page views and custom events | `app/layout.tsx` |
| **Behavior Tracking** | Tracks job views, blog reads, applications, interests | `lib/behavior-tracking.ts` |
| **Session Management** | Tracks returning users and session counts | `components/BehaviorTracker.tsx` |
| **Interest Profiling** | Builds user interest profiles (categories, skills, locations) | `lib/behavior-tracking.ts` |
| **Personalized Recommendations** | Shows "Recommended For You" jobs based on behavior | `components/RecommendedForYou.tsx` |

#### Behavior Events Tracked

| Event | Data Captured | Use Case |
|-------|---------------|----------|
| `job_view` | Job UID, title, category, skills, location, company | Build job interest profile |
| `blog_read` | Blog UID, title, category, tags | Understand content preferences |
| `job_application` | Job UID, title, company | Track conversion |
| `search` | Query, location, category filters | Understand search intent |
| `session_start` | Session count, returning user status | Segment new vs returning users |

#### Lytics → Personalize Flow

```
User Behavior (Job Views, Blog Reads)
         ↓
    Lytics Tracking (jstag.send)
         ↓
    User Profile Built (localStorage + Lytics)
         ↓
    Personalize Attributes Updated
         ↓
    Audience Matching (Contentstack Personalize)
         ↓
    Personalized Content Delivered
```

### 5. Webhooks

| Webhook | Trigger | Action |
|---------|---------|--------|
| **New Job Notification** | Job entry published | Sends email to all registered users |


### 6. Automate

| Automation | Trigger | Action |
|------------|---------|--------|
| **Application Confirmation Email** | HTTP Request from `/api/applications/submit` | Sends confirmation email to applicant |
| **New Job Alert Email** | HTTP Request from `/api/webhooks/new-job` | Sends job alert to all users |
| **Algolia Index Sync** | Job entry publish event | Updates Algolia search index |
| **Chatbot Context Feed** | Webhook trigger | Feeds content context to AI chatbot |

### 7. Marketplace Apps

| App | Purpose |
|-----|---------|
| **Algolia** | Search integration - syncs content types to Algolia for fast search |
| **AI Chatbot** | Chatbot fed with content context via Marketplace app and Automate webhook |

### 8. Launch (Hosting + Geolocation)

| Feature | Description | Implementation |
|---------|-------------|----------------|
| **Production Hosting** | Deploy Next.js app | Automatic builds on push |
| **Edge Functions** | Run code at the edge | `functions/[proxy].edge.js` |
| **Geolocation Headers** | Automatic visitor location | `visitor-ip-country`, `visitor-ip-region`, `visitor-ip-city` |
| **Location-Based Recommendations** | Prioritize local jobs | `/api/jobs/recommendations` |

#### Edge Function Endpoints

| Endpoint | Description |
|----------|-------------|
| `/edge` | Returns top paths from Google Analytics for prefetching |
| `/edge/geo` | Returns visitor's geolocation (country, region, city) |

### 9. Content Types

| Content Type | Purpose | Fields |
|--------------|---------|--------|
| **Job** | Job listings | title, description, requirements, responsibilities, company (ref), location, type, salary, skills, category, status |
| **Company** | Company profiles | title, description, location, industry, size, logo, benefits |
| **Blog Post** | Blog articles | title, slug, content, author, featured_image, category, tags |
| **Homepage** | Homepage content | hero_title, hero_subtitle, featured_jobs, stats |
| **Navigation** | Site navigation | nav_items (links array) |
| **Notification** | User notifications | user_email, type, title, message, read, metadata |
| **Personalized Banner** | Behavior-based banners | banner_title, banner_message, cta_text, cta_link, user_segment, enabled, priority |


## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage with hero section and featured jobs
│   ├── jobs/              # Job-related pages
│   │   ├── page.tsx       # Job listings with search and filters
│   │   └── [id]/page.tsx  # Individual job details and application form
│   ├── companies/         # Company pages
│   │   └── page.tsx       # Company listings and profiles
│   ├── applications/      # Application management
│   │   └── page.tsx       # User's application tracking
│   ├── profile/          # User profile management
│   │   └── page.tsx       # User profile editing
│   ├── login/            # Authentication
│   │   └── page.tsx       # Login page
│   ├── register/         # User registration
│   │   └── page.tsx       # Registration page
│   ├── admin/            # Admin dashboard
│   │   └── page.tsx       # Admin management interface
│   ├── layout.tsx        # Root layout with navigation
│   └── globals.css       # Global styles and utilities
├── components/           # Reusable React components
│   └── Navigation.tsx     # Main navigation component
├── lib/                  # Utility functions and types
│   ├── types.ts          # TypeScript type definitions
│   ├── utils.ts          # Utility functions
│   └── contentstack.ts   # CMS integration (legacy)
└── package.json          # Dependencies and scripts
```

## 🎨 Design Features

- **Modern UI**: Clean, professional design with consistent spacing and typography
- **Responsive Layout**: Mobile-first approach with breakpoints for all screen sizes
- **Interactive Elements**: Hover effects, smooth transitions, and loading states
- **Accessibility**: Proper ARIA labels, keyboard navigation, and screen reader support
- **Color Scheme**: Professional blue and gray color palette
- **Typography**: Inter font family for excellent readability

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Aryan_project_DND
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🐳 Docker Support

You can run the entire application using Docker and Docker Compose. This will set up both the Next.js application and a local PostgreSQL database.

### Prerequisites
- Docker and Docker Compose installed

### Getting Started with Docker

1. **Configure Environment Variables**
   Ensure your `.env.local` (or `.env`) file is populated with the required keys (Contentstack, Algolia, etc.). Docker Compose will pass these to the application.

2. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the Application**
   The application will be available at [http://localhost:3000](http://localhost:3000).
   The local PostgreSQL database will be initialized with the schema from `scripts/init-db.sql`.

### Docker Architecture
- **app**: Next.js 15 application running in a multi-stage production build.
- **db**: PostgreSQL 15 database for local user data and skills.

## 📱 Pages Overview

### Homepage (`/`)
- Hero section with job search
- Featured job listings
- Company showcase
- Statistics and call-to-action sections

### Jobs (`/jobs`)
- Advanced job search with filters
- Job listings with pagination
- Sort by relevance, date, or salary
- Quick apply functionality

### Job Details (`/jobs/[id]`)
- Comprehensive job information
- Company details and culture
- Application form with file upload
- Related jobs suggestions

### Companies (`/companies`)
- Company directory with search
- Company profiles and job listings
- Industry and size filters
- Company culture and benefits

### Applications (`/applications`)
- Application status tracking
- Interview scheduling
- Application history
- Status updates and notifications

### Profile (`/profile`)
- User profile management
- Skills and experience editing
- Education and work history
- Job preferences and settings
- **AI-Powered Job Recommendations** based on user skills

## 🎯 Job Recommendations (Algolia + Geolocation)

The application uses **Algolia Search** combined with **Launch Geolocation Headers** to provide personalized job recommendations based on user skills AND location.

### How It Works

1. User adds skills to their profile
2. Skills are saved to NeonDB
3. When user clicks "Find Matching Jobs", skills are sent to Algolia
4. **Launch automatically injects visitor geolocation** (country, region, city)
5. Jobs are scored by both skill match AND location proximity
6. Results are re-ranked to prioritize local jobs

### Features

- ✅ Fuzzy matching (handles typos)
- ✅ OR logic (matches jobs with ANY skill)
- ✅ Match score ranking
- ✅ Highlights matching skills
- ✅ **Location-based prioritization** (city > region > country)
- ✅ **Automatic geolocation** via Launch headers
- ✅ **Remote job boosting** for all visitors

### Launch Geolocation Headers

When deployed on Contentstack Launch, these headers are automatically injected:

| Header | Description | Example |
|--------|-------------|---------|
| `visitor-ip-country` | ISO 2-letter country code | `US`, `IN`, `GB` |
| `visitor-ip-region` | Region/state name | `California`, `Karnataka` |
| `visitor-ip-city` | City name | `San Francisco`, `Bangalore` |

### Scoring Algorithm

Jobs are ranked using a combined score:
- **Skill Match (60%)**: How well the job matches user's skills
- **Location Match (40%)**: How close the job is to the visitor
  - City match: 1.0
  - Region match: 0.8
  - Country match: 0.6
  - Remote jobs: 0.3 (base boost)

### Setup

1. Create an Algolia account at [algolia.com](https://www.algolia.com/)
2. Create an index named `job`
3. Configure searchable attributes: `title`, `description`, `skillNames`, `skillsText`, `category`
4. Sync jobs using `/api/jobs/sync-algolia` endpoint
5. Add environment variables:

```env
NEXT_PUBLIC_ALGOLIA_APP_ID=your-app-id
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your-search-key
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=job
```

### Authentication (`/login`, `/register`)
- Secure login and registration
- Social login options
- Password strength validation
- Terms and conditions

### Admin Dashboard (`/admin`)
- Job management interface
- Application review system
- Company management
- User administration
- Analytics and reporting
- **Protected by Edge Function** - Requires username/password authentication

## 🔐 Admin Panel Protection

The `/admin` route is protected using a **Next.js Edge Function** (middleware) with Basic HTTP Authentication.

### How It Works

When accessing `/admin`:
1. Edge function intercepts the request
2. Checks for Basic Auth credentials
3. Shows browser login prompt if not authenticated
4. Grants access only with valid credentials

### Configuration

Set these environment variables:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
```

### Security Features

- ✅ Runs at the edge (fast, before page loads)
- ✅ Browser-native login prompt
- ✅ No credentials stored in frontend
- ✅ Works with Contentstack Launch

## 🔧 Customization

### Styling
The application uses Tailwind CSS for styling. Custom styles are defined in `app/globals.css`:

- Custom utility classes
- Animation keyframes
- Gradient backgrounds
- Hover effects
- Responsive breakpoints

### Components
Reusable components are located in the `components/` directory:

- `Navigation.tsx` - Main navigation with responsive mobile menu
- Additional components can be added as needed

### Types
TypeScript types are defined in `lib/types.ts`:

- Job, Company, User, Application interfaces
- Search filters and result types
- Form data types
- API response types

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Connect your repository to Vercel
2. Configure environment variables if needed
3. Deploy automatically on push to main branch

### Environment Variables
Create a `.env.local` file for local development:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database Configuration (NeonDB PostgreSQL)
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require

# Algolia Search Configuration
NEXT_PUBLIC_ALGOLIA_APP_ID=your-algolia-app-id
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your-search-only-api-key
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=job

# Admin Panel Protection
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-admin-password

# Contentstack Automate - Email Notifications
CONTENTSTACK_AUTOMATE_WEBHOOK_URL=https://app.contentstack.com/automations-api/run/your-application-webhook
CONTENTSTACK_NEW_JOB_EMAIL_WEBHOOK=https://app.contentstack.com/automations-api/run/your-new-job-webhook
CONTENTSTACK_WEBHOOK_SECRET=your-webhook-secret

# Contentstack AI Chatbot Widget (optional)
NEXT_PUBLIC_CHATBOT_WIDGET_URL=https://chatbot-marketplace-try.contentstackapps.com/chatbot-widget.js?site_key=your-site-key
```

## 📧 Email Notifications

The application includes automated email notifications powered by **Contentstack Automate**.

### Features

| Email Type | Trigger | Recipients |
|------------|---------|------------|
| **Application Confirmation** | User submits job application | Applicant |
| **New Job Alert** | Admin publishes new job in CMS | All registered users |

### Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐     ┌──────────────┐
│  New Job        │────▶│  Contentstack    │────▶│  Our API        │────▶│  Automate    │
│  Published      │     │  Webhook         │     │  /api/webhooks  │     │  Email       │
│  in CMS         │     │                  │     │  /new-job       │     │              │
└─────────────────┘     └──────────────────┘     └─────────────────┘     └──────────────┘
                                                        │
                                                        ▼
                                                 ┌─────────────────┐
                                                 │  NeonDB         │
                                                 │  (Get all users)│
                                                 └─────────────────┘
```

### Setup: New Job Email Notifications

#### Step 1: Create Contentstack Automate Workflow

1. Go to **Contentstack → Automate → Create New Automation**
2. Add **HTTP Request Trigger** (Step 1)
3. Add **Email By Automate** action (Step 2)
4. Configure the email:

**To:** `{{1.body.recipient_email}}`

**Subject:** `🚀 New Job Alert: {{1.body.job_title}}`

**Body Type:** `HTML`

**Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
    .job-card { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .cta-button { display: inline-block; background: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔔 New Job Posted!</h1>
  </div>
  <div class="content">
    <p>Hi {{1.body.recipient_name}},</p>
    <div class="job-card">
      <h2>{{1.body.job_title}}</h2>
      <p>📍 {{1.body.job_location}} | 💼 {{1.body.job_type}} | 💰 {{1.body.job_salary}}</p>
      <a href="{{1.body.job_url}}" class="cta-button">View Job →</a>
    </div>
  </div>
</body>
</html>
```

5. **Activate the Automation**
6. Copy the HTTP Request Trigger URL to `CONTENTSTACK_NEW_JOB_EMAIL_WEBHOOK`

#### Step 2: Create Contentstack Webhook

1. Go to **Contentstack → Settings → Webhooks**
2. Create new webhook:
   - **Name:** `New Job Notification`
   - **URL:** `https://your-domain.com/api/webhooks/new-job`
   - **Events:** Entry → Publish → Job content type
   - **Headers:** Add `x-webhook-secret: your-secret`

#### Step 3: Test with Postman

```bash
curl -X POST "https://app.contentstack.com/automations-api/run/YOUR_WEBHOOK_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient_email": "test@example.com",
    "recipient_name": "Test User",
    "job_title": "Software Developer",
    "job_location": "San Francisco, CA",
    "job_type": "Full-time",
    "job_experience": "Mid-Senior",
    "job_salary": "$120,000 - $150,000",
    "is_remote": "Yes",
    "job_url": "https://yoursite.com/jobs/123",
    "notification_date": "December 6, 2024"
  }'
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/webhooks/new-job` | POST | Receives Contentstack webhook when job is published |
| `/api/applications/submit` | POST | Submits job application and sends confirmation email |
| `/api/jobs/recommendations` | POST | Get job recommendations with location prioritization |
| `/edge/geo` | GET | Returns visitor geolocation (Launch edge function) |

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client IDs
5. Set authorized redirect URIs to:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
6. Copy the Client ID and Client Secret to your `.env.local` file

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icon set
- The open-source community for inspiration and tools

---

**JobPortal** - Connecting talent with opportunity, one job at a time.