"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Target,
  BookOpen,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Loader2,
  Sparkles,
  BarChart3,
  Play,
  Clock,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { SkillGapAnalysis, trackSkillLearningStart } from "@/lib/skill-gap-analyzer";

interface SkillGapRecommendationsProps {
  userSkills: string[];
  compact?: boolean; // For smaller display on profile
}

// Priority colors
const PRIORITY_COLORS = {
  high: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    badge: "bg-red-100 text-red-800",
    icon: "text-red-500",
  },
  medium: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700",
    badge: "bg-yellow-100 text-yellow-800",
    icon: "text-yellow-500",
  },
  low: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-800",
    icon: "text-blue-500",
  },
};

export default function SkillGapRecommendations({
  userSkills,
  compact = false,
}: SkillGapRecommendationsProps) {
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userSkills.length === 0) {
      setLoading(false);
      return;
    }

    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/skill-gap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skills: userSkills }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch analysis");
        }

        const data = await response.json();
        setAnalysis(data.analysis);
      } catch (err) {
        console.error("Error fetching skill gap analysis:", err);
        setError("Failed to analyze skill gaps");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [userSkills]);

  // No skills state
  if (userSkills.length === 0) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <Target className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Add Skills to Get Personalized Learning Recommendations
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Add your skills above to see which skills are in-demand and get
              personalized learning recommendations to unlock more job opportunities.
            </p>
            <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Powered by AI skill gap analysis</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 border shadow-sm">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <div className="text-center">
            <p className="font-medium text-gray-900">Analyzing job market...</p>
            <p className="text-sm text-gray-500">
              Comparing your skills with {userSkills.length} skills against job demands
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 rounded-xl p-6 border border-red-200">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  // Compact version for profile sidebar
  if (compact) {
    return <CompactView analysis={analysis} />;
  }

  // Full version
  return <FullView analysis={analysis} />;
}

// Compact view for profile page
function CompactView({ analysis }: { analysis: SkillGapAnalysis }) {
  const improvementPotential =
    analysis.potentialMatchAfterLearning - analysis.matchingJobs;

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Skill Gap Analysis
          </h3>
          <span className="text-2xl font-bold">{analysis.matchPercentage}%</span>
        </div>
        <p className="text-white/80 text-sm">
          Your skills match {analysis.matchingJobs} of {analysis.totalJobs} jobs
        </p>
        {improvementPotential > 0 && (
          <div className="mt-2 bg-white/20 rounded-lg px-3 py-2 text-sm">
            <Zap className="w-4 h-4 inline mr-1" />
            Learn 3 skills to unlock <strong>+{improvementPotential}</strong> more jobs!
          </div>
        )}
      </div>

      {/* Top Skill Gaps */}
      <div className="p-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-red-500" />
          Top Skills to Learn
        </h4>
        <div className="space-y-2">
          {analysis.skillGaps.slice(0, 3).map((gap) => (
            <div
              key={gap.skill}
              className={`flex items-center justify-between p-2 rounded-lg ${
                PRIORITY_COLORS[gap.priority].bg
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    gap.priority === "high"
                      ? "bg-red-500"
                      : gap.priority === "medium"
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                  }`}
                />
                <span className="font-medium text-gray-900 capitalize">
                  {gap.skill}
                </span>
              </div>
              <span className="text-xs text-gray-600">
                {gap.jobCount} jobs
              </span>
            </div>
          ))}
        </div>

        {/* Quick Learning CTA */}
        {analysis.recommendations.length > 0 && (
          <Link
            href="/learnings"
            className="mt-4 flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Start Learning
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

// Full detailed view
function FullView({ analysis }: { analysis: SkillGapAnalysis }) {
  const improvementPotential =
    analysis.potentialMatchAfterLearning - analysis.matchingJobs;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Skill Gap Analysis</h2>
            <p className="text-white/80 text-sm">
              Based on {analysis.totalJobs} active job listings
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold">{analysis.matchPercentage}%</div>
            <div className="text-white/70 text-sm">Current Match</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold">{analysis.matchingJobs}</div>
            <div className="text-white/70 text-sm">Matching Jobs</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-300">
              +{improvementPotential}
            </div>
            <div className="text-white/70 text-sm">Potential Jobs</div>
          </div>
        </div>

        {/* Improvement Banner */}
        {improvementPotential > 0 && (
          <div className="mt-4 bg-white/20 rounded-xl p-4 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-green-300" />
            <div>
              <p className="font-medium">
                Learn the top 3 recommended skills to unlock{" "}
                <span className="text-green-300 font-bold">
                  {improvementPotential} more job opportunities!
                </span>
              </p>
              <p className="text-white/70 text-sm">
                That&apos;s a{" "}
                {Math.round(
                  ((analysis.potentialMatchAfterLearning - analysis.matchingJobs) /
                    Math.max(analysis.matchingJobs, 1)) *
                    100
                )}
                % increase in job matches
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Skill Gaps */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-red-500" />
          Skills You&apos;re Missing
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {analysis.skillGaps.map((gap) => {
            const colors = PRIORITY_COLORS[gap.priority];
            return (
              <div
                key={gap.skill}
                className={`flex items-center justify-between p-3 rounded-lg border ${colors.bg} ${colors.border}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${colors.badge}`}
                  >
                    {gap.priority === "high" ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <Target className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {gap.skill}
                    </p>
                    <p className="text-xs text-gray-500">
                      {gap.percentage}% of jobs require this
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${colors.text}`}>{gap.jobCount}</p>
                  <p className="text-xs text-gray-500">jobs</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Learning Recommendations */}
      {analysis.recommendations.length > 0 && (
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Recommended Learning Paths
          </h3>

          <div className="space-y-6">
            {analysis.recommendations.map((rec) => (
              <div key={rec.skill} className="border-b pb-6 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        PRIORITY_COLORS[rec.priority].badge
                      }`}
                    >
                      {rec.priority === "high"
                        ? "🔥 High Priority"
                        : rec.priority === "medium"
                        ? "⚡ Medium"
                        : "💡 Good to Know"}
                    </span>
                    <h4 className="font-semibold text-gray-900 capitalize">
                      Learn {rec.skill}
                    </h4>
                  </div>
                  <span className="text-green-600 font-medium text-sm flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" />
                    +{rec.jobsUnlocked} jobs
                  </span>
                </div>

                {/* Learning Resources */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {rec.learningResources.map((resource) => (
                    <Link
                      key={resource.uid}
                      href={`/learnings/${resource.slug}`}
                      onClick={() =>
                        trackSkillLearningStart(rec.skill, resource.uid)
                      }
                      className="group bg-gray-50 hover:bg-indigo-50 rounded-lg p-3 transition-colors border hover:border-indigo-200"
                    >
                      <div className="relative aspect-video mb-2 rounded overflow-hidden bg-gray-200">
                        <img
                          src={`https://img.youtube.com/vi/${resource.youtube_video_id}/mqdefault.jpg`}
                          alt={resource.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                        {resource.duration && (
                          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {resource.duration}
                          </div>
                        )}
                      </div>
                      <h5 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-indigo-600">
                        {resource.title}
                      </h5>
                      <p className="text-xs text-gray-500 mt-1">
                        {resource.difficulty_level}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Ready to Level Up?
            </h3>
            <p className="text-white/80">
              Start with the highest priority skills to maximize your job matches
            </p>
          </div>
          <Link
            href="/learnings"
            className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            Browse All Courses
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

