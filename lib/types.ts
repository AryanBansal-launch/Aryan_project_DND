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