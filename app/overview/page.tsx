import { Metadata } from "next";
import Link from "next/link";
import {
  Search,
  MapPin,
  Sparkles,
  Bell,
  BookOpen,
  Target,
  User,
  Building2,
  FileText,
  Globe,
  Zap,
  Shield,
  Brain,
  TrendingUp,
  Mail,
  Eye,
  Layers,
  Code,
  Database,
  Cloud,
  ArrowRight,
  CheckCircle2,
  Play,
  Briefcase,
  Bot,
  Webhook,
  Settings,
  BarChart3,
  Languages,
  Smartphone,
  Lock,
  Server,
  Cpu,
  GitBranch,
  RefreshCw,
  MessageSquare,
  Users,
  Activity,
  Terminal,
  Workflow,
  Monitor,
  PanelLeftClose,
  type LucideIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Overview | JobPortal - AI-Powered Job Discovery",
  description:
    "Complete platform overview including features, PRD, TRD, tech stack, and documentation for JobPortal - the AI-powered job discovery platform.",
};

// Types
interface Feature {
  name: string;
  description: string;
  howToUse: string;
  icon: LucideIcon;
}

interface FeatureCategory {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  features: Feature[];
}

// Feature categories with their features
const featureCategories: FeatureCategory[] = [
  {
    id: "search",
    title: "Job Discovery & Search",
    description: "Find your perfect job with intelligent search capabilities powered by Algolia",
    icon: Search,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    features: [
      {
        name: "Full-Text Search",
        description: "Search jobs by title, skills, or description with instant results powered by Algolia's lightning-fast search engine",
        howToUse: "Use the search bar on the Jobs page to find relevant positions instantly",
        icon: Search,
      },
      {
        name: "Fuzzy Matching & Typo Tolerance",
        description: "Handles typos and misspellings automatically - search for 'Javscript' and still find JavaScript jobs",
        howToUse: "Just type naturally - we'll understand what you mean even with typos",
        icon: Zap,
      },
      {
        name: "Advanced Filters",
        description: "Filter by location, job type (full-time, contract, remote), experience level, salary range, and category",
        howToUse: "Click 'Filters' on the Jobs page to narrow down results to exactly what you want",
        icon: Layers,
      },
      {
        name: "Location-Based Results",
        description: "Uses Launch's geolocation headers to automatically detect your country/region/city and prioritize local jobs",
        howToUse: "Jobs near you are automatically boosted to the top - no configuration needed",
        icon: MapPin,
      },
      {
        name: "Skill-Based Recommendations",
        description: "Get personalized job recommendations based on skills in your profile using Algolia's powerful matching",
        howToUse: "Add skills to your profile and click 'Find Matching Jobs' to see personalized results",
        icon: Target,
      },
    ],
  },
  {
    id: "personalization",
    title: "Personalization Engine",
    description: "AI-powered personalization using Contentstack Personalize and Lytics behavior tracking",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    features: [
      {
        name: "Behavior Tracking (Lytics)",
        description: "Tracks job views, blog reads, searches, and applications to build your interest profile in real-time",
        howToUse: "Browse jobs and blogs naturally - the system learns your preferences automatically",
        icon: Eye,
      },
      {
        name: "User Segmentation",
        description: "Automatically segments users into audiences: first-time visitors, returning users, tech job seekers, ready-to-apply users",
        howToUse: "Your segment is determined automatically based on your behavior patterns",
        icon: Users,
      },
      {
        name: "Personalized Banners",
        description: "Dynamic banners powered by Contentstack Personalize Edge SDK that change based on your user segment",
        howToUse: "Look for contextual banners on the homepage that match your interests and behavior",
        icon: Sparkles,
      },
      {
        name: "Recommended For You Section",
        description: "Homepage section showing jobs tailored to your browsing history, viewed categories, and skill interests",
        howToUse: "Check the 'Recommended For You' section after viewing a few jobs",
        icon: Brain,
      },
      {
        name: "Experience Variants",
        description: "5+ personalization experiences: Welcome banners, Tech Job Seekers, Nudge to Apply, Welcome Back, and more",
        howToUse: "Different experiences trigger based on session count, job views, and application status",
        icon: Activity,
      },
    ],
  },
  {
    id: "chatbot",
    title: "AI Chatbot Assistant",
    description: "Intelligent chatbot powered by Contentstack Marketplace integration",
    icon: Bot,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    features: [
      {
        name: "Context-Aware Responses",
        description: "AI chatbot fed with job listings, company info, and platform content via Contentstack Automate webhooks",
        howToUse: "Click the chat icon to ask questions about jobs, companies, or how to use the platform",
        icon: MessageSquare,
      },
      {
        name: "Job Search Assistance",
        description: "Ask the bot to help find jobs matching specific skills, locations, or requirements",
        howToUse: "Try asking 'Find me React jobs in San Francisco' or 'What companies are hiring for Python?'",
        icon: Search,
      },
      {
        name: "Platform Guidance",
        description: "Get help navigating the platform, understanding features, or troubleshooting issues",
        howToUse: "Ask 'How do I apply for a job?' or 'How do I update my skills?'",
        icon: BookOpen,
      },
      {
        name: "Real-Time Content Sync",
        description: "Chatbot context is automatically updated when new jobs or content is published via Automate webhooks",
        howToUse: "The bot always has the latest information about jobs and companies",
        icon: RefreshCw,
      },
    ],
  },
  {
    id: "skillgap",
    title: "Skill Gap Analysis",
    description: "AI-powered analysis comparing your skills against job market demand",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    features: [
      {
        name: "Job Market Analysis",
        description: "Analyzes all job listings via Algolia to identify the most in-demand skills across the market",
        howToUse: "Visit your Profile page to see comprehensive skill demand analysis",
        icon: BarChart3,
      },
      {
        name: "Match Percentage Calculator",
        description: "Calculates how well your skills match current job market demand with a percentage score",
        howToUse: "Your match percentage is prominently displayed on your profile page",
        icon: Target,
      },
      {
        name: "Gap Identification",
        description: "Identifies skills you're missing that are high in demand - prioritized by job count impact",
        howToUse: "Check 'Skills to Learn' section to see which skills would open the most opportunities",
        icon: Search,
      },
      {
        name: "Learning Recommendations",
        description: "Automatically suggests relevant learning resources from the Learning Hub for each skill gap",
        howToUse: "Click on any skill gap to see curated tutorials and courses to learn that skill",
        icon: BookOpen,
      },
      {
        name: "Skill Gap Banner",
        description: "Site-wide awareness banner showing your current skill gap status and recommended next steps",
        howToUse: "Look for the skill gap banner when logged in for quick insights",
        icon: Sparkles,
      },
    ],
  },
  {
    id: "learning",
    title: "Learning Hub",
    description: "Curated video tutorials integrated with YouTube and managed via Contentstack",
    icon: BookOpen,
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    features: [
      {
        name: "Video Tutorials",
        description: "Curated YouTube tutorials for in-demand technologies like React, Node.js, Python, TypeScript, and more",
        howToUse: "Navigate to the Learning Hub (/learnings) to browse all available tutorials",
        icon: Play,
      },
      {
        name: "Technology Filtering",
        description: "Filter tutorials by technology stack - React, Node.js, Python, Java, AWS, and more",
        howToUse: "Use the technology filter dropdown to find tutorials for specific technologies",
        icon: Code,
      },
      {
        name: "Difficulty Levels",
        description: "Tutorials categorized as Beginner, Intermediate, or Advanced to match your current skill level",
        howToUse: "Filter by difficulty level to find content appropriate for your experience",
        icon: Layers,
      },
      {
        name: "Skills Covered Tags",
        description: "Each tutorial shows which specific skills it teaches so you know what you'll learn",
        howToUse: "Check the skill tags on each tutorial card before starting",
        icon: CheckCircle2,
      },
      {
        name: "Related Resources",
        description: "Smart recommendations showing related tutorials based on the same technology or skill set",
        howToUse: "Scroll down on any tutorial detail page to see related learning resources",
        icon: GitBranch,
      },
    ],
  },
  {
    id: "notifications",
    title: "Notifications & Alerts",
    description: "Real-time notifications powered by Contentstack Automate and Webhooks",
    icon: Bell,
    color: "from-red-500 to-rose-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    features: [
      {
        name: "New Job Email Alerts",
        description: "Automatic email notifications when new jobs are published, triggered by Contentstack webhooks",
        howToUse: "Create an account to automatically receive email alerts when new jobs are posted",
        icon: Mail,
      },
      {
        name: "In-App Notification Bell",
        description: "Real-time notification dropdown in the navigation bar powered by Contentstack Management API",
        howToUse: "Click the bell icon in the navbar to see your notifications",
        icon: Bell,
      },
      {
        name: "Application Confirmation",
        description: "Instant email confirmation when you submit a job application via Contentstack Automate",
        howToUse: "Apply to any job and you'll receive a confirmation email immediately",
        icon: CheckCircle2,
      },
      {
        name: "Application Status Updates",
        description: "Email notifications when your application status changes (reviewed, shortlisted, interview, etc.)",
        howToUse: "Keep an eye on your inbox after applying - status updates come via email",
        icon: Activity,
      },
    ],
  },
  {
    id: "auth",
    title: "Authentication & User Management",
    description: "Secure authentication with NextAuth.js and user data stored in NeonDB",
    icon: Shield,
    color: "from-indigo-500 to-violet-500",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    features: [
      {
        name: "Email/Password Authentication",
        description: "Traditional registration with secure password hashing using bcrypt and session management",
        howToUse: "Click 'Sign Up' and enter your email and a strong password to create an account",
        icon: Lock,
      },
      {
        name: "Google OAuth",
        description: "One-click sign in with your Google account - no password required",
        howToUse: "Click 'Sign in with Google' for instant authentication",
        icon: User,
      },
      {
        name: "Profile Management",
        description: "Update your skills, experience level, and preferences - all stored securely in NeonDB",
        howToUse: "Visit your Profile page to update your information anytime",
        icon: Settings,
      },
      {
        name: "Skill Persistence",
        description: "Skills you add are saved to your account and loaded automatically on every login",
        howToUse: "Add skills once - they're saved forever and sync across devices",
        icon: Database,
      },
      {
        name: "Application Tracking",
        description: "Track all your job applications, their status, and interview schedules in one place",
        howToUse: "Go to 'My Applications' to see the status of all your applications",
        icon: FileText,
      },
    ],
  },
  {
    id: "content",
    title: "Content Management (Contentstack)",
    description: "Headless CMS powering all content with multi-locale support",
    icon: Layers,
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    features: [
      {
        name: "Headless CMS Architecture",
        description: "All content (jobs, companies, blogs, homepage) managed in Contentstack with full API access",
        howToUse: "Content editors can update any content in Contentstack dashboard without code changes",
        icon: Cloud,
      },
      {
        name: "Multi-Locale Support",
        description: "Content available in multiple languages - English (en-us) and Hindi (hi-in) supported",
        howToUse: "Use the language switcher on the Blogs page to switch between English and Hindi",
        icon: Languages,
      },
      {
        name: "Reference Resolution",
        description: "Jobs automatically link to Company entries with full data resolution on fetch",
        howToUse: "Click any company name on a job listing to see the full company profile",
        icon: GitBranch,
      },
      {
        name: "7 Content Types",
        description: "Job, Company, Blog Post, Homepage, Navigation, Notification, Personalized Banner, Learning Resource",
        howToUse: "Each content type has its own schema and can be managed independently",
        icon: Database,
      },
    ],
  },
  {
    id: "automation",
    title: "Automation & Webhooks",
    description: "Automated workflows powered by Contentstack Automate and Webhooks",
    icon: Workflow,
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    features: [
      {
        name: "New Job Webhook",
        description: "When a job is published in Contentstack, a webhook triggers email notifications to all registered users",
        howToUse: "Automatic - emails are sent to all users when content editors publish new jobs",
        icon: Webhook,
      },
      {
        name: "Application Email Automation",
        description: "Contentstack Automate sends beautifully formatted confirmation emails when users apply for jobs",
        howToUse: "Apply to any job and the automation handles the rest",
        icon: Mail,
      },
      {
        name: "Algolia Index Sync",
        description: "Jobs are automatically synced to Algolia search index when published or updated in Contentstack",
        howToUse: "Search results are always up-to-date with the latest job listings",
        icon: RefreshCw,
      },
      {
        name: "Chatbot Context Feed",
        description: "Automate webhook feeds new content to the AI chatbot so it always has current information",
        howToUse: "The chatbot automatically knows about new jobs and content",
        icon: Bot,
      },
    ],
  },
  {
    id: "edge",
    title: "Edge Functions & Hosting",
    description: "Edge-first architecture with Contentstack Launch for fast, global delivery",
    icon: Globe,
    color: "from-slate-500 to-gray-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    features: [
      {
        name: "Contentstack Launch Hosting",
        description: "Production hosting with automatic builds on git push, global CDN, and SSL certificates",
        howToUse: "The site is automatically deployed when code is pushed to the repository",
        icon: Cloud,
      },
      {
        name: "Geolocation Headers",
        description: "Launch injects visitor-ip-country, visitor-ip-region, visitor-ip-city headers for location-aware features",
        howToUse: "Your location is automatically detected for personalized job recommendations",
        icon: MapPin,
      },
      {
        name: "Edge Function: /edge",
        description: "Returns top paths from Google Analytics for intelligent prefetching and performance optimization",
        howToUse: "Pages you're likely to visit are prefetched for instant loading",
        icon: Zap,
      },
      {
        name: "Edge Function: /edge/geo",
        description: "API endpoint returning visitor's geolocation data (country, region, city) for client-side use",
        howToUse: "Developers can call /edge/geo to get visitor location data",
        icon: Terminal,
      },
      {
        name: "Admin Panel Protection",
        description: "Edge middleware protects /admin route with HTTP Basic Authentication at the edge",
        howToUse: "Admin access requires username/password authentication before the page loads",
        icon: Shield,
      },
    ],
  },
];

