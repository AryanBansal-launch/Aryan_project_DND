"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Briefcase, 
  Building2, 
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter
} from "lucide-react";
import DataTable, { Column, Action } from "@/components/DataTable";
import JobCreationModal from "@/components/JobCreationModal";

interface Stats {
  totalJobs: number;
  activeJobs: number;
  totalCompanies: number;
  totalUsers: number;
  applicationsThisMonth: number;
  jobsPostedThisMonth: number;
}

interface RecentJob {
  id: string;
  title: string;
  company: string;
  status: string;
  applications: number;
  views: number;
  postedAt: string;
}

interface RecentApplication {
  id: string;
  jobTitle: string;
  company: string;
  applicantName: string;
  applicantEmail: string;
  status: string;
  appliedAt: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [allApplications, setAllApplications] = useState<any[]>([]);
  const [allCompanies, setAllCompanies] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [companies, setCompanies] = useState<Array<{ uid: string; title: string }>>([]);

  const formatDate = (date: string | Date) => {
    if (!date) return "N/A";
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Fetch admin stats
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentJobs(data.recentJobs || []);
        setRecentApplications(data.recentApplications || []);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fetch all jobs
  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setAllJobs(data.allJobs || []);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // Fetch all applications
  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        // For now, we'll use recent applications. Later we can add a dedicated endpoint
        setAllApplications(data.recentApplications || []);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  // Fetch all companies
  const fetchCompanies = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setAllCompanies(data.companies || []);
        setCompanies(data.companies || []);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setAllUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchJobs(),
        fetchCompanies()
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === "applications") {
      fetchApplications();
    } else if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  const handleJobCreated = () => {
    fetchStats();
    fetchJobs();
  };

