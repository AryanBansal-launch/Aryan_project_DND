# 🎨 Brand Kit Setup Guide for Learning Resources

This guide walks you through setting up Contentstack Brand Kit to generate AI content for the Learning Resources page.

---

## 📋 Prerequisites

1. **Contentstack Account** with Brand Kit enabled
2. **AI Assistant App** installed from Marketplace
3. **Learning Resource** content type created (see below)

---

## Step 1: Create the Content Type in Contentstack

### A. Navigate to Content Models
1. Go to your Contentstack Stack
2. Click **Content Models** → **+ New Content Type**

### B. Create "Learning Resource" Content Type

| Field Name | UID | Type | Required |
|------------|-----|------|----------|
| Title | `title` | Single-line text | Yes |
| Slug | `slug` | Single-line text | Yes |
| Description | `description` | Multi-line text | Yes |
| Technology | `technology` | Select (dropdown) | Yes |
| Difficulty Level | `difficulty_level` | Select | Yes |
| YouTube Video URL | `youtube_url` | Single-line text | Yes |
| YouTube Video ID | `youtube_video_id` | Single-line text | Yes |
| Duration | `duration` | Single-line text | No |
| Thumbnail | `thumbnail` | File | No |
| Key Takeaways | `key_takeaways` | Multi-line text (Multiple) | No |
| Skills Covered | `skills_covered` | Single-line text (Multiple) | No |
| Instructor | `instructor` | Single-line text | No |
| Featured | `featured` | Boolean | No |
| Order | `order` | Number | No |

### C. Technology Dropdown Values
```
nextjs - Next.js
react - React
nodejs - Node.js
typescript - TypeScript
microservices - Microservices
docker - Docker
kubernetes - Kubernetes
aws - AWS
python - Python
golang - Go
devops - DevOps
ai_ml - AI/ML
database - Database
security - Security
other - Other
```

### D. Difficulty Level Values
```
beginner - Beginner
intermediate - Intermediate
advanced - Advanced
```

---

## Step 2: Set Up Brand Kit

### A. Access Brand Kit
1. In Contentstack, go to **Brand Kit** in the left sidebar
2. If not visible, enable it from **Settings** → **Modules**

### B. Create Voice Profile

1. Click **Voice Profiles** → **+ Add Voice Profile**
2. Configure your brand voice:

```
Profile Name: JobPortal Learning Voice

┌─────────────────────────────────────────────────────────────┐
│ VOICE PROFILE SETTINGS                                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Formality:    ████████░░░░░░░░ (60% - Professional casual)  │
│                                                              │
│ Tone:         Encouraging, Supportive, Motivating           │
│                                                              │
│ Humor:        ██░░░░░░░░░░░░░░ (15% - Light when suitable)  │
│                                                              │
│ Complexity:   ██████████░░░░░░ (65% - Technical but clear)  │
│                                                              │
│ Audience:     Developers, Career changers, Tech learners    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

3. Add Example Content (helps AI understand your style):

**Good Example:**
> "Ready to level up your development skills? This hands-on tutorial breaks down
> Next.js fundamentals into digestible concepts. By the end, you'll confidently
> build server-rendered React applications. Perfect for developers looking to
> expand their toolkit!"

**Tone Keywords:**
- Encouraging
- Clear
- Action-oriented
- Professional yet approachable
- Career-focused

---

## Step 3: Build Knowledge Vault

### A. Upload Brand Assets

Create and upload these documents to Knowledge Vault:

#### 1. `brand-guidelines.md`
```markdown
# JobPortal Brand Guidelines

## Mission
Empower job seekers with skills and opportunities.

## Voice Principles
1. Encouraging - We believe in everyone's potential
2. Practical - Focus on real-world application
3. Clear - No unnecessary jargon
4. Career-focused - Everything ties back to job readiness

## Content Goals
- Help users understand technology concepts
- Connect learning to career opportunities
- Motivate continuous skill development
- Provide actionable takeaways

