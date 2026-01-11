"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar,
  FileText,
  Eye,
  Trash2,
  Loader2,
  Briefcase,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface ApplicationData {
  id?: number;
  application_id: string;
  email: string;
  user_name: string;
  job_id: string;
  job_title: string;
  company_name: string;
  status: 'submitted' | 'reviewed' | 'shortlisted' | 'interview' | 'rejected' | 'hired';
  cover_letter?: string;
  portfolio?: string;
  expected_salary?: string;
  availability?: string;
  additional_info?: string;
  resume_file_name?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Wrapper component with Suspense for useSearchParams
export default function ApplicationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your applications...</p>
        </div>
      </div>
    }>
      <ApplicationsContent />
    </Suspense>
  );
}

function ApplicationsContent() {
  const { status: authStatus } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('highlight');
  
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  
  // Refs for scrolling to highlighted application
  const applicationRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/applications');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch applications');
      }
      
      setApplications(data.applications || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    if (authStatus === 'authenticated') {
      fetchApplications();
    } else if (authStatus === 'unauthenticated') {
      router.push('/login?callbackUrl=/applications');
    }
  }, [authStatus, router]);

  // Handle highlighting from notification CTA
  useEffect(() => {
    if (highlightId && applications.length > 0) {
      // Find the application to highlight
      const appToHighlight = applications.find(app => app.application_id === highlightId);
      
      if (appToHighlight) {
        // Auto-select the application
        setSelectedApplication(appToHighlight);
        setHighlightedId(highlightId);
        
        // Scroll to the application after a short delay (for DOM to be ready)
        setTimeout(() => {
          const element = applicationRefs.current.get(highlightId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
        
        // Remove highlight after animation (5 seconds)
        setTimeout(() => {
          setHighlightedId(null);
          // Clear the URL parameter without reloading
          router.replace('/applications', { scroll: false });
        }, 5000);
      }
    }
  }, [highlightId, applications, router]);

  // Withdraw/Delete application
  const handleWithdraw = async (applicationId: string) => {
    if (!confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsDeleting(applicationId);
      
      const response = await fetch(`/api/applications?id=${applicationId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to withdraw application');
      }
      
      // Remove from local state
      setApplications(prev => prev.filter(app => app.application_id !== applicationId));
      
      if (selectedApplication?.application_id === applicationId) {
        setSelectedApplication(null);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsDeleting(null);
    }
  };

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  // Loading state
  if (authStatus === 'loading' || (authStatus === 'authenticated' && isLoading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (authStatus === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
            <p className="text-gray-600">Track the status of your job applications</p>
          </div>
          <button
            onClick={fetchApplications}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <p>{error}</p>
            <button 
              onClick={fetchApplications}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State - No Applications */}
        {applications.length === 0 && !error ? (
          <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No applications yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven&apos;t applied to any jobs yet. Start exploring opportunities and submit your first application!
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Jobs
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        ) : (
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
                {filteredApplications.map((application) => (
                  <div
                    key={application.application_id}
                    ref={(el) => {
                      if (el) {
                        applicationRefs.current.set(application.application_id, el);
                      } else {
                        applicationRefs.current.delete(application.application_id);
                      }
                    }}
                    className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-all p-6 cursor-pointer ${
                      selectedApplication?.application_id === application.application_id ? 'ring-2 ring-blue-500' : ''
                    } ${
                      highlightedId === application.application_id 
                        ? 'ring-2 ring-green-500 bg-green-50 animate-pulse' 
                        : ''
                    }`}
                    onClick={() => setSelectedApplication(application)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(application.status)}
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.job_title}
                          </h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{application.company_name}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>Applied {formatRelativeTime(application.created_at || '')}</span>
                          </div>
                          {application.expected_salary && (
                            <div className="flex items-center">
                              <span>Expected: {application.expected_salary}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <div className="text-sm text-gray-500">
                          ID: {application.application_id.slice(0, 12)}...
                        </div>
                        {application.status === 'submitted' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWithdraw(application.application_id);
                            }}
                            disabled={isDeleting === application.application_id}
                            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                          >
                            {isDeleting === application.application_id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            Withdraw
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State for Filter */}
              {filteredApplications.length === 0 && applications.length > 0 && (
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
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Job Title</h4>
                      <p className="text-gray-900 font-medium">{selectedApplication.job_title}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Company</h4>
                      <p className="text-gray-900">{selectedApplication.company_name}</p>
                    </div>

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
                      <p className="text-gray-900">{formatDate(selectedApplication.created_at)}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Application ID</h4>
                      <p className="text-gray-600 text-sm font-mono">{selectedApplication.application_id}</p>
                    </div>

                    {selectedApplication.expected_salary && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Expected Salary</h4>
                        <p className="text-gray-900">{selectedApplication.expected_salary}</p>
                      </div>
                    )}

                    {selectedApplication.availability && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Availability</h4>
                        <p className="text-gray-900">{selectedApplication.availability}</p>
                      </div>
                    )}

                    {selectedApplication.portfolio && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Portfolio</h4>
                        <a 
                          href={selectedApplication.portfolio} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {selectedApplication.portfolio}
                        </a>
                      </div>
                    )}

                    {selectedApplication.additional_info && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Information</h4>
                        <p className="text-gray-900 text-sm">{selectedApplication.additional_info}</p>
                      </div>
                    )}

                    {selectedApplication.cover_letter && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Cover Letter</h4>
                        <div className="bg-gray-50 rounded-md p-3 max-h-40 overflow-y-auto">
                          <p className="text-gray-900 text-sm whitespace-pre-wrap">{selectedApplication.cover_letter}</p>
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
                      <Link 
                        href={`/jobs/${selectedApplication.job_id}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium text-sm text-center"
                      >
                        View Job
                      </Link>
                      {selectedApplication.status === 'submitted' && (
                        <button 
                          onClick={() => handleWithdraw(selectedApplication.application_id)}
                          disabled={isDeleting === selectedApplication.application_id}
                          className="flex-1 border border-red-300 hover:bg-red-50 text-red-700 py-2 px-4 rounded-md font-medium text-sm flex items-center justify-center gap-2"
                        >
                          {isDeleting === selectedApplication.application_id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          Withdraw
                        </button>
                      )}
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
        )}
      </div>
    </div>
  );
}
