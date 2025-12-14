"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  TrendingUp,
  BookOpen,
  ChevronRight,
  X,
  Zap,
  Target,
  Sparkles,
} from "lucide-react";
import { updatePersonalizeAttributes } from "@/lib/behavior-tracking";

interface SkillGapSummary {
  matchPercentage: number;
  topMissingSkills: string[];
  potentialIncrease: number;
}

export default function SkillGapBanner() {
  const { data: session, status } = useSession();
  const [summary, setSummary] = useState<SkillGapSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [userSkills, setUserSkills] = useState<string[]>([]);

  // Check if banner was dismissed this session
  useEffect(() => {
    const wasDismissed = sessionStorage.getItem("skillGapBannerDismissed");
    if (wasDismissed) {
      setDismissed(true);
    }
  }, []);

  // Fetch user skills and skill gap analysis
  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // First, get user skills
        const skillsResponse = await fetch("/api/user/skills");
        if (!skillsResponse.ok) return;

        const skillsData = await skillsResponse.json();
        const skills = skillsData.skills || [];
        setUserSkills(skills);

        if (skills.length === 0) return;

        // Then, get skill gap summary
        const gapResponse = await fetch("/api/skill-gap?quick=true");
        if (!gapResponse.ok) return;

        const gapData = await gapResponse.json();
        if (gapData.success && gapData.summary) {
          setSummary(gapData.summary);

          // Update Personalize attributes with skill gap data
          updatePersonalizeAttributes({
            skill_match_percentage: gapData.summary.matchPercentage,
            has_skill_gaps: gapData.summary.topMissingSkills.length > 0,
            top_missing_skill: gapData.summary.topMissingSkills[0] || "",
          });
        }
      } catch (error) {
        console.error("Error fetching skill gap data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status]);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("skillGapBannerDismissed", "true");
  };

  // Don't show if:
  // - Not logged in
  // - Loading
  // - Dismissed
  // - No skills
  // - No skill gaps
  // - High match percentage (>80%)
  if (
    status !== "authenticated" ||
    loading ||
    dismissed ||
    userSkills.length === 0 ||
    !summary ||
    summary.topMissingSkills.length === 0 ||
    summary.matchPercentage >= 80
  ) {
    return null;
  }

  const topSkill = summary.topMissingSkills[0];
  const potentialJobs = summary.potentialIncrease;

  // Different banner styles based on match percentage
  if (summary.matchPercentage < 30) {
    // Low match - urgent banner
    return (
      <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Only {summary.matchPercentage}% of jobs match your skills!
                </p>
                <p className="text-white/90 text-sm">
                  Learn <strong>{topSkill}</strong> to unlock{" "}
                  <strong>+{potentialJobs}</strong> more job opportunities
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/learnings"
                className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors flex items-center gap-1"
              >
                <BookOpen className="w-4 h-4" />
                Start Learning
                <ChevronRight className="w-4 h-4" />
              </Link>
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (summary.matchPercentage < 60) {
    // Medium match - improvement banner
    return (
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">
                  Level up your skills to match more jobs!
                </p>
                <p className="text-white/90 text-sm">
                  You match {summary.matchPercentage}% of jobs. Learn{" "}
                  <strong>{topSkill}</strong> to unlock{" "}
                  <strong>+{potentialJobs}</strong> more opportunities
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/learnings"
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-4 h-4" />
                Browse Courses
                <ChevronRight className="w-4 h-4" />
              </Link>
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Good match (60-80%) - subtle recommendation
  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5" />
            <p className="text-sm">
              <strong>Great match!</strong> You qualify for {summary.matchPercentage}%
              of jobs. Learn <strong>{topSkill}</strong> to unlock even more!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/learnings"
              className="text-white/90 hover:text-white text-sm font-medium flex items-center gap-1"
            >
              Explore Courses
              <ChevronRight className="w-4 h-4" />
            </Link>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