## Tone Guidelines
- Use "you" and "your" to address learners directly
- Start with benefits, not features
- Include specific outcomes
- End with a call to action
```

#### 2. `content-templates.md`
```markdown
# Learning Resource Templates

## Description Template
Structure:
1. Hook - What will they achieve?
2. Content - What does the tutorial cover?
3. Outcome - What will they be able to do?
4. Fit - Who is this for?

Example:
"Master [TECHNOLOGY] with this comprehensive tutorial. 
You'll learn [KEY CONCEPTS] through practical examples. 
By the end, you'll be able to [OUTCOME]. 
Perfect for [TARGET AUDIENCE]."

## Key Takeaways Template
- Start with action verb
- Be specific and measurable
- Focus on practical application

Examples:
- "Build a full-stack application using Next.js App Router"
- "Implement authentication with NextAuth.js"
- "Deploy to production with Vercel"
```

#### 3. `tech-context.md`
```markdown
# Technology Context for AI

## Next.js
- React framework for production
- Key features: SSR, SSG, App Router, API Routes
- Use cases: Full-stack web apps, e-commerce, blogs
- Jobs: Frontend Developer, Full-Stack Developer

## Microservices
- Architectural style for distributed systems
- Key concepts: Service mesh, API gateway, containers
- Use cases: Large-scale applications, cloud-native
- Jobs: Backend Developer, DevOps Engineer, Architect

## Docker
- Containerization platform
- Key concepts: Images, containers, Docker Compose
- Use cases: Development environments, deployment
- Jobs: DevOps Engineer, Platform Engineer

[Add more technologies as needed]
```

### B. Upload Documents
1. Go to **Knowledge Vault** → **+ Add Knowledge**
2. Upload each document
3. Tag them appropriately:
   - `brand-guidelines.md` → Tags: brand, voice, style
   - `content-templates.md` → Tags: templates, structure
   - `tech-context.md` → Tags: technology, skills, jobs

---

## Step 4: Install AI Assistant App

### A. From Marketplace
1. Go to **Marketplace** → Search "AI Assistant"
2. Click **Install**
3. Configure with your Brand Kit:
   - Enable "Use Brand Kit"
   - Select your Voice Profile
   - Enable Knowledge Vault access

### B. Configure Permissions
1. Go to **Settings** → **Users & Permissions**
2. Ensure content editors have AI Assistant access

---

## Step 5: Generate Content with Brand Kit

### A. Creating a New Learning Resource

1. **Navigate** to Content → Learning Resource → + New Entry

2. **Fill Basic Fields:**
   - Title: "Next.js 14 App Router Complete Guide"
   - Slug: "nextjs-14-app-router-guide"
   - Technology: Next.js
   - Difficulty: Intermediate
   - YouTube URL: [paste URL]
   - YouTube Video ID: [extract from URL]

3. **Use AI Assistant for Description:**
   
   Click the AI Assistant icon (✨) next to the Description field:
   
   ```
   Prompt: "Write a compelling description for a Next.js 14 App Router 
   tutorial. The video covers routing, server components, and data fetching. 
   Target audience is React developers moving to Next.js."
   ```
   
   The AI will generate content using your Voice Profile and Knowledge Vault!

4. **Generate Key Takeaways:**
   
   ```
   Prompt: "Generate 5 key takeaways for a Next.js App Router tutorial 
   covering routing, server components, layouts, and data fetching."
   ```
   
   Example Output:
   - Understand the file-based routing system in Next.js 14
   - Build reusable layouts and templates
   - Implement Server Components for better performance
   - Master data fetching with async/await in Server Components
   - Deploy your Next.js application to production

5. **Skills Covered:**
   - Next.js
   - React
   - Server Components
   - App Router
   - Data Fetching

---

## Step 6: Batch Content Generation Tips

### A. Prepare YouTube Video List
Create a spreadsheet with:
| Video Title | URL | Technology | Difficulty |
|-------------|-----|------------|------------|
| Next.js 14 Crash Course | youtube.com/... | nextjs | beginner |
| Microservices with Node.js | youtube.com/... | microservices | intermediate |

### B. AI Prompts for Each Content Type

**Description Prompt Template:**
```
Write a description for a [TECHNOLOGY] tutorial at the [LEVEL] level.
The video covers: [TOPICS].
Target audience: [AUDIENCE].
Format: 2-3 sentences, action-oriented, emphasize practical outcomes.
```

**Key Takeaways Prompt Template:**
```
Generate [NUMBER] key takeaways for a [TECHNOLOGY] tutorial.
Topics covered: [TOPICS].
Format: Start with action verbs, be specific, focus on skills.
```

**Skills Extraction Prompt:**
```
Extract relevant technical skills from this tutorial description:
[DESCRIPTION]
Return as comma-separated list.
```

---

## Step 7: Quality Checklist

Before publishing each learning resource:

- [ ] Description is 2-3 sentences, compelling
- [ ] YouTube video ID is correct (test embed)
- [ ] Key takeaways are actionable and specific
- [ ] Skills match the technology covered
- [ ] Difficulty level is accurate
- [ ] Thumbnail loads correctly

---

## 🎯 Example: Complete Entry

```yaml
Title: "Building Modern APIs with Next.js Route Handlers"
Slug: "nextjs-route-handlers-api"
Description: |
  Take your backend development skills to the next level with Next.js Route 
  Handlers. This hands-on tutorial shows you how to build robust REST APIs 
  without leaving your Next.js project. You'll learn request handling, 
  authentication middleware, and database integration—essential skills for 
  any full-stack developer.
