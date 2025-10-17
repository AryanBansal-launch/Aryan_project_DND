"use client";

import { useState } from "react";
import { 
  Search, 
  MapPin, 
  Building2,
  ExternalLink,
  Filter
} from "lucide-react";
import { Company } from "@/lib/types";

// Mock companies data
const mockCompanies: Company[] = [
  {
    id: "1",
    name: "TechCorp",
    description: "Leading technology company focused on innovation and growth. We build products that make a difference in people's lives.",
    location: "San Francisco, CA",
    industry: "Technology",
    size: "1000+",
    founded: "2010",
    benefits: ["Health Insurance", "401k", "Flexible Hours", "Stock Options", "Learning Budget"],
    culture: "We foster a collaborative and inclusive environment where everyone can thrive.",
    socialMedia: {
      linkedin: "https://linkedin.com/company/techcorp",
      twitter: "https://twitter.com/techcorp",
      website: "https://techcorp.com"
    },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: "2",
    name: "StartupXYZ",
    description: "Fast-growing startup revolutionizing the way people work. Join us in building the future of productivity.",
    location: "New York, NY",
    industry: "Technology",
    size: "50-200",
    founded: "2018",
    benefits: ["Stock Options", "Health Insurance", "Remote Work", "Unlimited PTO"],
    culture: "Fast-paced, innovative environment with a focus on growth and learning.",
    socialMedia: {
      linkedin: "https://linkedin.com/company/startupxyz",
      website: "https://startupxyz.com"
    },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: "3",
    name: "DesignStudio",
    description: "Creative design agency specializing in user experience and brand identity. We help companies tell their story through design.",
    location: "Austin, TX",
    industry: "Design",
    size: "20-50",
    founded: "2015",
    benefits: ["Flexible Schedule", "Creative Environment", "Health Insurance", "Professional Development"],
    culture: "Creative, collaborative environment where design excellence is our priority.",
    socialMedia: {
      linkedin: "https://linkedin.com/company/designstudio",
      website: "https://designstudio.com"
    },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: "4",
    name: "FinanceFirst",
    description: "Leading financial services company providing innovative solutions for businesses and individuals.",
    location: "Chicago, IL",
    industry: "Finance",
    size: "500-1000",
    founded: "2005",
    benefits: ["Health Insurance", "401k", "Pension", "Professional Development", "Work-Life Balance"],
    culture: "Professional, stable environment with a focus on integrity and excellence.",
    socialMedia: {
      linkedin: "https://linkedin.com/company/financefirst",
      website: "https://financefirst.com"
    },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: "5",
    name: "HealthTech Solutions",
    description: "Healthcare technology company developing innovative solutions to improve patient care and outcomes.",
    location: "Boston, MA",
    industry: "Healthcare",
    size: "200-500",
    founded: "2012",
    benefits: ["Health Insurance", "Dental", "Vision", "401k", "Flexible Hours"],
    culture: "Mission-driven environment focused on improving healthcare through technology.",
    socialMedia: {
      linkedin: "https://linkedin.com/company/healthtech",
      website: "https://healthtech.com"
    },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: "6",
    name: "EduTech Innovations",
    description: "Educational technology company creating tools and platforms to enhance learning experiences worldwide.",
    location: "Seattle, WA",
    industry: "Education",
    size: "100-200",
    founded: "2016",
    benefits: ["Health Insurance", "401k", "Learning Budget", "Remote Work", "Sabbatical"],
    culture: "Innovative, educational environment where learning and teaching are at the core.",
    socialMedia: {
      linkedin: "https://linkedin.com/company/edutech",
      website: "https://edutech.com"
    },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  }
];

const industries = ["Technology", "Design", "Finance", "Healthcare", "Education", "Marketing", "Sales"];
const companySizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

export default function CompaniesPage() {
  const [companies] = useState<Company[]>(mockCompanies);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = !selectedIndustry || company.industry === selectedIndustry;
    const matchesSize = !selectedSize || company.size === selectedSize;
    
    return matchesSearch && matchesIndustry && matchesSize;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedIndustry("");
    setSelectedSize("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Companies</h1>
          <p className="text-gray-600">Explore companies and find your next career opportunity</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Industries</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Sizes</option>
                    {companySizes.map(size => (
                      <option key={size} value={size}>{size} employees</option>
                    ))}
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
          <span className="text-gray-600">{filteredCompanies.length} companies found</span>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <div key={company.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{company.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{company.industry}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{company.location}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-4 line-clamp-3">{company.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Company Size:</span>
                  <span className="font-medium">{company.size} employees</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Founded:</span>
                  <span className="font-medium">{company.founded}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Benefits</h4>
                <div className="flex flex-wrap gap-1">
                  {company.benefits?.slice(0, 3).map((benefit, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {benefit}
                    </span>
                  ))}
                  {company.benefits && company.benefits.length > 3 && (
                    <span className="text-gray-500 text-xs">+{company.benefits.length - 3} more</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View Jobs
                </button>
                <div className="flex items-center space-x-2">
                  {company.socialMedia?.linkedin && (
                    <a
                      href={company.socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {company.socialMedia?.website && (
                    <a
                      href={company.socialMedia.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
