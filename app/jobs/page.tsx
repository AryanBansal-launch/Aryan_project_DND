"use client";

import { useState } from "react";
import { 
  Search, 
  MapPin, 
  Filter, 
  Clock, 
  DollarSign, 
  Building2,
  Bookmark,
  Share2,
  Eye
} from "lucide-react";
import { formatSalary, formatRelativeTime } from "@/lib/utils";
import { Job, JobSearchFilters } from "@/lib/types";

// Mock data for demonstration
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    description: "We are looking for a Senior Frontend Developer to join our growing team...",
    requirements: "5+ years of experience with React, TypeScript, and modern frontend technologies...",
    responsibilities: "Develop and maintain high-quality user interfaces, collaborate with design team...",
    company: {
      id: "1",
      name: "TechCorp",
      description: "Leading technology company",
      location: "San Francisco, CA",
      industry: "Technology",
      size: "1000+",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01"
    },
    location: "San Francisco, CA",
    type: "full-time",
    experience: "senior",
    salary: { min: 120000, max: 160000, currency: "USD", period: "yearly" },
    benefits: ["Health Insurance", "401k", "Flexible Hours"],
    skills: ["React", "TypeScript", "Next.js", "CSS", "JavaScript"],
    category: "Engineering",
    status: "active",
    postedAt: "2024-01-15",
    applicationsCount: 45,
    viewsCount: 234,
    isRemote: true,
    isUrgent: false
  },
  {
    id: "2",
    title: "Product Manager",
    description: "Join our product team to drive innovation and growth...",
    requirements: "3+ years of product management experience, strong analytical skills...",
    responsibilities: "Define product strategy, work with engineering teams, analyze user feedback...",
    company: {
      id: "2",
      name: "StartupXYZ",
      description: "Fast-growing startup",
      location: "New York, NY",
      industry: "Technology",
      size: "50-200",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01"
    },
    location: "New York, NY",
    type: "full-time",
    experience: "mid",
    salary: { min: 100000, max: 140000, currency: "USD", period: "yearly" },
    benefits: ["Stock Options", "Health Insurance", "Remote Work"],
    skills: ["Product Strategy", "Agile", "Analytics", "User Research"],
    category: "Product",
    status: "active",
    postedAt: "2024-01-14",
    applicationsCount: 32,
    viewsCount: 189,
    isRemote: false,
    isUrgent: true
  },
  {
    id: "3",
    title: "UX Designer",
    description: "Create amazing user experiences for our products...",
    requirements: "2+ years of UX design experience, proficiency in design tools...",
    responsibilities: "Design user interfaces, conduct user research, create prototypes...",
    company: {
      id: "3",
      name: "DesignStudio",
      description: "Creative design agency",
      location: "Austin, TX",
      industry: "Design",
      size: "20-50",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01"
    },
    location: "Austin, TX",
    type: "contract",
    experience: "mid",
    salary: { min: 80, max: 120, currency: "USD", period: "hourly" },
    benefits: ["Flexible Schedule", "Creative Environment"],
    skills: ["Figma", "User Research", "Prototyping", "Adobe Creative Suite"],
    category: "Design",
    status: "active",
    postedAt: "2024-01-13",
    applicationsCount: 28,
    viewsCount: 156,
    isRemote: true,
    isUrgent: false
  }
];

const jobTypes = ["full-time", "part-time", "contract", "internship", "remote"];
const experienceLevels = ["entry", "mid", "senior", "lead", "executive"];
const categories = ["Engineering", "Product", "Design", "Marketing", "Sales", "Operations"];

export default function JobsPage() {
  const [jobs] = useState<Job[]>(mockJobs);
  const [filters, setFilters] = useState<JobSearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  const handleSearch = () => {
    // In a real app, this would make an API call
    console.log("Searching with:", { searchQuery, searchLocation, filters });
  };

  const handleFilterChange = (key: keyof JobSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
    setSearchLocation("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Job</h1>
          <p className="text-gray-600">Discover opportunities that match your skills and interests</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="City, state, or remote"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </button>
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
              >
                Search
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                  <select
                    value={filters.type?.[0] || ""}
                    onChange={(e) => handleFilterChange("type", e.target.value ? [e.target.value] : [])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <select
                    value={filters.experience?.[0] || ""}
                    onChange={(e) => handleFilterChange("experience", e.target.value ? [e.target.value] : [])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Levels</option>
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category?.[0] || ""}
                    onChange={(e) => handleFilterChange("category", e.target.value ? [e.target.value] : [])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Remote</label>
                  <select
                    value={filters.isRemote ? "true" : ""}
                    onChange={(e) => handleFilterChange("isRemote", e.target.value === "true")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Locations</option>
                    <option value="true">Remote Only</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{jobs.length} jobs found</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="relevance">Most Relevant</option>
              <option value="date">Most Recent</option>
              <option value="salary">Highest Salary</option>
            </select>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                          {job.title}
                        </h3>
                        {job.isUrgent && (
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{job.company.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
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
                      <p className="text-gray-700 mb-3 line-clamp-2">{job.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.slice(0, 4).map((skill, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 4 && (
                          <span className="text-gray-500 text-xs">+{job.skills.length - 4} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Bookmark className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      <span>{job.viewsCount} views</span>
                    </div>
                    <div>{job.applicationsCount} applications</div>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-md">1</button>
            <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">2</button>
            <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">3</button>
            <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
