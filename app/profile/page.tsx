"use client";

import { useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Save,
  X,
  Plus,
  ExternalLink,
  Award,
  Globe
} from "lucide-react";
import { User as UserType } from "@/lib/types";
import { formatDate, getInitials } from "@/lib/utils";

// Mock user data
const mockUser: UserType = {
  id: "1",
  email: "john.doe@email.com",
  firstName: "John",
  lastName: "Doe",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  bio: "Passionate frontend developer with 5+ years of experience building modern web applications. I love creating user-friendly interfaces and solving complex problems through code.",
  skills: ["React", "TypeScript", "Next.js", "Node.js", "Python", "AWS"],
  experience: "5+ years",
  education: [
    {
      id: "1",
      institution: "Stanford University",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2015-09-01",
      endDate: "2019-06-01",
      gpa: 3.8,
      description: "Focused on software engineering and algorithms"
    }
  ],
  workHistory: [
    {
      id: "1",
      company: "TechCorp",
      position: "Senior Frontend Developer",
      location: "San Francisco, CA",
      startDate: "2021-03-01",
      endDate: "",
      current: true,
      description: "Lead frontend development for multiple products, mentor junior developers, and collaborate with design teams.",
      achievements: ["Improved page load times by 40%", "Led team of 5 developers", "Implemented new design system"]
    },
    {
      id: "2",
      company: "StartupXYZ",
      position: "Frontend Developer",
      location: "New York, NY",
      startDate: "2019-07-01",
      endDate: "2021-02-28",
      current: false,
      description: "Developed responsive web applications using React and modern JavaScript frameworks.",
      achievements: ["Built 3 major features", "Reduced bug reports by 30%"]
    }
  ],
  portfolio: "https://johndoe.dev",
  socialLinks: {
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
    website: "https://johndoe.dev"
  },
  preferences: {
    jobTypes: ["full-time", "remote"],
    locations: ["San Francisco", "Remote"],
    salaryRange: {
      min: 120000,
      max: 160000
    },
    notifications: true
  },
  createdAt: "2024-01-01",
  updatedAt: "2024-01-15"
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserType>(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (field: string, currentValue: any) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleSave = () => {
    if (editingField) {
      setUser(prev => ({ ...prev, [editingField]: editValue }));
      setEditingField(null);
      setEditValue("");
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue("");
  };

  const removeSkill = (skill: string) => {
    setUser(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {getInitials(user.firstName, user.lastName)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600">{user.experience} of experience</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
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
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
              {editingField === "bio" ? (
                <div className="space-y-3">
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <p className="text-gray-700">{user.bio}</p>
                  {isEditing && (
                    <button
                      onClick={() => handleEdit("bio", user.bio)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
                {isEditing && (
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <Plus className="w-4 h-4 mr-1 inline" />
                    Add Skill
                  </button>
                )}
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

            {/* Work Experience */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Work Experience</h2>
                {isEditing && (
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <Plus className="w-4 h-4 mr-1 inline" />
                    Add Experience
                  </button>
                )}
              </div>
              <div className="space-y-6">
                {user.workHistory.map((work) => (
                  <div key={work.id} className="border-l-2 border-blue-200 pl-4">
                    <div className="flex items-start justify-between">
                      <div>
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
                      </div>
                      {isEditing && (
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
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
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Education</h2>
                {isEditing && (
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <Plus className="w-4 h-4 mr-1 inline" />
                    Add Education
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {user.education.map((edu) => (
                  <div key={edu.id} className="border-l-2 border-green-200 pl-4">
                    <div className="flex items-start justify-between">
                      <div>
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
                      </div>
                      {isEditing && (
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {edu.description && (
                      <p className="text-gray-700 mt-2">{edu.description}</p>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
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
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
              <div className="space-y-3">
                {user.socialLinks?.linkedin && (
                  <a
                    href={user.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
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
                    <ExternalLink className="w-4 h-4 mr-2" />
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
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Website
                  </a>
                )}
              </div>
            </div>

            {/* Job Preferences */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Preferences</h3>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