Technology: nextjs
Difficulty: intermediate
YouTube URL: https://youtube.com/watch?v=abc123
YouTube Video ID: abc123
Duration: 45:30
Key Takeaways:
  - Create RESTful endpoints using Next.js Route Handlers
  - Implement request validation and error handling
  - Add authentication middleware to protect routes
  - Connect to databases using Prisma or raw SQL
  - Deploy your API with serverless functions
Skills Covered:
  - Next.js
  - REST APIs
  - Authentication
  - Database Integration
  - Prisma
Instructor: "Tech Tutorial Channel"
Featured: true
Order: 1
```

---

## 📚 Resources

- [Contentstack Brand Kit Documentation](https://www.contentstack.com/docs/content-managers/brand-kit)
- [AI Assistant App Guide](https://www.contentstack.com/docs/marketplace-apps/ai-assistant)
- [Voice Profile Best Practices](https://www.contentstack.com/academy/courses/brand-kit-foundations)

---

## 🔄 Workflow Summary

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CONTENT CREATION WORKFLOW                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. PREPARE                    2. CREATE                                │
│  ┌─────────────────┐           ┌─────────────────┐                      │
│  │ Find YouTube    │──────────▶│ New Learning    │                      │
│  │ tutorials       │           │ Resource entry  │                      │
│  └─────────────────┘           └────────┬────────┘                      │
│                                         │                                │
│  3. GENERATE (AI Assistant + Brand Kit) │                                │
│  ┌──────────────────────────────────────┴─────────────────────┐         │
│  │                                                             │         │
│  │  ┌─────────┐    ┌─────────────┐    ┌────────────────┐     │         │
│  │  │ Voice   │    │ Knowledge   │    │ AI Assistant   │     │         │
│  │  │ Profile │───▶│ Vault       │───▶│ generates      │     │         │
│  │  │         │    │             │    │ content        │     │         │
│  │  └─────────┘    └─────────────┘    └────────────────┘     │         │
│  │                                                             │         │
│  └─────────────────────────────────────────────────────────────┘         │
│                                         │                                │
│  4. REVIEW & PUBLISH                    ▼                                │
│  ┌─────────────────┐           ┌─────────────────┐                      │
│  │ Quality check   │◀──────────│ AI-generated    │                      │
│  │ & publish       │           │ content         │                      │
│  └─────────────────┘           └─────────────────┘                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Need Help?

If the AI output doesn't match your brand voice:
1. Review and update your Voice Profile settings
2. Add more example content to Knowledge Vault
3. Be more specific in your prompts
4. Provide context about the target audience

Happy content creating! 🚀

