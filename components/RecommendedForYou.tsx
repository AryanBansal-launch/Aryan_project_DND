"use client";

/**
 * RecommendedForYou Component
 * 
 * Displays personalized job recommendations based on user's browsing behavior.
 * Uses Lytics behavioral data to show relevant content.
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  DollarSign, 
  Building2,
  TrendingUp,
  ArrowRight,
  History,
  Target
} from "lucide-react";
import { 
  getUserBehavior, 
  getTopSkills, 
  getPersonalizationSummary
} from "@/lib/behavior-tracking";
import { formatSalary, formatRelativeTime } from "@/lib/utils";

interface Job {
  uid: string;
  title: string;
  company: { name: string };
  location: string;
  salary?: { min: number; max: number };
  skills: string[];
  postedAt: string;
  isRemote?: boolean;
}

interface RecommendedForYouProps {
  allJobs: Job[];
}

export default function RecommendedForYou({ allJobs }: RecommendedForYouProps) {
  const [recommendations, setRecommendations] = useState<Job[]>([]);
  const [personalizationReason, setPersonalizationReason] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [showSection, setShowSection] = useState(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    const generateRecommendations = () => {
      const behavior = getUserBehavior();
      const summary = getPersonalizationSummary();
      
      // Don't show for brand new users with no behavior
      if (behavior.totalJobViews === 0 && behavior.sessionCount === 1) {
        setShowSection(false);
        setIsLoading(false);
        return;
      }

      setShowSection(true);

      const topSkills = getTopSkills(5);
      const viewedJobIds = behavior.viewedJobs;

      // Score jobs based on user interests
      const scoredJobs = allJobs
        .filter(job => !viewedJobIds.includes(job.uid)) // Exclude already viewed
        .map(job => {
          let score = 0;
          const reasons: string[] = [];

          // Score based on skill match
          const jobSkills = job.skills.map(s => s.toLowerCase());
          topSkills.forEach((skill, index) => {
            if (jobSkills.some(js => js.includes(skill.toLowerCase()) || skill.toLowerCase().includes(js))) {
              score += (5 - index); // Higher weight for top skills
              reasons.push(skill);
            }
          });

          // Score based on location interest
          const topLocations = behavior.interestedLocations;
          if (topLocations.some(loc => 
            job.location.toLowerCase().includes(loc.toLowerCase()) ||
            loc.toLowerCase().includes(job.location.toLowerCase())
          )) {
            score += 3;
          }

          // Boost remote jobs if user has shown interest
          if (job.isRemote) {
            score += 1;
          }

          return { job, score, reasons };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);

      // Generate personalization reason
      let reason = "";
      if (topSkills.length > 0) {
        reason = `Based on your interest in ${topSkills.slice(0, 2).join(" and ")}`;
      } else if (summary.isReturning) {
        reason = "Welcome back! Here are some jobs you might like";
      } else {
        reason = "Jobs that might interest you";
      }

      setPersonalizationReason(reason);
      setRecommendations(scoredJobs.map(item => item.job));
      setIsLoading(false);
    };

    // Small delay to ensure behavior data is loaded
    const timer = setTimeout(generateRecommendations, 100);
    return () => clearTimeout(timer);
  }, [allJobs]);

  // Don't render if no personalization data or loading
  if (isLoading) {
    return null;
  }

  if (!showSection || recommendations.length === 0) {
    return null;
  }

  const summary = getPersonalizationSummary();

  return (
    <section className="py-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with personalization indicator */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Recommended For You
              </h2>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Target className="w-3 h-3" />
                {personalizationReason}
              </p>
            </div>
          </div>

          {/* Personalization insights badge */}
          <div className="flex items-center gap-2 flex-wrap">
            {summary.isReturning && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                <History className="w-3 h-3" />
                Welcome back!
              </span>
            )}
            {summary.engagementLevel === 'high' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                <TrendingUp className="w-3 h-3" />
                Active Explorer
              </span>
            )}
            {summary.topSkills.length > 0 && (
              <div className="flex items-center gap-1">
                {summary.topSkills.slice(0, 2).map((skill, idx) => (
                  <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Job recommendations grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((job) => (
            <Link key={job.uid} href={`/jobs/${job.uid}`}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 p-5 h-full cursor-pointer group">
                {/* Company & Title */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-indigo-100 group-hover:to-purple-100 transition-colors">
                    <Building2 className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">{job.company.name}</p>
                  </div>
                </div>

                {/* Job details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                    <span className="truncate">{job.location}</span>
                    {job.isRemote && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex-shrink-0">
                        Remote
                      </span>
                    )}
                  </div>
                  {job.salary && (
                    <div className="flex items-center text-gray-500 text-sm">
                      <DollarSign className="w-4 h-4 mr-1.5 flex-shrink-0" />
                      <span>{formatSalary(job.salary as { min: number; max: number; currency: string; period: string })}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1.5 flex-shrink-0" />
                    <span>{formatRelativeTime(job.postedAt)}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {job.skills.slice(0, 3).map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 3 && (
                    <span className="text-gray-400 text-xs px-1">
                      +{job.skills.length - 3}
                    </span>
                  )}
                </div>

                {/* CTA */}
                <div className="flex items-center text-indigo-600 font-medium text-sm group-hover:text-indigo-700">
                  View Job
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-8">
          <Link 
            href="/jobs" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-indigo-200 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
          >
            View All Jobs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

