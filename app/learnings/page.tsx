import { getLearningResources, getLearningTechnologies } from "@/lib/contentstack";
import LearningsClient from "./LearningsClient";

export const metadata = {
  title: "Learnings | JobPortal",
  description: "Enhance your skills with curated learning resources. Watch tutorials on Next.js, React, Microservices, DevOps, and more in-demand technologies.",
};

export default async function LearningsPage() {
  // Fetch all learning resources and technologies
  const [resources, technologies] = await Promise.all([
    getLearningResources(),
    getLearningTechnologies(),
  ]);

  // Get featured resources
  const featuredResources = resources.filter(r => r.featured);

  return (
    <LearningsClient 
      resources={resources}
      technologies={technologies}
      featuredResources={featuredResources}
    />
  );
}

