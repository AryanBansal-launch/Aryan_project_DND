"use client";

import { useState } from "react";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar,
  FileText,
  Eye,
  Download,
  MessageSquare
} from "lucide-react";
import { Application } from "@/lib/types";
import { formatDate, formatRelativeTime } from "@/lib/utils";

// Mock application data
const mockApplications: Application[] = [
  {
    id: "1",
    jobId: "1",
    userId: "1",
    status: "submitted",
    coverLetter: "I am very interested in this position and believe my skills align perfectly with your requirements...",
    expectedSalary: 130000,
    availability: "Available immediately",
    additionalInfo: "I have 5+ years of experience in React and TypeScript",
    appliedAt: "2024-01-16T10:30:00Z",
    updatedAt: "2024-01-16T10:30:00Z",
    notes: "Strong candidate with relevant experience"
  },
  {
    id: "2",
    jobId: "2",
    userId: "1",
    status: "reviewed",
    coverLetter: "I am excited about the opportunity to contribute to your product team...",
    expectedSalary: 120000,
    availability: "2 weeks notice",
    additionalInfo: "Previous experience in product management",
    appliedAt: "2024-01-15T14:20:00Z",
    updatedAt: "2024-01-16T09:15:00Z",
    notes: "Application reviewed, moving to next stage"
  },
  {
    id: "3",
    jobId: "3",
    userId: "1",
    status: "shortlisted",
    coverLetter: "I am passionate about creating great user experiences...",
    expectedSalary: 90000,
    availability: "Available immediately",
    additionalInfo: "Portfolio available at johndoe.design",
    appliedAt: "2024-01-14T16:45:00Z",
    updatedAt: "2024-01-17T11:30:00Z",
    notes: "Shortlisted for interview",
    interviewScheduled: {
      date: "2024-01-20",
      time: "14:00",
      type: "video",
      interviewer: "Sarah Johnson"
    }
  },
  {
    id: "4",
    jobId: "4",
    userId: "1",
    status: "interview",
    coverLetter: "I am interested in joining your engineering team...",
    expectedSalary: 140000,
    availability: "1 week notice",
    additionalInfo: "Open source contributor",
    appliedAt: "2024-01-12T09:15:00Z",
    updatedAt: "2024-01-18T13:45:00Z",
    notes: "Interview completed, awaiting feedback"
  },
  {
    id: "5",
    jobId: "5",
    userId: "1",
    status: "rejected",
    coverLetter: "I would like to apply for this position...",
    expectedSalary: 110000,
    availability: "Available immediately",
    additionalInfo: "Recent graduate with internship experience",
    appliedAt: "2024-01-10T11:30:00Z",
    updatedAt: "2024-01-15T16:20:00Z",
    notes: "Not selected for this role"
  }
];

const mockJobDetails = {
  "1": { title: "Senior Frontend Developer", company: "TechCorp" },
  "2": { title: "Product Manager", company: "StartupXYZ" },
  "3": { title: "UX Designer", company: "DesignStudio" },
  "4": { title: "Backend Developer", company: "DataFlow" },
  "5": { title: "Junior Developer", company: "CodeCraft" }
};