  // Filter jobs based on search query
  const filteredJobs = allJobs
    .map((job: any) => ({
      ...job,
      id: job.uid,
      company: Array.isArray(job.company) && job.company[0]
        ? job.company[0].title
        : (typeof job.company === 'object' && job.company?.title) || 'Unknown Company'
    }))
    .filter((job) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        job.title?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query) ||
        (typeof job.company === 'string' && job.company.toLowerCase().includes(query)) ||
        job.category?.toLowerCase().includes(query)
      );
    });

  // Job columns
  const jobColumns: Column<any>[] = [
    {
      key: "title",
      label: "Job Title",
      render: (job) => (
        <div className="text-sm font-medium text-gray-900">{job.title}</div>
      )
    },
    {
      key: "company",
      label: "Company",
      render: (job) => (
        <div className="text-sm text-gray-900">
          {typeof job.company === 'string' 
            ? job.company
            : (Array.isArray(job.company) && job.company[0]
              ? job.company[0].title
              : (typeof job.company === 'object' && job.company?.title) || 'Unknown')}
        </div>
      )
    },
    {
      key: "location",
      label: "Location"
    },
    {
      key: "status",
      label: "Status"
    },
    {
      key: "applications_count",
      label: "Applications",
      render: (job) => (
        <div className="text-sm text-gray-900">{job.applications_count || 0}</div>
      )
    },
    {
      key: "posted_at",
      label: "Posted",
      render: (job) => (
        <div className="text-sm text-gray-500">{formatDate(job.posted_at || job.created_at)}</div>
      )
    }
  ];

  // Job actions
  const jobActions: Action<any>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      label: "View",
      onClick: (job) => window.open(`/jobs/${job.uid}`, '_blank'),
      className: "text-blue-600 hover:text-blue-900"
    },
    {
      icon: <Edit className="w-4 h-4" />,
      label: "Edit",
      onClick: (job) => {
        // TODO: Implement edit functionality
        console.log("Edit job:", job);
      },
      className: "text-gray-600 hover:text-gray-900"
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      label: "Delete",
      onClick: (job) => {
        // TODO: Implement delete functionality
        if (confirm(`Are you sure you want to delete "${job.title}"?`)) {
          console.log("Delete job:", job);
        }
      },
      className: "text-red-600 hover:text-red-900"
    }
  ];

  // Application columns
  const applicationColumns: Column<any>[] = [
    {
      key: "applicant",
      label: "Applicant",
      render: (app) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{app.applicantName || app.user_name}</div>
          <div className="text-sm text-gray-500">{app.applicantEmail || app.email}</div>
        </div>
      )
    },
    {
      key: "jobTitle",
      label: "Job Title",
      render: (app) => (
        <div className="text-sm text-gray-900">{app.jobTitle || app.job_title}</div>
      )
    },
    {
      key: "company",
      label: "Company",
      render: (app) => (
        <div className="text-sm text-gray-900">{app.company || app.company_name}</div>
      )
    },
    {
      key: "status",
      label: "Status"
    },
    {
      key: "appliedAt",
      label: "Applied",
      render: (app) => (
        <div className="text-sm text-gray-500">{formatDate(app.appliedAt || app.created_at)}</div>
      )
    }
  ];

  // Application actions
  const applicationActions: Action<any>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      label: "View",
      onClick: (app) => {
        // TODO: Implement view application details
        console.log("View application:", app);
      },
      className: "text-blue-600 hover:text-blue-900"
    },
    {
      icon: <Edit className="w-4 h-4" />,
      label: "Edit Status",
      onClick: (app) => {
        // TODO: Implement edit status
        console.log("Edit application status:", app);
      },
      className: "text-gray-600 hover:text-gray-900"
    }
  ];

  // Company columns
  const companyColumns: Column<any>[] = [
    {
      key: "title",
      label: "Company Name",
      render: (company) => (
        <div className="text-sm font-medium text-gray-900">{company.title}</div>
      )
    },
    {
      key: "location",
      label: "Location"
    },
    {
      key: "industry",
      label: "Industry"
    },
    {
      key: "size",
      label: "Size"
    }
  ];

  // Company actions
  const companyActions: Action<any>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      label: "View",
      onClick: (company) => window.open(`/companies/${company.uid}`, '_blank'),
      className: "text-blue-600 hover:text-blue-900"
    },
    {
      icon: <Edit className="w-4 h-4" />,
      label: "Edit",
      onClick: (company) => {
        // TODO: Implement edit functionality
        console.log("Edit company:", company);
      },
      className: "text-gray-600 hover:text-gray-900"
    }
  ];

  // User columns
  const userColumns: Column<any>[] = [
    {
      key: "name",
      label: "Name",
      render: (user) => (
        <div className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</div>
      )
    },
    {
      key: "email",
      label: "Email",
      render: (user) => (
        <div className="text-sm text-gray-900">{user.email}</div>
      )
    },
    {
      key: "created_at",
      label: "Joined",
      render: (user) => (
        <div className="text-sm text-gray-500">{formatDate(user.created_at)}</div>
      )
    }
  ];

  // User actions
  const userActions: Action<any>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      label: "View",
      onClick: (user) => {
        // TODO: Implement view user details
        console.log("View user:", user);
      },
      className: "text-blue-600 hover:text-blue-900"
    },
    {
      icon: <Edit className="w-4 h-4" />,
      label: "Edit",
      onClick: (user) => {
        // TODO: Implement edit user
        console.log("Edit user:", user);
      },
      className: "text-gray-600 hover:text-gray-900"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage jobs, companies, and applications</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "jobs", label: "Jobs" },
              { id: "companies", label: "Companies" },
              { id: "applications", label: "Applications" },
              { id: "users", label: "Users" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalJobs || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Building2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Companies</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalCompanies || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Users</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Applications</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.applicationsThisMonth || 0}</p>
                      <p className="text-xs text-gray-500">This month</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Jobs */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Jobs</h3>
                <button
                  onClick={() => setActiveTab("jobs")}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  View All
                </button>
              </div>
              <DataTable
                columns={jobColumns}
                data={recentJobs}
                actions={jobActions}
                loading={loading}
                emptyMessage="No recent jobs"
              />
            </div>

            {/* Recent Applications */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
                <button
                  onClick={() => setActiveTab("applications")}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  View All
                </button>
              </div>
              <DataTable
                columns={applicationColumns}
                data={recentApplications}
                actions={applicationActions}
                loading={loading}
                emptyMessage="No recent applications"
              />
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Job Management</h2>
                <button
                  onClick={() => setIsJobModalOpen(true)}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Job
                </button>
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </button>
              </div>

              <DataTable
                columns={jobColumns}
                data={filteredJobs}
                actions={jobActions}
                loading={loading}
                emptyMessage="No jobs found"
              />
            </div>
          </div>
        )}

        {/* Companies Tab */}
        {activeTab === "companies" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Management</h2>
              <DataTable
                columns={companyColumns}
                data={allCompanies}
                actions={companyActions}
                loading={loading}
                emptyMessage="No companies found"
              />
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Management</h2>
              <DataTable
                columns={applicationColumns}
                data={allApplications}
                actions={applicationActions}
                loading={loading}
                emptyMessage="No applications found"
              />
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              <DataTable
                columns={userColumns}
                data={allUsers.filter((user) => {
                  if (!searchQuery) return true;
                  const query = searchQuery.toLowerCase();
                  return (
                    user.name?.toLowerCase().includes(query) ||
                    user.email?.toLowerCase().includes(query)
                  );
                })}
                actions={userActions}
                loading={loading}
                emptyMessage="No users found"
              />
            </div>
          </div>
        )}
      </div>

      {/* Job Creation Modal */}
      <JobCreationModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        onSuccess={handleJobCreated}
        companies={companies}
      />
    </div>
  );
}
