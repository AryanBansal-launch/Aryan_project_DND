import { Suspense } from "react";
import { getJobs } from "@/lib/contentstack";
import { Job, ContentstackJob, Company, ContentstackCompany } from "@/lib/types";
import JobsClient from "./JobsClient";

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

export default async function JobsPage() {
  // Fetch jobs from Contentstack CMS
  const csJobs = await getJobs();
  
  // Transform to Job type
  const jobs: Job[] = (csJobs as ContentstackJob[]).map(transformJob);

  return (
    <Suspense fallback={<JobsPageLoading />}>
      <JobsClient jobs={jobs} />
    </Suspense>
  );
}

function JobsPageLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
