"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Play, 
  Clock, 
  Star, 
  Filter, 
  Search,
  BookOpen,
  Code,
  Server,
  Database,
  Cloud,
  Shield,
  Cpu,
  Layers,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { ContentstackLearningResource } from "@/lib/contentstack";

// Technology icons mapping
const TECH_ICONS: Record<string, any> = {
  nextjs: Code,
  react: Code,
  nodejs: Server,
  typescript: Code,
  microservices: Layers,
  docker: Server,
  kubernetes: Cloud,
  aws: Cloud,
  python: Code,
  golang: Code,
  devops: Server,
  ai_ml: Cpu,
  database: Database,
  security: Shield,
  other: BookOpen,
};

// Technology colors
const TECH_COLORS: Record<string, string> = {
  nextjs: "bg-black text-white",
  react: "bg-cyan-500 text-white",
  nodejs: "bg-green-600 text-white",
  typescript: "bg-blue-600 text-white",
  microservices: "bg-purple-600 text-white",
  docker: "bg-blue-500 text-white",
  kubernetes: "bg-blue-700 text-white",
  aws: "bg-orange-500 text-white",
  python: "bg-yellow-500 text-black",
  golang: "bg-cyan-600 text-white",
  devops: "bg-gray-700 text-white",
  ai_ml: "bg-pink-600 text-white",
  database: "bg-indigo-600 text-white",
  security: "bg-red-600 text-white",
  other: "bg-gray-500 text-white",
};

// Difficulty colors
const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
};

interface LearningsClientProps {
  resources: ContentstackLearningResource[];
  technologies: string[];
  featuredResources: ContentstackLearningResource[];
}

export default function LearningsClient({ 
  resources, 
  technologies, 
  featuredResources 
}: LearningsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.skills_covered?.some(skill => 
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesTech = !selectedTech || resource.technology === selectedTech;
    const matchesDifficulty = !selectedDifficulty || resource.difficulty_level === selectedDifficulty;
    
    return matchesSearch && matchesTech && matchesDifficulty;
  });

  // Get YouTube thumbnail
  const getYouTubeThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-10 h-10" />
              <h1 className="text-4xl md:text-5xl font-bold">Learning Hub</h1>
            </div>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Enhance your skills with curated tutorials on in-demand technologies. 
              From Next.js to Microservices, we've got you covered.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tutorials, skills, or technologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{resources.length}</div>
                <div className="text-sm text-gray-500">Tutorials</div>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{technologies.length}</div>
                <div className="text-sm text-gray-500">Technologies</div>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{featuredResources.length}</div>
                <div className="text-sm text-gray-500">Featured</div>
              </div>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {(selectedTech || selectedDifficulty) && (
                <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {[selectedTech, selectedDifficulty].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Technology Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Technology</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedTech(null)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      !selectedTech 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {technologies.map(tech => (
                    <button
                      key={tech}
                      onClick={() => setSelectedTech(tech)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedTech === tech 
                          ? TECH_COLORS[tech] || 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tech.replace('_', '/')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedDifficulty(null)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      !selectedDifficulty 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Levels
                  </button>
                  {['beginner', 'intermediate', 'advanced'].map(level => (
                    <button
                      key={level}
                      onClick={() => setSelectedDifficulty(level)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedDifficulty === level 
                          ? DIFFICULTY_COLORS[level]
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Section */}
      {featuredResources.length > 0 && !searchQuery && !selectedTech && !selectedDifficulty && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Tutorials</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredResources.slice(0, 3).map(resource => (
                <FeaturedCard key={resource.uid} resource={resource} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Resources */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery || selectedTech || selectedDifficulty 
                ? `${filteredResources.length} Results` 
                : 'All Tutorials'}
            </h2>
          </div>

          {filteredResources.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No tutorials found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map(resource => (
                <ResourceCard key={resource.uid} resource={resource} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Apply Your Skills?</h2>
          <p className="text-xl text-white/90 mb-8">
            Put your learning into practice. Browse jobs that match your new skills.
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Browse Jobs
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

// Featured Card Component
function FeaturedCard({ resource }: { resource: ContentstackLearningResource }) {
  const TechIcon = TECH_ICONS[resource.technology] || BookOpen;
  
  return (
    <Link
      href={`/learnings/${resource.slug}`}
      className="group relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
    >
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
      
      {/* Thumbnail */}
      <div className="relative aspect-video">
        <img
          src={resource.thumbnail?.url || `https://img.youtube.com/vi/${resource.youtube_video_id}/maxresdefault.jpg`}
          alt={resource.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-indigo-600 ml-1" />
          </div>
        </div>
        <div className="absolute top-3 left-3">
          <span className="flex items-center gap-1 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-semibold">
            <Star className="w-3 h-3 fill-current" />
            Featured
          </span>
        </div>
        {resource.duration && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {resource.duration}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${TECH_COLORS[resource.technology] || 'bg-gray-600'}`}>
            {resource.technology.replace('_', '/')}
          </span>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${DIFFICULTY_COLORS[resource.difficulty_level]}`}>
            {resource.difficulty_level}
          </span>
        </div>
        <h3 className="font-bold text-lg group-hover:text-white/90 line-clamp-2">
          {resource.title}
        </h3>
        {resource.instructor && (
          <p className="text-white/70 text-sm mt-1">by {resource.instructor}</p>
        )}
      </div>
    </Link>
  );
}

// Regular Resource Card Component
function ResourceCard({ resource }: { resource: ContentstackLearningResource }) {
  const TechIcon = TECH_ICONS[resource.technology] || BookOpen;
  
  return (
    <Link
      href={`/learnings/${resource.slug}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition-all"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100">
        <img
          src={resource.thumbnail?.url || `https://img.youtube.com/vi/${resource.youtube_video_id}/maxresdefault.jpg`}
          alt={resource.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
            <Play className="w-6 h-6 text-indigo-600 ml-0.5" />
          </div>
        </div>
        {resource.duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-0.5 rounded text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {resource.duration}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${TECH_COLORS[resource.technology] || 'bg-gray-600 text-white'}`}>
            {resource.technology.replace('_', '/')}
          </span>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${DIFFICULTY_COLORS[resource.difficulty_level]}`}>
            {resource.difficulty_level}
          </span>
        </div>
        
        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 line-clamp-2 mb-2">
          {resource.title}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {resource.description}
        </p>

        {resource.skills_covered && resource.skills_covered.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {resource.skills_covered.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                {skill}
              </span>
            ))}
            {resource.skills_covered.length > 3 && (
              <span className="text-gray-400 text-xs">+{resource.skills_covered.length - 3} more</span>
            )}
          </div>
        )}

        {resource.instructor && (
          <p className="text-gray-500 text-xs mt-3">by {resource.instructor}</p>
        )}
      </div>
    </Link>
  );
}

