"use client";

import { useState } from "react";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Building2, 
  Users, 
  TrendingUp,
  ArrowRight,
  Clock,
  DollarSign
} from "lucide-react";

// Mock data for demonstration
const featuredJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "full-time",
    salary: { min: 120000, max: 160000, currency: "USD", period: "yearly" },
    postedAt: "2024-01-15",
    isRemote: true,
    isUrgent: false,
    skills: ["React", "TypeScript", "Next.js"],
    logo: "/api/placeholder/60/60"
  },
  {
    id: "2",
    title: "Product Manager",
    company: "StartupXYZ",
    location: "New York, NY",
    type: "full-time",
    salary: { min: 100000, max: 140000, currency: "USD", period: "yearly" },
    postedAt: "2024-01-14",
    isRemote: false,
    isUrgent: true,
    skills: ["Product Strategy", "Agile", "Analytics"],
    logo: "/api/placeholder/60/60"
  },
  {
    id: "3",
    title: "UX Designer",
    company: "DesignStudio",
    location: "Austin, TX",
    type: "contract",
    salary: { min: 80, max: 120, currency: "USD", period: "hourly" },
    postedAt: "2024-01-13",
    isRemote: true,
    isUrgent: false,
    skills: ["Figma", "User Research", "Prototyping"],
    logo: "/api/placeholder/60/60"
  }
];

const topCompanies = [
  { name: "Google", logo: "/api/placeholder/80/80", jobs: 245 },
  { name: "Microsoft", logo: "/api/placeholder/80/80", jobs: 189 },
  { name: "Apple", logo: "/api/placeholder/80/80", jobs: 156 },
  { name: "Amazon", logo: "/api/placeholder/80/80", jobs: 203 },
  { name: "Meta", logo: "/api/placeholder/80/80", jobs: 178 },
  { name: "Netflix", logo: "/api/placeholder/80/80", jobs: 67 }
];

const stats = [
  { label: "Active Jobs", value: "12,345", icon: Briefcase },
  { label: "Companies", value: "2,156", icon: Building2 },
  { label: "Job Seekers", value: "45,678", icon: Users },
  { label: "Success Rate", value: "89%", icon: TrendingUp }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const formatSalary = (salary?: { min?: number; max?: number; currency: string; period: string }) => {
    if (!salary) return 'Salary not specified';
    
    const { min, max, currency } = salary;
    const symbol = currency === 'USD' ? '$' : currency;
    
    if (min && max) {
      return `${symbol}${min.toLocaleString()} - ${symbol}${max.toLocaleString()}`;
    } else if (min) {
      return `${symbol}${min.toLocaleString()}+`;
    }
    return 'Salary not specified';
  };

  const formatRelativeTime = (date: string) => {
    const now = new Date();
    const d = new Date(date);
    const diffInDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Dream Job
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Discover thousands of job opportunities from top companies worldwide. 
              Your next career move starts here.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-2 shadow-lg">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 flex items-center">
                    <Search className="w-5 h-5 text-gray-400 ml-3" />
                    <input
                      type="text"
                      placeholder="Job title, keywords, or company"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 px-3 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex-1 flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 ml-3" />
                    <input
                      type="text"
                      placeholder="City, state, or remote"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="flex-1 px-3 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
                    />
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-colors flex items-center justify-center">
                    <Search className="w-5 h-5 mr-2" />
                    Search Jobs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Jobs</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
              View All Jobs
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                    </div>
                  </div>
                  {job.isUrgent && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{job.location}</span>
                    {job.isRemote && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Remote
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{formatRelativeTime(job.postedAt)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span className="text-sm">{formatSalary(job.salary)}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 3 && (
                    <span className="text-gray-500 text-xs">+{job.skills.length - 3} more</span>
                  )}
                </div>
                
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Companies</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of professionals working at industry-leading companies
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {topCompanies.map((company, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                  <Building2 className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{company.name}</h3>
                <p className="text-sm text-gray-600">{company.jobs} jobs</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Advance Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their dream jobs through our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-md font-medium transition-colors">
              Start Job Search
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-md font-medium transition-colors">
              Post a Job
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
