import { getHomepage, getJobs, getCompanies } from "@/lib/contentstack";
import { ContentstackHomepage, ContentstackJob, ContentstackCompany, Job, Company } from "@/lib/types";
import HomeClient from "./HomeClient";

// Disable caching for the "/" route (App Router segment config)
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// Helper to transform company
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

// Helper to transform job
function transformJob(csJob: ContentstackJob): Job {
  const companyData = Array.isArray(csJob.company) ? csJob.company[0] : csJob.company;
  const company = transformCompany(companyData);
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

export default async function Home() {
  // Fetch homepage content from CMS
  const csHomepage = await getHomepage();
  
  // Fetch featured jobs (get first 6 jobs)
  const csJobs = await getJobs();
  const featuredJobs = (csJobs as ContentstackJob[])
    .slice(0, 6)
    .map(transformJob);

  // Fetch top companies (get first 6)
  const csCompanies = await getCompanies();
  const companies = (csCompanies as ContentstackCompany[])
    .slice(0, 6)
    .map(transformCompany);

  // Count jobs per company
  const topCompanies = companies.map(company => ({
    name: company.name,
    jobCount: (csJobs as ContentstackJob[]).filter(job => {
      const jobCompany = Array.isArray(job.company) ? job.company[0] : job.company;
      return jobCompany?.uid === company.id;
    }).length
  }));

  // Fallback if no homepage content
  if (!csHomepage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Homepage content not found</h1>
          <p className="text-gray-600 mb-4">Please run the seed script to create homepage content:</p>
          <code className="bg-gray-100 px-4 py-2 rounded">node scripts/seed-homepage.js</code>
        </div>
      </div>
    );
  }

  // Transform all jobs for personalized recommendations
  const allJobs = (csJobs as ContentstackJob[]).map(transformJob);

  return (
    <HomeClient 
      homepage={csHomepage as ContentstackHomepage}
      featuredJobs={featuredJobs}
      topCompanies={topCompanies}
      allJobs={allJobs}
    />
  );
}
