import { User as UserType } from "@/lib/types";
import ProfileClient from "./ProfileClient";

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
  // In a real app, this would fetch the user data from an API based on session
  return <ProfileClient initialUser={mockUser} />;
}
