// Description: Type definitions for the Job Portal

// PublishDetails object - Represents the details of publish functionality 
export interface PublishDetails {
  environment: string;
  locale: string;
  time: string;
  user: string;
}

// File object - Represents a file in Contentstack
export interface File {
  uid: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  content_type: string;
  file_size: string;
  tags: string[];
  filename: string;
  url: string;
  ACL: any[] | object;
  is_dir: boolean;
  parent_uid: string;
  _version: number;
  title: string;
  _metadata?: object;
  publish_details: PublishDetails;
  $: any;
}

// Link object - Represents a hyperlink in Contentstack
export interface Link {
  title: string;
  href: string;
}

// Taxonomy object - Represents a taxonomy in Contentstack
export interface Taxonomy {
  taxonomy_uid: string;
  max_terms?: number;
  mandatory: boolean;
  non_localizable: boolean;
}

// Block object - Represents a modular block in Contentstack
export interface Block {
  _version?: number;
  _metadata: any;
  $: any;
  title?: string;
  copy?: string;
  image?: File | null;
  layout?: ("image_left" | "image_right") | null;
}

export interface Blocks {
  block: Block;
}

// Page object - Represents a page in Contentstack
export interface Page {
  uid: string;
  $: any;
  _version?: number;
  title: string;
  url?: string;
  description?: string;
  image?: File | null;
  rich_text?: string;
  blocks?: Blocks[];
}

// Job Portal Types

export interface Company {
  id: string;
  name: string;
  description: string;
  logo?: File | null;
  website?: string;
  location: string;
  industry: string;
  size: string;
  founded?: string;
  benefits?: string[];
  culture?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Contentstack Company type (matches CMS schema)
export interface ContentstackCompany {
  uid: string;
  title: string;
  description: string;
  logo?: File | null;
  website?: string;
  location: string;
  industry: string;
  size: string;
  founded?: string;
  benefits?: string[];
  culture?: string;
  social_media?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
  };
  created_at?: string;
  updated_at?: string;
  $?: any;
  _metadata?: any;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  company: Company;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  experience: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  salary?: {
    min?: number;
    max?: number;
    currency: string;
    period: 'hourly' | 'monthly' | 'yearly';
  };
  benefits?: string[];
  skills: string[];
  category: string;
  status: 'active' | 'paused' | 'closed';
  postedAt: string;
  expiresAt?: string;
  applicationsCount: number;
  viewsCount: number;
  isRemote: boolean;
  isUrgent: boolean;
  applicationUrl?: string;
  contactEmail?: string;
}

// Contentstack Homepage type
export interface ContentstackHomepage {
  uid: string;
  title: string;
  hero_section: {
    main_title: string;
    subtitle: string;
    search_job_placeholder: string;
    search_location_placeholder: string;
    search_button_text: string;
  };
  stats_section: {
    stat_items: Array<{
      label: string;
      value: string;
      icon: string;
    }>;
  };
  featured_jobs_section: {
    section_title: string;
    view_all_text: string;
  };
  top_companies_section: {
    section_title: string;
    description: string;
  };
  cta_section: {
    title: string;
    description: string;
    primary_button_text: string;
    primary_button_link: string;
    secondary_button_text: string;
    secondary_button_link: string;
  };
}

// Contentstack Navigation type
export interface ContentstackNavigation {
  uid: string;
  title: string;
  brand_name: string;
  logo?: any;
  nav_items: Array<{
    label: string;
    link: string;
    icon?: string;
    requireAuth?: boolean;
  }>;
}

// Contentstack Job type (matches CMS schema)
export interface ContentstackJob {
  uid: string;
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  company: ContentstackCompany[] | ContentstackCompany; // Reference field can be array or single
  location: string;
  type: string;
  experience: string;
  salary?: {
    min?: number;
    max?: number;
    currency: string;
    period: string;
  };
  benefits?: string[];
  skills?: Array<{ skill: string; proficiency: string }>;
  category: string;
  status: string;
  posted_at: string;
  expires_at?: string;
  applications_count?: number;
  views_count?: number;
  is_remote: boolean;
  is_urgent: boolean;
  application_url?: string;
  contact_email?: string;
  created_at?: string;
  updated_at?: string;
  $?: any;
  _metadata?: any;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: File | null;
  phone?: string;
  location?: string;
  bio?: string;
  skills: string[];
  experience: string;
  education: Education[];
  workHistory: WorkExperience[];
  resume?: File | null;
  portfolio?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
  preferences: {
    jobTypes: string[];
    locations: string[];
    salaryRange?: {
      min: number;
      max: number;
    };
    notifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: number;
  description?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements?: string[];
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: 'submitted' | 'reviewed' | 'shortlisted' | 'interview' | 'rejected' | 'hired';
  coverLetter?: string;
  resume?: File | null;
  portfolio?: string;
  expectedSalary?: number;
  availability?: string;
  additionalInfo?: string;
  appliedAt: string;
  updatedAt: string;
  notes?: string;
  interviewScheduled?: {
    date: string;
    time: string;
    type: 'phone' | 'video' | 'in-person';
    location?: string;
    interviewer?: string;
  };
}

export interface JobSearchFilters {
  query?: string;
  location?: string;
  type?: string[];
  experience?: string[];
  salaryRange?: {
    min: number;
    max: number;
  };
  skills?: string[];
  category?: string[];
  company?: string[];
  isRemote?: boolean;
  postedWithin?: string;
}

export interface JobSearchResult {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Blog Types
export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: File | null;
  author: string;
  category: string;
  publishedDate: string;
  readingTime: number;
  createdAt?: string;
  updatedAt?: string;
}

// Contentstack Blog type (matches CMS schema)
export interface ContentstackBlog {
  uid: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: File | null;
  author: string;
  category: string;
  published_date: string;
  reading_time: number;
  created_at?: string;
  updated_at?: string;
  $?: any;
  _metadata?: any;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  userEmail: string;
  type: 'application' | 'job_update' | 'system';
  title: string;
  message: string;
  read: boolean;
  metadata?: {
    jobId?: string;
    jobTitle?: string;
    companyName?: string;
    applicationId?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

// Contentstack Notification type (matches CMS schema)
export interface ContentstackNotification {
  createdAt: string | undefined;
  updatedAt: string | undefined;
  uid: string;
  user_id: string;
  user_email: string;
  type: 'application' | 'job_update' | 'system';
  title: string;
  message: string;
  read: boolean;
  metadata?: {
    jobId?: string;
    jobTitle?: string;
    companyName?: string;
    applicationId?: string;
    [key: string]: any;
  };
  created_at?: string;
  updated_at?: string;
  $?: any;
  _metadata?: any;
}

// Demo Video Types
export interface DemoVideo {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnail?: File | null;
  duration?: string;
  createdAt: string;
  updatedAt: string;
}

// Contentstack Demo Video type (matches CMS schema)
export interface ContentstackDemoVideo {
  uid: string;
  title: string;
  description?: string;
  video?: File | null;
  thumbnail?: File | null;
  duration?: string;
  created_at?: string;
  updated_at?: string;
  $?: any;
  _metadata?: any;
}