// Contentstack products
const contentstackProducts = [
  { name: "Headless CMS", description: "Content storage & delivery", icon: Database, color: "bg-blue-500" },
  { name: "Delivery SDK", description: "Fast content fetching", icon: Zap, color: "bg-cyan-500" },
  { name: "Management API", description: "CRUD operations", icon: Settings, color: "bg-purple-500" },
  { name: "Personalize", description: "User segmentation", icon: Users, color: "bg-indigo-500" },
  { name: "Data & Insights", description: "Lytics analytics", icon: BarChart3, color: "bg-green-500" },
  { name: "Automate", description: "Workflow automation", icon: Workflow, color: "bg-orange-500" },
  { name: "Webhooks", description: "Event triggers", icon: Webhook, color: "bg-red-500" },
  { name: "Launch", description: "Edge hosting", icon: Globe, color: "bg-slate-500" },
  { name: "Marketplace", description: "Algolia, AI Chatbot", icon: PanelLeftClose, color: "bg-violet-500" },
];

// Tech stack with more details
const techStack = [
  { name: "Next.js 15", description: "React framework with App Router", icon: Code, detail: "Server components, streaming, caching" },
  { name: "TypeScript", description: "Type-safe development", icon: Code, detail: "Full type coverage across codebase" },
  { name: "Tailwind CSS 4", description: "Utility-first styling", icon: Monitor, detail: "Responsive, modern UI components" },
  { name: "Contentstack", description: "Headless CMS", icon: Cloud, detail: "10+ products integrated" },
  { name: "Algolia", description: "Search engine", icon: Search, detail: "Fuzzy matching, typo tolerance" },
  { name: "NeonDB", description: "Serverless PostgreSQL", icon: Database, detail: "User data, skills, applications" },
  { name: "NextAuth.js", description: "Authentication", icon: Shield, detail: "Email/password + Google OAuth" },
  { name: "Launch", description: "Edge hosting", icon: Globe, detail: "Geolocation, edge functions" },
];

