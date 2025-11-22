import { notFound } from "next/navigation";
import { headers, cookies } from "next/headers";
import { getBlogByUid } from "@/lib/contentstack";
import { Blog, ContentstackBlog } from "@/lib/types";
import { detectLocale } from "@/lib/utils";
import BlogDetailClient from "./BlogDetailClient";

// Helper function to transform Contentstack blog to Blog type
function transformBlog(csBlog: ContentstackBlog): Blog {
  return {
    id: csBlog.uid,
    title: csBlog.title,
    slug: csBlog.slug,
    excerpt: csBlog.excerpt,
    content: csBlog.content,
    featuredImage: csBlog.featured_image || null,
    author: csBlog.author,
    category: csBlog.category,
    publishedDate: csBlog.published_date,
    readingTime: csBlog.reading_time,
    createdAt: csBlog.created_at,
    updatedAt: csBlog.updated_at,
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params in Next.js 15
  const { id } = await params;
  
  // Detect locale: check cookie first (user preference), then Accept-Language header
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("locale")?.value;
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language");
  const locale = detectLocale(cookieLocale, acceptLanguage);
  
  // Fetch blog from Contentstack CMS with locale
  const csBlog = await getBlogByUid(id, locale);

  if (!csBlog) {
    notFound();
  }

  // Transform to Blog type
  const blog = transformBlog(csBlog as ContentstackBlog);

  return <BlogDetailClient blog={blog} currentLocale={locale} />;
}

