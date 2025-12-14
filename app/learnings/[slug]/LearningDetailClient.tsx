"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Clock, 
  Play, 
  CheckCircle, 
  ExternalLink,
  Bookmark,
  Share2,
  ThumbsUp,
  ChevronRight,
  BookOpen,
  Briefcase
} from "lucide-react";
import { ContentstackLearningResource } from "@/lib/contentstack";
import { trackLearningView } from "@/lib/behavior-tracking";

// Difficulty colors
const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
};

// Technology colors
const TECH_COLORS: Record<string, string> = {
  nextjs: "bg-black text-white",
  react: "bg-cyan-500 text-white",
  nodejs: "bg-green-600 text-white",
  typescript: "bg-blue-600 text-white",
  microservices: "bg-purple-600 text-white",
  docker: "bg-blue-500 text-white",
  kubernetes: "bg-blue-700 text-white",
  aws: "bg-orange-500 text-white",
  python: "bg-yellow-500 text-black",
  golang: "bg-cyan-600 text-white",
  devops: "bg-gray-700 text-white",
  ai_ml: "bg-pink-600 text-white",
  database: "bg-indigo-600 text-white",
  security: "bg-red-600 text-white",
  other: "bg-gray-500 text-white",
};

interface LearningDetailClientProps {
  resource: ContentstackLearningResource;
  relatedResources: ContentstackLearningResource[];
}

export default function LearningDetailClient({ resource, relatedResources }: LearningDetailClientProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Track learning view on mount
  useEffect(() => {
    trackLearningView({
      uid: resource.uid,
      title: resource.title,
      technology: resource.technology,
      skills: resource.skills_covered,
    });
  }, [resource.uid, resource.title, resource.technology, resource.skills_covered]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: resource.title,
          text: resource.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareMenu(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/learnings"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Learnings</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked 
                    ? 'bg-indigo-100 text-indigo-600' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2">
                    <button
                      onClick={copyToClipboard}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50"
                    >
                      Copy link
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-black rounded-xl overflow-hidden shadow-lg">
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${resource.youtube_video_id}?rel=0`}
                  title={resource.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Title & Meta */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${TECH_COLORS[resource.technology] || 'bg-gray-600 text-white'}`}>
                  {resource.technology.replace('_', '/')}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${DIFFICULTY_COLORS[resource.difficulty_level]}`}>
                  {resource.difficulty_level.charAt(0).toUpperCase() + resource.difficulty_level.slice(1)}
                </span>
                {resource.duration && (
                  <span className="flex items-center gap-1 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    {resource.duration}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {resource.title}
              </h1>

              {resource.instructor && (
                <p className="text-gray-600 mb-4">by {resource.instructor}</p>
              )}

              <p className="text-gray-700 leading-relaxed">
                {resource.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
                <a
                  href={resource.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Watch on YouTube
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  Helpful
                </button>
              </div>
            </div>

            {/* Key Takeaways */}
            {resource.key_takeaways && resource.key_takeaways.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  What You&apos;ll Learn
                </h2>
                <ul className="space-y-3">
                  {resource.key_takeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills Covered */}
            {resource.skills_covered && resource.skills_covered.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Skills Covered</h3>
                <div className="flex flex-wrap gap-2">
                  {resource.skills_covered.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Jobs CTA */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
              <Briefcase className="w-10 h-10 mb-4" />
              <h3 className="font-bold text-lg mb-2">Apply These Skills</h3>
              <p className="text-white/90 text-sm mb-4">
                Find jobs that match the skills you&apos;re learning.
              </p>
              <Link
                href={`/jobs?skills=${resource.skills_covered?.slice(0, 3).join(',') || resource.technology}`}
                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Browse Jobs
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Related Resources */}
            {relatedResources.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  More in {resource.technology.replace('_', '/')}
                </h3>
                <div className="space-y-4">
                  {relatedResources.map(related => (
                    <Link
                      key={related.uid}
                      href={`/learnings/${related.slug}`}
                      className="block group"
                    >
                      <div className="flex gap-3">
                        <div className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                          <img
                            src={related.thumbnail?.url || `https://img.youtube.com/vi/${related.youtube_video_id}/mqdefault.jpg`}
                            alt={related.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                            <Play className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 line-clamp-2 text-sm">
                            {related.title}
                          </h4>
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${DIFFICULTY_COLORS[related.difficulty_level]}`}>
                            {related.difficulty_level}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <Link
                  href={`/learnings?tech=${resource.technology}`}
                  className="block text-center text-indigo-600 hover:text-indigo-700 font-medium text-sm mt-4 pt-4 border-t"
                >
                  View all {resource.technology.replace('_', '/')} tutorials →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

