import { notFound } from "next/navigation";
import { getJobByUid } from "@/lib/contentstack";
import { Job, ContentstackJob, Company, ContentstackCompany } from "@/lib/types";
import JobDetailClient from "./JobDetailClient";

// Helper function to transform Contentstack company to Company type
function transformCompany(csCompany: ContentstackCompany): Company {
  return {
    id: csCompany.uid,
    name: csCompany.title,
    description: csCompany.description,
    logo: csCompany.logo || null,
    website: csCompany.website,
    location: csCompany.location,
    industry: csCompany.industry,
    size: csCompany.size,
    founded: csCompany.founded,
    benefits: csCompany.benefits,
    culture: csCompany.culture,
    socialMedia: csCompany.social_media ? {
      linkedin: csCompany.social_media.linkedin,
      twitter: csCompany.social_media.twitter,
      facebook: csCompany.social_media.facebook,
      website: csCompany.social_media.website,
    } : undefined,
    createdAt: csCompany.created_at || new Date().toISOString(),
    updatedAt: csCompany.updated_at || new Date().toISOString(),
  };
}

// Helper function to transform Contentstack job to Job type
function transformJob(csJob: ContentstackJob): Job {
  // Handle company reference (can be array or single object)
  const companyData = Array.isArray(csJob.company) ? csJob.company[0] : csJob.company;
  const company = transformCompany(companyData);

  // Extract skills as array of strings
  const skills = csJob.skills?.map(s => s.skill) || [];

  return {
    id: csJob.uid,
    title: csJob.title,
    description: csJob.description,
    requirements: csJob.requirements,
    responsibilities: csJob.responsibilities,
    company,
    location: csJob.location,
    type: csJob.type as any,
    experience: csJob.experience as any,
    salary: csJob.salary ? {
      ...csJob.salary,
      period: csJob.salary.period as 'hourly' | 'monthly' | 'yearly',
    } : undefined,
    benefits: csJob.benefits,
    skills,
    category: csJob.category,
    status: csJob.status as any,
    postedAt: csJob.posted_at,
    expiresAt: csJob.expires_at,
    applicationsCount: csJob.applications_count || 0,
    viewsCount: csJob.views_count || 0,
    isRemote: csJob.is_remote,
    isUrgent: csJob.is_urgent,
    applicationUrl: csJob.application_url,
    contactEmail: csJob.contact_email,
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params in Next.js 15
  const { id } = await params;
  
  // Fetch job from Contentstack CMS
  const csJob = await getJobByUid(id);

  if (!csJob) {
    notFound();
  }

  // Transform to Job type
  const job = transformJob(csJob as ContentstackJob);

  return <JobDetailClient job={job} />;
}
