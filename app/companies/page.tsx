import { getCompanies } from "@/lib/contentstack";
import { Company, ContentstackCompany } from "@/lib/types";
import CompaniesClient from "./CompaniesClient";

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

export default async function CompaniesPage() {
  // Fetch companies from Contentstack CMS
  const csCompanies = await getCompanies();
  
  // Transform to Company type
  const companies: Company[] = (csCompanies as ContentstackCompany[]).map(transformCompany);

  return <CompaniesClient companies={companies} />;
}
