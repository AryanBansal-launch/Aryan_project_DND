"use client";

import { useState, useEffect } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Award,
  Globe,
  Linkedin,
  Github,
  Briefcase,
  Sparkles,
  Loader2,
  ExternalLink,
  DollarSign,
  Building
} from "lucide-react";
import { User as UserType, WorkExperience, Education } from "@/lib/types";
import { formatDate, getInitials } from "@/lib/utils";
import Link from "next/link";

// Type for recommended jobs from Algolia
interface RecommendedJob {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  experience: string;
  category: string;
  skills: Array<{ skill: string; proficiency: string }>;
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: string;
  };
  isRemote: boolean;
  isUrgent: boolean;
  postedAt: string;
  matchScore: number;
  matchingSkillsCount: number;
}

interface ProfileClientProps {
  initialUser: UserType;
}

export default function ProfileClient({ initialUser }: ProfileClientProps) {
  const [user, setUser] = useState<UserType>(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  
  // Job recommendations state
  const [recommendations, setRecommendations] = useState<RecommendedJob[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Fetch job recommendations based on user skills
  const fetchJobRecommendations = async (skills: string[]) => {
    if (skills.length === 0) {
      setRecommendations([]);
      setShowRecommendations(false);
      return;
    }

    setIsLoadingRecommendations(true);
    setRecommendationsError(null);

    try {
      const response = await fetch('/api/jobs/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skills: skills,
          limit: 6,
        }),
      });

      const data = await response.json();

      if (response.ok && data.recommendations) {
        setRecommendations(data.recommendations);
        setShowRecommendations(true);
      } else {
        setRecommendationsError(data.message || 'Failed to fetch recommendations');
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendationsError('Failed to connect to recommendation service');
      setRecommendations([]);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handleSaveProfile = async () => {
    // In a real app, this would save to an API
    console.log("Saving profile:", user);
    setIsEditing(false);
    
    // Fetch job recommendations based on updated skills
    await fetchJobRecommendations(user.skills);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Update basic field
  const updateField = (field: string, value: any) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  // Nested field update (for preferences, socialLinks, etc.)
  const updateNestedField = (parent: string, field: string, value: any) => {
    setUser(prev => ({
      ...prev,
      [parent]: {
        ...(prev as any)[parent],
        [field]: value
      }
    }));
  };

  // Skills management
  const addSkill = (skill: string) => {
    if (skill && !user.skills.includes(skill)) {
      setUser(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const removeSkill = (skill: string) => {
    setUser(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  // Work history management
  const addWorkHistory = () => {
    const newWork: WorkExperience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: []
    };
    setUser(prev => ({ ...prev, workHistory: [...prev.workHistory, newWork] }));
  };

  const updateWorkHistory = (id: string, field: string, value: any) => {
    setUser(prev => ({
      ...prev,
      workHistory: prev.workHistory.map(work =>
        work.id === id ? { ...work, [field]: value } : work
      )
    }));
  };

  const removeWorkHistory = (id: string) => {
    setUser(prev => ({
      ...prev,
      workHistory: prev.workHistory.filter(work => work.id !== id)
    }));
  };

  // Education management
  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: ""
    };
    setUser(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const updateEducation = (id: string, field: string, value: any) => {
    setUser(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setUser(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6 flex-1">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {getInitials(user.firstName, user.lastName)}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={user.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        placeholder="First Name"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={user.lastName}
                        onChange={(e) => updateField("lastName", e.target.value)}
                        placeholder="Last Name"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <input
                      type="text"
                      value={user.experience}
                      onChange={(e) => updateField("experience", e.target.value)}
                      placeholder="Experience (e.g., 5+ years)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-gray-600">{user.experience} of experience</p>
                  </>
                )}
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  {isEditing ? (
                    <div className="grid grid-cols-1 gap-2 w-full mt-2">
                      <input
                        type="text"
                        value={user.location}
                        onChange={(e) => updateField("location", e.target.value)}
                        placeholder="Location"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="email"
                        value={user.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="Email"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="tel"
                        value={user.phone || ""}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="Phone"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{user.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
              {isEditing ? (
                <textarea
                  value={user.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-700">{user.bio}</p>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
                <div className="flex items-center gap-2">
                  {!isEditing && user.skills.length > 0 && (
                    <button
                      onClick={() => fetchJobRecommendations(user.skills)}
                      disabled={isLoadingRecommendations}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
                    >
                      {isLoadingRecommendations ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      Find Matching Jobs
                    </button>
                  )}
                  {isEditing && (
                    <button
                      onClick={() => {
                        const skill = prompt("Enter a new skill:");
                        if (skill) addSkill(skill);
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Plus className="w-4 h-4 mr-1 inline" />
                      Add Skill
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Job Recommendations Section */}
            {showRecommendations && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Recommended Jobs for You</h2>
                  </div>
                  <span className="text-sm text-gray-500">Based on your skills</span>
                </div>

                {isLoadingRecommendations ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-2" />
                    <span className="text-gray-600">Finding matching jobs...</span>
                  </div>
                ) : recommendationsError ? (
                  <div className="text-center py-8">
                    <p className="text-red-600">{recommendationsError}</p>
                    <button 
                      onClick={() => fetchJobRecommendations(user.skills)}
                      className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Try again
                    </button>
                  </div>
                ) : recommendations.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No matching jobs found for your skills.</p>
                    <p className="text-sm text-gray-400 mt-1">Try adding more skills to get better recommendations.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recommendations.map((job) => (
                      <Link 
                        key={job.id} 
                        href={`/jobs/${job.id}`}
                        className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 hover:text-blue-600">
                                {job.title}
                              </h3>
                              {job.isUrgent && (
                                <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
                                  Urgent
                                </span>
                              )}
                              {job.isRemote && (
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                                  Remote
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-3 h-3" />
                                {job.type}
                              </span>
                              {job.salary && (
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  {job.salary.currency}{job.salary.min.toLocaleString()} - {job.salary.currency}{job.salary.max.toLocaleString()}/{job.salary.period}
                                </span>
                              )}
                            </div>

                            {/* Matching Skills */}
                            <div className="flex flex-wrap gap-1 mb-2">
                              {job.skills.slice(0, 5).map((skill, idx) => {
                                const isMatching = user.skills.some(
                                  s => s.toLowerCase().includes(skill.skill.toLowerCase()) || 
                                       skill.skill.toLowerCase().includes(s.toLowerCase())
                                );
                                return (
                                  <span 
                                    key={idx} 
                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                      isMatching 
                                        ? 'bg-green-100 text-green-700 font-medium' 
                                        : 'bg-gray-100 text-gray-600'
                                    }`}
                                  >
                                    {skill.skill}
                                    {isMatching && ' ✓'}
                                  </span>
                                );
                              })}
                              {job.skills.length > 5 && (
                                <span className="text-xs text-gray-400">+{job.skills.length - 5} more</span>
                              )}
                            </div>
                          </div>

                          {/* Match Score */}
                          <div className="text-right ml-4">
                            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                              {Math.round(job.matchScore * 100)}% Match
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {job.matchingSkillsCount} skill{job.matchingSkillsCount !== 1 ? 's' : ''} match
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}

                    <div className="text-center pt-2">
                      <Link 
                        href="/jobs" 
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View all jobs
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Work Experience */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Work Experience</h2>
                {isEditing && (
                  <button
                    onClick={addWorkHistory}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <Plus className="w-4 h-4 mr-1 inline" />
                    Add Experience
                  </button>
                )}
              </div>
              <div className="space-y-6">
                {user.workHistory.map((work) => (
                  <div key={work.id} className="border-l-2 border-blue-200 pl-4">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={work.position}
                              onChange={(e) => updateWorkHistory(work.id, "position", e.target.value)}
                              placeholder="Position"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                            <input
                              type="text"
                              value={work.company}
                              onChange={(e) => updateWorkHistory(work.id, "company", e.target.value)}
                              placeholder="Company"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                            <input
                              type="text"
                              value={work.location}
                              onChange={(e) => updateWorkHistory(work.id, "location", e.target.value)}
                              placeholder="Location"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="date"
                                value={work.startDate}
                                onChange={(e) => updateWorkHistory(work.id, "startDate", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                              />
                              <input
                                type="date"
                                value={work.endDate || ""}
                                onChange={(e) => updateWorkHistory(work.id, "endDate", e.target.value)}
                                disabled={work.current}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100"
                              />
                            </div>
                            <label className="flex items-center text-sm">
                              <input
                                type="checkbox"
                                checked={work.current}
                                onChange={(e) => updateWorkHistory(work.id, "current", e.target.checked)}
                                className="mr-2"
                              />
                              Current Position
                            </label>
                            <textarea
                              value={work.description}
                              onChange={(e) => updateWorkHistory(work.id, "description", e.target.value)}
                              placeholder="Description"
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <button
                            onClick={() => removeWorkHistory(work.id)}
                            className="ml-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-semibold text-gray-900">{work.position}</h3>
                        <p className="text-gray-600">{work.company}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{work.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>
                              {formatDate(work.startDate)} - {work.current ? "Present" : formatDate(work.endDate!)}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 mt-2">{work.description}</p>
                        {work.achievements && work.achievements.length > 0 && (
                          <div className="mt-3">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Key Achievements:</h4>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                              {work.achievements.map((achievement, index) => (
                                <li key={index}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Education</h2>
                {isEditing && (
                  <button
                    onClick={addEducation}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <Plus className="w-4 h-4 mr-1 inline" />
                    Add Education
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {user.education.map((edu) => (
                  <div key={edu.id} className="border-l-2 border-green-200 pl-4">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                              placeholder="Degree"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                            <input
                              type="text"
                              value={edu.field}
                              onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                              placeholder="Field of Study"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                              placeholder="Institution"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="date"
                                value={edu.startDate}
                                onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                              />
                              <input
                                type="date"
                                value={edu.endDate || ""}
                                onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                              />
                            </div>
                            <input
                              type="number"
                              step="0.01"
                              value={edu.gpa || ""}
                              onChange={(e) => updateEducation(edu.id, "gpa", parseFloat(e.target.value))}
                              placeholder="GPA (optional)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                            <textarea
                              value={edu.description || ""}
                              onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                              placeholder="Description (optional)"
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <button
                            onClick={() => removeEducation(edu.id)}
                            className="ml-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                        <p className="text-gray-600">{edu.institution}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>
                              {formatDate(edu.startDate)} - {formatDate(edu.endDate!)}
                            </span>
                          </div>
                          {edu.gpa && (
                            <div className="flex items-center">
                              <Award className="w-4 h-4 mr-1" />
                              <span>GPA: {edu.gpa}</span>
                            </div>
                          )}
                        </div>
                        {edu.description && (
                          <p className="text-gray-700 mt-2">{edu.description}</p>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="Email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="tel"
                    value={user.phone || ""}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="Phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="text"
                    value={user.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="Location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="url"
                    value={user.portfolio || ""}
                    onChange={(e) => updateField("portfolio", e.target.value)}
                    placeholder="Portfolio URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-700">{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{user.location}</span>
                  </div>
                  {user.portfolio && (
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 text-gray-400 mr-3" />
                      <a
                        href={user.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Portfolio
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Linkedin className="w-4 h-4 text-gray-400 mr-2" />
                    <input
                      type="url"
                      value={user.socialLinks?.linkedin || ""}
                      onChange={(e) => updateNestedField("socialLinks", "linkedin", e.target.value)}
                      placeholder="LinkedIn URL"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div className="flex items-center">
                    <Github className="w-4 h-4 text-gray-400 mr-2" />
                    <input
                      type="url"
                      value={user.socialLinks?.github || ""}
                      onChange={(e) => updateNestedField("socialLinks", "github", e.target.value)}
                      placeholder="GitHub URL"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-gray-400 mr-2" />
                    <input
                      type="url"
                      value={user.socialLinks?.website || ""}
                      onChange={(e) => updateNestedField("socialLinks", "website", e.target.value)}
                      placeholder="Website URL"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.socialLinks?.linkedin && (
                    <a
                      href={user.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  )}
                  {user.socialLinks?.github && (
                    <a
                      href={user.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  )}
                  {user.socialLinks?.website && (
                    <a
                      href={user.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Website
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Job Preferences */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Preferences</h3>
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Job Types</label>
                    <input
                      type="text"
                      value={user.preferences.jobTypes.join(", ")}
                      onChange={(e) => updateNestedField("preferences", "jobTypes", e.target.value.split(",").map(t => t.trim()))}
                      placeholder="full-time, remote"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Preferred Locations</label>
                    <input
                      type="text"
                      value={user.preferences.locations.join(", ")}
                      onChange={(e) => updateNestedField("preferences", "locations", e.target.value.split(",").map(l => l.trim()))}
                      placeholder="San Francisco, Remote"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Salary Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={user.preferences.salaryRange?.min || ""}
                        onChange={(e) => updateNestedField("preferences", "salaryRange", { ...user.preferences.salaryRange, min: parseInt(e.target.value) || 0 })}
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <input
                        type="number"
                        value={user.preferences.salaryRange?.max || ""}
                        onChange={(e) => updateNestedField("preferences", "salaryRange", { ...user.preferences.salaryRange, max: parseInt(e.target.value) || 0 })}
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Job Types:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.preferences.jobTypes.map((type, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Locations:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.preferences.locations.map((location, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>
                  {user.preferences.salaryRange && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Salary Range:</span>
                      <p className="text-gray-600 text-sm mt-1">
                        ${user.preferences.salaryRange.min.toLocaleString()} - ${user.preferences.salaryRange.max.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

