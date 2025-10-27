"use client";

import { useState } from "react";
import Link from "next/link";
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
import { ContentstackHomepage } from "@/lib/types";
import { formatSalary, formatRelativeTime } from "@/lib/utils";

// Icon mapping
const iconMap: { [key: string]: any } = {
  Briefcase,
  Building2,
  Users,
  TrendingUp,
  Search,
  MapPin,
  Clock,
  DollarSign,
  ArrowRight
};

interface HomeClientProps {
  homepage: ContentstackHomepage;
  featuredJobs: any[];
  topCompanies: any[];
}

export default function HomeClient({ homepage, featuredJobs, topCompanies }: HomeClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const handleSearch = () => {
    // Redirect to jobs page with search params
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (searchLocation) params.set('location', searchLocation);
    window.location.href = `/jobs?${params.toString()}`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {homepage.hero_section.main_title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              {homepage.hero_section.subtitle}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-2 shadow-lg">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 flex items-center">
                    <Search className="w-5 h-5 text-gray-400 ml-3" />
                    <input
                      type="text"
                      placeholder={homepage.hero_section.search_job_placeholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="flex-1 px-3 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex-1 flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 ml-3" />
                    <input
                      type="text"
                      placeholder={homepage.hero_section.search_location_placeholder}
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="flex-1 px-3 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
                    />
                  </div>
                  <button 
                    onClick={handleSearch}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-colors flex items-center justify-center"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    {homepage.hero_section.search_button_text}
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
            {homepage.stats_section.stat_items.map((stat, index) => {
              const Icon = iconMap[stat.icon] || Briefcase;
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
            <h2 className="text-3xl font-bold text-gray-900">{homepage.featured_jobs_section.section_title}</h2>
            <Link href="/jobs" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
              {homepage.featured_jobs_section.view_all_text}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6 h-full cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-gray-600">{job.company.name}</p>
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
                    {job.salary && (
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span className="text-sm">{formatSalary(job.salary)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.slice(0, 3).map((skill: string, index: number) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="text-gray-500 text-xs">+{job.skills.length - 3} more</span>
                    )}
                  </div>
                  
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors">
                    View Details
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{homepage.top_companies_section.section_title}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {homepage.top_companies_section.description}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {topCompanies.map((company, index) => (
              <Link key={index} href={`/companies`}>
                <div className="text-center group cursor-pointer">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                    <Building2 className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{company.name}</h3>
                  <p className="text-sm text-gray-600">{company.jobCount} jobs</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {homepage.cta_section.title}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {homepage.cta_section.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={homepage.cta_section.primary_button_link}>
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-md font-medium transition-colors">
                {homepage.cta_section.primary_button_text}
              </button>
            </Link>
            <Link href={homepage.cta_section.secondary_button_link}>
              <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-md font-medium transition-colors">
                {homepage.cta_section.secondary_button_text}
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

