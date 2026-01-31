"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { 
  Search, 
  Briefcase, 
  Building2, 
  User, 
  Bell, 
  Menu, 
  X,
  LogIn,
  UserPlus,
  FileText,
  LogOut,
  Settings,
  BookOpen,
  GraduationCap,
  Compass,
  Shield,
  Play
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { ContentstackNavigation } from "@/lib/types";
import NotificationDropdown from "./NotificationDropdown";

// Icon mapping for CMS icon names
const iconMap: { [key: string]: any } = {
  Search,
  Briefcase,
  Building2,
  User,
  FileText,
  Bell,
  Menu,
  X,
  LogIn,
  UserPlus,
  LogOut,
  Settings,
  BookOpen,
  GraduationCap
};

interface NavigationProps {
  navigationData: ContentstackNavigation | null;
}

export default function Navigation({ navigationData }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Use CMS data if available, otherwise fallback to hardcoded
  const brandName = navigationData?.brand_name || "JobDekho";
  
  // Default nav items
  const defaultNavItems = [
    { label: "Home", link: "/", icon: "Search" },
    { label: "Jobs", link: "/jobs", icon: "Briefcase" },
    { label: "Companies", link: "/companies", icon: "Building2" },
    { label: "Learnings", link: "/learnings", icon: "GraduationCap" },
    { label: "Blogs", link: "/blogs", icon: "BookOpen" },
    { label: "Applications", link: "/applications", icon: "FileText", requireAuth: true },
    { label: "Profile", link: "/profile", icon: "User", requireAuth: true },
  ];

  // Use CMS nav items if available, but ensure Learnings is always included
  let allNavItems = navigationData?.nav_items || defaultNavItems;
  
  // If using CMS data, ensure Learnings is in the list (insert after Companies)
  if (navigationData?.nav_items && !allNavItems.some(item => item.link === '/learnings')) {
    const companiesIndex = allNavItems.findIndex(item => item.link === '/companies');
    const learningsItem = { label: "Learnings", link: "/learnings", icon: "GraduationCap" };
    if (companiesIndex !== -1) {
      allNavItems = [
        ...allNavItems.slice(0, companiesIndex + 1),
        learningsItem,
        ...allNavItems.slice(companiesIndex + 1)
      ];
    } else {
      allNavItems = [...allNavItems, learningsItem];
    }
  }

  // Filter nav items based on authentication
  const navItems = allNavItems.filter(item => {
    // Blogs should always be visible
    if (item.link === '/blogs') {
      return true;
    }
    // For items from CMS, check if link is /applications or /profile, or if requireAuth is set
    const requiresAuth = item.link === '/applications' || item.link === '/profile' || item.requireAuth === true;
    return !requiresAuth || session;
  });

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">{brandName}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const Icon = iconMap[item.icon || 'Briefcase'] || Briefcase;
                // Check if current path matches the link or starts with it (for nested routes like /blogs/[id])
                const isActive = pathname === item.link || (item.link !== '/' && pathname.startsWith(item.link));
                
                return (
                  <Link
                    key={item.link}
                    href={item.link}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            {status === "loading" ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : session ? (
              <>
                <NotificationDropdown />
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {session.user?.name ? getInitials(session.user.name.split(" ")[0], session.user.name.split(" ")[1] || "") : "U"}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {session.user?.name || "User"}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </Link>
                      <Link
                        href="/demo"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Play className="w-4 h-4 mr-3" />
                        Demo
                      </Link>
                      <Link
                        href="/overview"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Compass className="w-4 h-4 mr-3" />
                        Platform Overview
                      </Link>
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Shield className="w-4 h-4 mr-3" />
                        Admin Panel
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {navItems.map((item) => {
                const Icon = iconMap[item.icon || 'Briefcase'] || Briefcase;
                // Check if current path matches the link or starts with it (for nested routes like /blogs/[id])
                const isActive = pathname === item.link || (item.link !== '/' && pathname.startsWith(item.link));
                
                return (
                  <Link
                    key={item.link}
                    href={item.link}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium",
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              <div className="pt-4 border-t">
                {session ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {session.user?.name ? getInitials(session.user.name.split(" ")[0], session.user.name.split(" ")[1] || "") : "U"}
                        </div>
                      )}
                      <span className="text-base font-medium text-gray-900">
                        {session.user?.name || "User"}
                      </span>
                    </div>
                    <div className="px-3">
                      <NotificationDropdown />
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/demo"
                      className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Play className="w-5 h-5" />
                      <span>Demo</span>
                    </Link>
                    <Link
                      href="/overview"
                      className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Compass className="w-5 h-5" />
                      <span>Platform Overview</span>
                    </Link>
                    <Link
                      href="/admin"
                      className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield className="w-5 h-5" />
                      <span>Admin Panel</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link
                      href="/login"
                      className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Login</span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>Sign Up</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}