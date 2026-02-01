"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Target, Users, Sparkles, TrendingUp, Bell, Search, Brain, BarChart3 } from "lucide-react";

export default function PRDClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/docs"
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documentation
          </Link>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-14 h-14 bg-white/20 rounded-full">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Product Requirements Document</h1>
                <p className="text-green-100 mt-1">JobDekho - AI-Powered Job Discovery Platform</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div><strong>Version:</strong> 2.0</div>
              <div><strong>Last Updated:</strong> January 2026</div>
              <div><strong>Author:</strong> Aryan Bansal</div>
              <div><strong>Status:</strong> Production Ready</div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-12">
            {/* Executive Summary */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Executive Summary</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>JobDekho</strong> is an AI-powered job discovery platform that revolutionizes how job seekers find opportunities 
                and employers connect with talent. Built on a modern composable architecture, the platform combines intelligent search, 
                real-time personalization, skill gap analysis, and automated workflows to deliver a seamless hiring experience.
              </p>
            </section>

            {/* Key Differentiators */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-green-600" />
                Key Differentiators
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Intelligent Search (Algolia)</h3>
                  <p className="text-sm text-gray-700">Fuzzy matching, typo tolerance, and instant results</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">Behavior-Based Personalization</h3>
                  <p className="text-sm text-gray-700">Real-time content adaptation using Lytics + Personalize</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">Location-Based Recommendations</h3>
                  <p className="text-sm text-gray-700">Prioritize local jobs using Launch geolocation</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-900 mb-2">Skill Gap Analysis</h3>
                  <p className="text-sm text-gray-700">Identify missing skills and recommend learning resources</p>
                </div>
              </div>
            </section>

            {/* Business Goals */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-green-600" />
                Business Goals
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">60%</div>
                  <p className="text-gray-700">Reduce time to find relevant jobs through intelligent search and personalization</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">40%</div>
                  <p className="text-gray-700">Increase application quality through skill-based matching</p>
                </div>
              </div>
            </section>

            {/* Problem Statement */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Problem Statement</h2>

              <div className="space-y-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <h3 className="font-semibold text-red-900 mb-2">For Job Seekers</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Information overload without personalized filtering</li>
                    <li>• Generic job suggestions not matching skills/interests</li>
                    <li>• Missing out on relevant opportunities</li>
                    <li>• No insight into skill gaps</li>
                    <li>• Location mismatch in job recommendations</li>
                  </ul>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                  <h3 className="font-semibold text-orange-900 mb-2">For Employers</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Low quality applications from unqualified candidates</li>
                    <li>• No automated way to notify interested candidates</li>
                    <li>• Unable to personalize job listings for different segments</li>
                    <li>• Difficulty reaching the right candidates</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Target Users */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Users className="w-6 h-6 text-green-600" />
                Target Users
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Job Seekers (Primary)</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Active seekers</li>
                    <li>• Passive candidates</li>
                    <li>• First-time users</li>
                    <li>• Returning visitors</li>
                    <li>• Career changers</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">Employers (Secondary)</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Recruiters</li>
                    <li>• HR managers</li>
                    <li>• Hiring managers</li>
                    <li>• Company admins</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Administrators</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Content admins</li>
                    <li>• System admins</li>
                    <li>• Platform managers</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Core Features */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Core Features</h2>

              <div className="space-y-6">
                {/* Job Discovery & Search */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Search className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-semibold text-blue-900">Job Discovery & Search</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Full-Text Search</h4>
                      <p className="text-sm text-gray-700">Search by title, skills, description with instant results powered by Algolia</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Advanced Filtering</h4>
                      <p className="text-sm text-gray-700">Filter by location, job type, experience level, salary range, and category</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Skill-Based Recommendations</h4>
                      <p className="text-sm text-gray-700">Get personalized job recommendations based on skills in your profile</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Location-Based Results</h4>
                      <p className="text-sm text-gray-700">Automatically detect location and prioritize local jobs</p>
                    </div>
                  </div>
                </div>

                {/* Personalization Engine */}
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="w-6 h-6 text-purple-600" />
                    <h3 className="text-xl font-semibold text-purple-900">Personalization Engine</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Behavior Tracking (Lytics)</h4>
                      <p className="text-sm text-gray-700">Track job views, blog reads, and searches to build interest profiles</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">User Segmentation</h4>
                      <p className="text-sm text-gray-700">Automatic segmentation: first-time, returning, tech seekers, ready-to-apply</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Personalized Banners</h4>
                      <p className="text-sm text-gray-700">Dynamic banners powered by Contentstack Personalize Edge SDK</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Recommended For You</h4>
                      <p className="text-sm text-gray-700">Homepage section showing jobs tailored to browsing history</p>
                    </div>
                  </div>
                </div>

                {/* Skill Gap Analysis */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-semibold text-green-900">Skill Gap Analysis</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Job Market Analysis</h4>
                      <p className="text-sm text-gray-700">Analyze all job listings to identify most in-demand skills</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Match Percentage</h4>
                      <p className="text-sm text-gray-700">Calculate how well your skills match current job market demand</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Gap Identification</h4>
                      <p className="text-sm text-gray-700">Identify missing skills prioritized by job count impact</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Learning Recommendations</h4>
                      <p className="text-sm text-gray-700">Suggest relevant learning resources for each skill gap</p>
                    </div>
                  </div>
                </div>

                {/* Notifications & Alerts */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Bell className="w-6 h-6 text-orange-600" />
                    <h3 className="text-xl font-semibold text-orange-900">Notifications & Alerts</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">New Job Email Alerts</h4>
                      <p className="text-sm text-gray-700">Automatic email notifications when new jobs are published</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">In-App Notifications</h4>
                      <p className="text-sm text-gray-700">Real-time notification dropdown powered by Contentstack</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Application Confirmation</h4>
                      <p className="text-sm text-gray-700">Instant email confirmation via Contentstack Automate</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Status Updates</h4>
                      <p className="text-sm text-gray-700">Email notifications when application status changes</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Success Metrics */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-green-600" />
                Success Metrics
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">&gt; 3 min</div>
                  <div className="text-sm text-gray-600">Session Duration</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">&gt; 5</div>
                  <div className="text-sm text-gray-600">Jobs Viewed/Session</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">&gt; 40%</div>
                  <div className="text-sm text-gray-600">Return Rate</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">&gt; 5%</div>
                  <div className="text-sm text-gray-600">Application Rate</div>
                </div>
              </div>
            </section>

            {/* User Journeys */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key User Journeys</h2>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">First-Time User Journey</h3>
                  <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                    <li>User lands on homepage → BehaviorTracker initializes</li>
                    <li>Views job listings → trackJobView() called</li>
                    <li>Views 3 jobs without applying → &ldquo;Ready to Apply&rdquo; banner appears</li>
                    <li>Creates account → Email/password or Google OAuth</li>
                    <li>Adds skills to profile → Skills saved to NeonDB</li>
                    <li>Gets personalized recommendations → RecommendedForYou component</li>
                  </ol>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Skill Gap Learning Journey</h3>
                  <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                    <li>User views profile page → SkillGapRecommendations loads</li>
                    <li>Skill gap analysis runs → Compares user skills with market</li>
                    <li>Results displayed → &ldquo;Your Job Market Match: 35%&rdquo;</li>
                    <li>User clicks &ldquo;Browse Learnings&rdquo; → Redirected to Learning Hub</li>
                    <li>User watches tutorial → trackLearningView() called</li>
                    <li>User adds new skill → Match percentage increases</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* Future Enhancements */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Future Enhancements</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Resume Builder</h3>
                  <p className="text-sm text-gray-600">AI-powered resume creation tool</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Interview Preparation</h3>
                  <p className="text-sm text-gray-600">Mock interviews and practice questions</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Salary Insights</h3>
                  <p className="text-sm text-gray-600">Market salary data for roles and locations</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Mobile App</h3>
                  <p className="text-sm text-gray-600">Native iOS and Android applications</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
