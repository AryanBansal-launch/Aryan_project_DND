import { Suspense } from "react";
import { getBlogs } from "@/lib/contentstack";
import { Blog, ContentstackBlog } from "@/lib/types";
import BlogsClient from "./BlogsClient";

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

export default async function BlogsPage() {
  // Fetch blogs from Contentstack CMS
  const csBlogs = await getBlogs();
  
  // Transform to Blog type
  const blogs: Blog[] = (csBlogs as ContentstackBlog[]).map(transformBlog);

  return (
    <Suspense fallback={<BlogsPageLoading />}>
      <BlogsClient blogs={blogs} />
    </Suspense>
  );
}

function BlogsPageLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

