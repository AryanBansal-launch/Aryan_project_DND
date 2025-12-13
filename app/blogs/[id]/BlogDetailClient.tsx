"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft,
  Calendar,
  Clock,
  User,
  BookOpen,
  Share2,
  Facebook,
  Twitter,
  Linkedin
} from "lucide-react";
import { Blog } from "@/lib/types";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { trackBlogRead } from "@/lib/behavior-tracking";

interface BlogDetailClientProps {
  blog: Blog;
  currentLocale?: string;
}

export default function BlogDetailClient({ blog, currentLocale }: BlogDetailClientProps) {
  const [copied, setCopied] = useState(false);
  const hasTrackedView = useRef(false);

  // Track blog read when component mounts (only once)
  useEffect(() => {
    if (!hasTrackedView.current) {
      hasTrackedView.current = true;
      trackBlogRead({
        uid: blog.id,
        title: blog.title,
        category: blog.category,
        tags: blog.tags,
      });
      console.log(`📖 Tracked blog read: ${blog.title}`);
    }
  }, [blog]);

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const text = blog.title;

    if (platform === "copy") {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (platform && shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button and Language Switcher */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/blogs"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Link>
          <LanguageSwitcher currentLocale={currentLocale} />
        </div>

        {/* Article */}
        <article className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Featured Image */}
          {blog.featuredImage?.url ? (
            <div className="relative w-full h-96 bg-gray-200">
              <Image
                src={blog.featuredImage.url}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-96 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <BookOpen className="w-24 h-24 text-white opacity-50" />
            </div>
          )}

          <div className="p-8">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {blog.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                <span className="font-medium">{blog.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{new Date(blog.publishedDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>{blog.readingTime} min read</span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Share:</span>
                <button
                  onClick={() => handleShare("facebook")}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="p-2 text-gray-600 hover:text-blue-400 transition-colors"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="p-2 text-gray-600 hover:text-blue-700 transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare("copy")}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Copy link"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                {copied && (
                  <span className="text-sm text-green-600 ml-2">Copied!</span>
                )}
              </div>
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </article>

        {/* Related Actions */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/blogs"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            View All Blogs
          </Link>
        </div>
      </div>
    </div>
  );
}