export default function OverviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-full mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Job Discovery Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Complete Platform{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Documentation
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              JobPortal combines intelligent search, AI personalization, skill gap analysis, 
              and automated workflows to revolutionize job discovery. Built on Contentstack&apos;s composable architecture.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/jobs"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                Browse Jobs
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
              >
                Get Started Free
              </Link>
            </div>
            
            {/* Quick Links to PRD/TRD */}
            <div className="mt-8 flex justify-center gap-6 text-sm">
              <a href="#prd" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                <FileText className="w-4 h-4" />
                View PRD
              </a>
              <span className="text-gray-300">|</span>
              <a href="#trd" className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1">
                <Code className="w-4 h-4" />
                View TRD
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { value: "10+", label: "Feature Categories" },
              { value: "40+", label: "Individual Features" },
              { value: "9", label: "Contentstack Products" },
              { value: "PRD", label: "Product Requirements" },
              { value: "TRD", label: "Technical Requirements" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contentstack Products Section */}
      <section className="py-16 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powered by Contentstack</h2>
            <p className="text-purple-200 max-w-2xl mx-auto">
              This platform leverages 10 Contentstack products for a complete composable experience
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {contentstackProducts.map((product, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300 group"
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 ${product.color} rounded-lg mb-3 group-hover:scale-110 transition-transform`}>
                  <product.icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-white text-sm mb-1">{product.name}</h4>
                <p className="text-xs text-purple-200">{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Categories Navigation */}
      <section className="py-8 bg-gray-50 border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {featureCategories.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors"
              >
                <category.icon className="w-3.5 h-3.5 mr-1.5" />
                {category.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {featureCategories.map((category, categoryIndex) => (
              <div key={category.id} id={category.id} className="scroll-mt-32">
                {/* Category Header */}
                <div className={`flex items-center gap-4 mb-8 ${categoryIndex % 2 === 1 ? "md:flex-row-reverse md:text-right" : ""}`}>
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${category.color} shadow-lg`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{category.title}</h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {category.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className={`${category.bgColor} ${category.borderColor} border rounded-xl p-5 hover:shadow-lg transition-all duration-300 group`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-lg bg-gradient-to-br ${category.color} shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                          <feature.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-semibold text-gray-900 mb-1.5">
                            {feature.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-3">{feature.description}</p>
                          <div className="flex items-start gap-2 text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-500">
                              <strong className="text-gray-700">How to use:</strong> {feature.howToUse}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tech Stack</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Modern, scalable technologies for the best developer and user experience
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg hover:border-blue-300 transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <tech.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{tech.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{tech.description}</p>
                <p className="text-xs text-gray-400">{tech.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRD Section */}
      <section id="prd" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
              <FileText className="w-4 h-4 mr-2" />
              Product Requirements Document
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">PRD Overview</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Product vision, goals, and requirements for the JobPortal platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Vision */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Product Vision</h3>
              </div>
              <p className="text-gray-600 mb-4">
                JobPortal is an AI-powered job discovery platform that connects job seekers with employers 
                through personalized experiences, intelligent search, and skill-based recommendations.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Reduce time to find relevant jobs by 60%</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Increase application quality through skill matching</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Bridge skill gaps with integrated learning resources</span>
                </div>
              </div>
            </div>

            {/* Target Users */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Target Users</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-1">Job Seekers (Primary)</h4>
                  <p className="text-sm text-gray-600">Active seekers, passive candidates, first-time users, returning visitors</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-1">Employers (Secondary)</h4>
                  <p className="text-sm text-gray-600">Recruiters, HR managers posting jobs and reviewing applications</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-1">Administrators</h4>
                  <p className="text-sm text-gray-600">Content admins and system admins managing the platform</p>
                </div>
              </div>
            </div>

            {/* Key Problems Solved */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-100 rounded-xl">
                  <Zap className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Problems Solved</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <span className="text-red-500 font-bold">→</span>
                  <div>
                    <p className="font-medium text-gray-900">Information Overload</p>
                    <p className="text-sm text-gray-600">Thousands of listings without personalized filtering</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <span className="text-red-500 font-bold">→</span>
                  <div>
                    <p className="font-medium text-gray-900">Irrelevant Recommendations</p>
                    <p className="text-sm text-gray-600">Generic suggestions not matching skills/interests</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <span className="text-red-500 font-bold">→</span>
                  <div>
                    <p className="font-medium text-gray-900">Skill Gap Blindness</p>
                    <p className="text-sm text-gray-600">No insight into what skills to learn for better opportunities</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Metrics */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Success Metrics</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">&gt;3 min</p>
                  <p className="text-xs text-gray-600">Avg Session Duration</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">&gt;5</p>
                  <p className="text-xs text-gray-600">Jobs Viewed/Session</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">&gt;40%</p>
                  <p className="text-xs text-gray-600">Return Rate</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">&gt;5%</p>
                  <p className="text-xs text-gray-600">Application Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Stories */}
          <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <MessageSquare className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Key User Stories</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { as: "Job Seeker", want: "search jobs by skills", so: "I can find relevant opportunities quickly" },
                { as: "Job Seeker", want: "see my skill gaps", so: "I know what to learn for better opportunities" },
                { as: "Job Seeker", want: "get personalized recommendations", so: "I don't miss relevant jobs" },
                { as: "Job Seeker", want: "receive email alerts", so: "I'm notified when new jobs are posted" },
                { as: "Employer", want: "post jobs easily", so: "I can attract qualified candidates" },
                { as: "Admin", want: "manage content via CMS", so: "I can update the platform without code changes" },
              ].map((story, index) => (
                <div key={index} className="p-4 bg-indigo-50 rounded-xl">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-indigo-600">As a</span> {story.as},{" "}
                    <span className="font-semibold text-indigo-600">I want to</span> {story.want},{" "}
                    <span className="font-semibold text-indigo-600">so that</span> {story.so}.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRD Section */}
      <section id="trd" className="py-16 bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full mb-4">
              <Code className="w-4 h-4 mr-2" />
              Technical Requirements Document
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">TRD Overview</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Technical architecture, database design, and integration specifications
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* System Architecture */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <Server className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold">System Architecture</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl">
                  <h4 className="font-semibold text-emerald-400 mb-2">Frontend Layer</h4>
                  <p className="text-sm text-gray-300">Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <h4 className="font-semibold text-emerald-400 mb-2">Backend Layer</h4>
                  <p className="text-sm text-gray-300">Next.js API Routes, Edge Functions, NextAuth.js</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <h4 className="font-semibold text-emerald-400 mb-2">Data Layer</h4>
                  <p className="text-sm text-gray-300">Contentstack CMS, NeonDB PostgreSQL, Algolia Search</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <h4 className="font-semibold text-emerald-400 mb-2">Infrastructure</h4>
                  <p className="text-sm text-gray-300">Contentstack Launch (Edge hosting), Global CDN</p>
                </div>
              </div>
            </div>

            {/* Database Schema */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Database className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold">Database Schema (NeonDB)</h3>
              </div>
              <div className="space-y-3 font-mono text-sm">
                <div className="p-3 bg-black/30 rounded-lg">
                  <p className="text-blue-400 mb-1">-- users table</p>
                  <p className="text-gray-300">id, email, password_hash, first_name, last_name, auth_provider, created_at</p>
                </div>
                <div className="p-3 bg-black/30 rounded-lg">
                  <p className="text-blue-400 mb-1">-- user_skills table</p>
                  <p className="text-gray-300">id, email, skill, created_at</p>
                </div>
                <div className="p-3 bg-black/30 rounded-lg">
                  <p className="text-blue-400 mb-1">-- applications table</p>
                  <p className="text-gray-300">id, user_email, job_id, status, cover_letter, resume_url, created_at</p>
                </div>
              </div>
            </div>

            {/* Content Types */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Layers className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold">Contentstack Content Types</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Job", fields: "12 fields" },
                  { name: "Company", fields: "10 fields" },
                  { name: "Blog Post", fields: "9 fields" },
                  { name: "Homepage", fields: "6 fields" },
                  { name: "Navigation", fields: "3 fields" },
                  { name: "Notification", fields: "8 fields" },
                  { name: "Personalized Banner", fields: "7 fields" },
                  { name: "Learning Resource", fields: "14 fields" },
                ].map((ct, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-lg flex justify-between items-center">
                    <span className="text-white font-medium">{ct.name}</span>
                    <span className="text-xs text-purple-400">{ct.fields}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Integration Points */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <Workflow className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold">Integration Points</h3>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Algolia", type: "Search", flow: "CMS → Automate → Algolia Index" },
                  { name: "Lytics", type: "Analytics", flow: "Browser → jstag → Lytics → Personalize" },
                  { name: "NextAuth", type: "Auth", flow: "Frontend → API → NeonDB/Google" },
                  { name: "Automate", type: "Email", flow: "Webhook → Automate → Email Provider" },
                  { name: "Launch", type: "Hosting", flow: "Git Push → Build → CDN Deploy" },
                ].map((int, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-white">{int.name}</span>
                      <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded">{int.type}</span>
                    </div>
                    <p className="text-xs text-gray-400 font-mono">{int.flow}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security & Performance */}
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-500/20 rounded-xl">
                  <Shield className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold">Security Requirements</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Password hashing with bcrypt (cost factor 12)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">JWT session tokens with NextAuth.js</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Admin panel protected by Edge middleware</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Webhook secret verification for all webhooks</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">SSL/TLS encryption on all endpoints</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold">Performance Requirements</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Page Load Time</span>
                  <span className="text-yellow-400 font-mono">&lt; 2 seconds</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Search Response</span>
                  <span className="text-yellow-400 font-mono">&lt; 100ms</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300">API Response</span>
                  <span className="text-yellow-400 font-mono">&lt; 500ms</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Uptime SLA</span>
                  <span className="text-yellow-400 font-mono">&gt; 99.9%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Lighthouse Score</span>
                  <span className="text-yellow-400 font-mono">&gt; 90</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
            
            <div className="relative z-10">
              <Briefcase className="w-16 h-16 text-white/80 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Find Your Dream Job?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Experience the power of AI-driven job discovery with personalized recommendations, 
                skill gap analysis, and intelligent search.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg"
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href="/jobs"
                  className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  Browse Jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <section className="py-8 bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <Link href="/jobs" className="hover:text-blue-600 transition-colors">Jobs</Link>
            <Link href="/companies" className="hover:text-blue-600 transition-colors">Companies</Link>
            <Link href="/blogs" className="hover:text-blue-600 transition-colors">Blogs</Link>
            <Link href="/learnings" className="hover:text-blue-600 transition-colors">Learning Hub</Link>
            <Link href="/overview" className="hover:text-blue-600 transition-colors">Overview</Link>
            <Link href="/profile" className="hover:text-blue-600 transition-colors">Profile</Link>
            <Link href="/login" className="hover:text-blue-600 transition-colors">Sign In</Link>
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">
            Built with Contentstack • Next.js 15 • Algolia • NeonDB
          </p>
        </div>
      </section>
    </div>
  );
}