export default function ApplicationsPage() {
  const [applications] = useState<Application[]>(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'reviewed':
        return <Eye className="w-5 h-5 text-purple-500" />;
      case 'shortlisted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'interview':
        return <Calendar className="w-5 h-5 text-orange-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'hired':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'reviewed':
        return 'bg-purple-100 text-purple-800';
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'interview':
        return 'bg-orange-100 text-orange-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'hired':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(app => 
    statusFilter === "all" || app.status === statusFilter
  );

  const statusCounts = {
    all: applications.length,
    submitted: applications.filter(app => app.status === 'submitted').length,
    reviewed: applications.filter(app => app.status === 'reviewed').length,
    shortlisted: applications.filter(app => app.status === 'shortlisted').length,
    interview: applications.filter(app => app.status === 'interview').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    hired: applications.filter(app => app.status === 'hired').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track the status of your job applications</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications List */}
          <div className="lg:col-span-2">
            {/* Status Filter */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Status</h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusCounts).map(([status, count]) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      statusFilter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                  </button>
                ))}
              </div>
            </div>

            {/* Applications */}
            <div className="space-y-4">
              {filteredApplications.map((application) => {
                const jobDetails = mockJobDetails[application.jobId as keyof typeof mockJobDetails];
                
                return (
                  <div
                    key={application.id}
                    className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6 cursor-pointer"
                    onClick={() => setSelectedApplication(application)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(application.status)}
                          <h3 className="text-lg font-semibold text-gray-900">
                            {jobDetails?.title}
                          </h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{jobDetails?.company}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>Applied {formatRelativeTime(application.appliedAt)}</span>
                          </div>
                          {application.expectedSalary && (
                            <div className="flex items-center">
                              <span>Expected: ${application.expectedSalary.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                        {application.interviewScheduled && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-md">
                            <div className="flex items-center text-sm text-blue-800">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>
                                Interview scheduled for {formatDate(application.interviewScheduled.date)} at {application.interviewScheduled.time}
                              </span>
                            </div>
                            <div className="text-sm text-blue-600 mt-1">
                              {application.interviewScheduled.type.charAt(0).toUpperCase() + application.interviewScheduled.type.slice(1)} interview with {application.interviewScheduled.interviewer}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          Updated {formatRelativeTime(application.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredApplications.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600">No applications match your current filter criteria</p>
              </div>
            )}
          </div>

          {/* Application Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedApplication ? (
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                    <div className="flex items-center">
                      {getStatusIcon(selectedApplication.status)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedApplication.status)}`}>
                        {selectedApplication.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Applied Date</h4>
                    <p className="text-gray-900">{formatDate(selectedApplication.appliedAt)}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Last Updated</h4>
                    <p className="text-gray-900">{formatDate(selectedApplication.updatedAt)}</p>
                  </div>

                  {selectedApplication.expectedSalary && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Expected Salary</h4>
                      <p className="text-gray-900">${selectedApplication.expectedSalary.toLocaleString()}</p>
                    </div>
                  )}

                  {selectedApplication.availability && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Availability</h4>
                      <p className="text-gray-900">{selectedApplication.availability}</p>
                    </div>
                  )}

                  {selectedApplication.additionalInfo && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Information</h4>
                      <p className="text-gray-900 text-sm">{selectedApplication.additionalInfo}</p>
                    </div>
                  )}

                  {selectedApplication.coverLetter && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Cover Letter</h4>
                      <div className="bg-gray-50 rounded-md p-3">
                        <p className="text-gray-900 text-sm">{selectedApplication.coverLetter}</p>
                      </div>
                    </div>
                  )}

                  {selectedApplication.interviewScheduled && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Interview Details</h4>
                      <div className="bg-blue-50 rounded-md p-3">
                        <div className="text-sm text-blue-900">
                          <div className="flex items-center mb-1">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{formatDate(selectedApplication.interviewScheduled.date)}</span>
                          </div>
                          <div className="flex items-center mb-1">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{selectedApplication.interviewScheduled.time}</span>
                          </div>
                          <div className="flex items-center mb-1">
                            <span className="w-4 h-4 mr-2 flex items-center justify-center">
                              📹
                            </span>
                            <span>{selectedApplication.interviewScheduled.type}</span>
                          </div>
                          {selectedApplication.interviewScheduled.interviewer && (
                            <div className="flex items-center">
                              <span className="w-4 h-4 mr-2 flex items-center justify-center">
                                👤
                              </span>
                              <span>{selectedApplication.interviewScheduled.interviewer}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedApplication.notes && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
                      <div className="bg-yellow-50 rounded-md p-3">
                        <p className="text-gray-900 text-sm">{selectedApplication.notes}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium text-sm">
                      <MessageSquare className="w-4 h-4 mr-2 inline" />
                      Contact HR
                    </button>
                    <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md font-medium text-sm">
                      <Download className="w-4 h-4 mr-2 inline" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">Select an Application</h3>
                <p className="text-sm text-gray-600">Click on an application to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
