import { getLearningResourceBySlug, getLearningResources } from "@/lib/contentstack";
import { notFound } from "next/navigation";
import LearningDetailClient from "./LearningDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = await getLearningResourceBySlug(slug);
  
  if (!resource) {
    return {
      title: "Learning Resource Not Found | JobPortal",
    };
  }

  return {
    title: `${resource.title} | Learnings | JobPortal`,
    description: resource.description,
  };
}

export default async function LearningDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = await getLearningResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  // Get related resources (same technology)
  const allResources = await getLearningResources({ technology: resource.technology, limit: 4 });
  const relatedResources = allResources.filter(r => r.uid !== resource.uid).slice(0, 3);

  return (
    <LearningDetailClient 
      resource={resource} 
      relatedResources={relatedResources}
    />
  );
}

