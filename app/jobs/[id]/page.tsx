"use client";

import { useState } from "react";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building2, 
  Users, 
  Calendar,
  Share2,
  Bookmark,
  ArrowLeft,
  Send,
  Upload,
  FileText,
  ExternalLink
} from "lucide-react";
import { formatSalary, formatRelativeTime, formatDate } from "@/lib/utils";
import { Job } from "@/lib/types";

// Mock job data
const mockJob: Job = {
  id: "1",
  title: "Senior Frontend Developer",
  description: "We are looking for a Senior Frontend Developer to join our growing team. You will be responsible for building and maintaining high-quality user interfaces using modern web technologies. This role offers the opportunity to work on exciting projects and collaborate with a talented team of engineers and designers.",
  requirements: "• 5+ years of experience with React, TypeScript, and modern frontend technologies\n• Strong understanding of HTML, CSS, and JavaScript\n• Experience with state management libraries (Redux, Zustand)\n• Knowledge of testing frameworks (Jest, React Testing Library)\n• Experience with build tools (Webpack, Vite)\n• Strong problem-solving and communication skills\n• Bachelor's degree in Computer Science or related field preferred",
  responsibilities: "• Develop and maintain high-quality user interfaces\n• Collaborate with design team to implement pixel-perfect designs\n• Write clean, maintainable, and well-tested code\n• Participate in code reviews and technical discussions\n• Work closely with backend developers to integrate APIs\n• Optimize applications for maximum speed and scalability\n• Stay up-to-date with latest frontend technologies and best practices",
  company: {
    id: "1",
    name: "TechCorp",
    description: "Leading technology company focused on innovation and growth. We build products that make a difference in people's lives.",
    location: "San Francisco, CA",
    industry: "Technology",
    size: "1000+",
    founded: "2010",
    benefits: ["Health Insurance", "401k", "Flexible Hours", "Stock Options", "Learning Budget"],
    culture: "We foster a collaborative and inclusive environment where everyone can thrive.",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  location: "San Francisco, CA",
  type: "full-time",
  experience: "senior",
  salary: { min: 120000, max: 160000, currency: "USD", period: "yearly" },
  benefits: ["Health Insurance", "401k", "Flexible Hours", "Stock Options", "Learning Budget", "Remote Work"],
  skills: ["React", "TypeScript", "Next.js", "CSS", "JavaScript", "Redux", "Jest", "Webpack"],
  category: "Engineering",
  status: "active",
  postedAt: "2024-01-15",
  expiresAt: "2024-02-15",
  applicationsCount: 45,
  viewsCount: 234,
  isRemote: true,
  isUrgent: false,
  applicationUrl: "https://techcorp.com/careers",
  contactEmail: "careers@techcorp.com"
};

export default function JobDetailPage() {
  const [job] = useState<Job>(mockJob);
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
                    <p className="text-lg text-gray-600 mb-2">{job.company.name}</p>
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
                        <span>{formatRelativeTime(job.postedAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span>{formatSalary(job.salary)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Bookmark className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Job Details */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h2>
                  <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Responsibilities</h2>
                  <div className="text-gray-700 whitespace-pre-line">{job.responsibilities}</div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h2>
                  <div className="text-gray-700 whitespace-pre-line">{job.requirements}</div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Skills Required</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {job.benefits?.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Application Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply for this job</h3>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Applications:</span>
                    <span className="font-medium">{job.applicationsCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Views:</span>
                    <span className="font-medium">{job.viewsCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Posted:</span>
                    <span className="font-medium">{formatDate(job.postedAt)}</span>
                  </div>
                  {job.expiresAt && (
                    <div className="flex items-center justify-between">
                      <span>Expires:</span>
                      <span className="font-medium">{formatDate(job.expiresAt)}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors"
                >
                  Apply Now
                </button>
                {job.applicationUrl && (
                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-md font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Apply on Company Site
                  </a>
                )}
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About {job.company.name}</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Industry:</span>
                  <span className="text-gray-600 ml-2">{job.company.industry}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Company Size:</span>
                  <span className="text-gray-600 ml-2">{job.company.size} employees</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Location:</span>
                  <span className="text-gray-600 ml-2">{job.company.location}</span>
                </div>
                {job.company.founded && (
                  <div>
                    <span className="font-medium text-gray-900">Founded:</span>
                    <span className="text-gray-600 ml-2">{job.company.founded}</span>
                  </div>
                )}
              </div>
              <p className="text-gray-700 mt-4 text-sm">{job.company.description}</p>
              {job.company.culture && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Culture</h4>
                  <p className="text-gray-700 text-sm">{job.company.culture}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Application Form Modal */}
        {showApplicationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Apply for {job.title}</h2>
                  <button
                    onClick={() => setShowApplicationForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmitApplication} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter
                    </label>
                    <textarea
                      value={applicationData.coverLetter}
                      onChange={(e) => handleInputChange("coverLetter", e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us why you're interested in this position..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload your resume</p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleInputChange("resume", e.target.files?.[0] || null)}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label
                        htmlFor="resume-upload"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer"
                      >
                        Choose File
                      </label>
                      {applicationData.resume && (
                        <p className="text-sm text-gray-600 mt-2">
                          Selected: {applicationData.resume.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio/Website (Optional)
                    </label>
                    <input
                      type="url"
                      value={applicationData.portfolio}
                      onChange={(e) => handleInputChange("portfolio", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Salary (Optional)
                    </label>
                    <input
                      type="text"
                      value={applicationData.expectedSalary}
                      onChange={(e) => handleInputChange("expectedSalary", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., $120,000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability
                    </label>
                    <input
                      type="text"
                      value={applicationData.availability}
                      onChange={(e) => handleInputChange("availability", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Available immediately, 2 weeks notice"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Information (Optional)
                    </label>
                    <textarea
                      value={applicationData.additionalInfo}
                      onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any additional information you'd like to share..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Application
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
