"use client";

import { useState } from "react";
import { 
  MapPin, 
  Clock, 
  Building2,
  Share2,
  Bookmark,
  ArrowLeft,
  Send,
  Upload,
  ExternalLink
} from "lucide-react";
import { formatSalary, formatRelativeTime } from "@/lib/utils";
import { Job } from "@/lib/types";

interface JobDetailClientProps {
  job: Job;
}

export default function JobDetailClient({ job }: JobDetailClientProps) {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    resume: null as File | null,
    portfolio: "",
    expectedSalary: "",
    availability: "",
    additionalInfo: ""
  });

  const handleInputChange = (field: string, value: string | File | null) => {
    setApplicationData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting application:", applicationData);
    // In a real app, this would submit to an API
    alert("Application submitted successfully!");
    setShowApplicationForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button 
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Jobs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              {/* Job Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-gray-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                    <p className="text-lg text-gray-700 mb-2">{job.company.name}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{job.location}</span>
                        {job.isRemote && (
                          <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Remote
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Posted {formatRelativeTime(job.postedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 border rounded-md">
                    <Bookmark className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 border rounded-md">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Job Type</p>
                  <p className="font-medium capitalize">{job.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Experience</p>
                  <p className="font-medium capitalize">{job.experience}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Salary</p>
                  <p className="font-medium">{job.salary ? formatSalary(job.salary) : "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Category</p>
                  <p className="font-medium">{job.category}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h2>
                <div 
                  className="text-gray-700 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </div>

              {/* Requirements */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h2>
                <div 
                  className="text-gray-700 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: job.requirements }}
                />
              </div>

              {/* Responsibilities */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Responsibilities</h2>
                <div 
                  className="text-gray-700 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: job.responsibilities }}
                />
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.benefits.map((benefit, index) => (
                      <span key={index} className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Application Form */}
            {showApplicationForm && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Apply for this Position</h2>
                <form onSubmit={handleSubmitApplication} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Letter *
                    </label>
                    <textarea
                      value={applicationData.coverLetter}
                      onChange={(e) => handleInputChange("coverLetter", e.target.value)}
                      rows={6}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us why you're a great fit for this role..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resume *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        onChange={(e) => handleInputChange("resume", e.target.files?.[0] || null)}
                        accept=".pdf,.doc,.docx"
                        required
                        className="w-full"
                      />
                      <p className="text-sm text-gray-500 mt-2">PDF, DOC, or DOCX (Max 5MB)</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Portfolio/Website
                    </label>
                    <input
                      type="url"
                      value={applicationData.portfolio}
                      onChange={(e) => handleInputChange("portfolio", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="https://"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expected Salary
                      </label>
                      <input
                        type="text"
                        value={applicationData.expectedSalary}
                        onChange={(e) => handleInputChange("expectedSalary", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="$XX,XXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Availability
                      </label>
                      <input
                        type="text"
                        value={applicationData.availability}
                        onChange={(e) => handleInputChange("availability", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 2 weeks notice"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Information
                    </label>
                    <textarea
                      value={applicationData.additionalInfo}
                      onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Any additional information you'd like to share..."
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium flex items-center"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Submit Application
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="text-gray-600 hover:text-gray-800 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">About {job.company.name}</h2>
              </div>
              <p className="text-gray-700 mb-4">{job.company.description}</p>
              {job.company.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Visit Website
                </a>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Apply</h2>
              {!showApplicationForm && (
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md font-medium"
                >
                  Apply Now
                </button>
              )}
              {job.applicationUrl && (
                <a
                  href={job.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-md font-medium mt-3"
                >
                  Apply on Company Site
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

