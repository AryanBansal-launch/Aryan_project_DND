"use client";

import Link from "next/link";
import { 
  Home, 
  Search, 
  Briefcase,
  ArrowLeft,
  AlertCircle
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Icon/Illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
            <AlertCircle className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-9xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-lg text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Helpful Links */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">What would you like to do?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/"
              className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <Home className="w-8 h-8 text-gray-600 group-hover:text-blue-600 mb-3 transition-colors" />
              <span className="font-medium text-gray-900 group-hover:text-blue-600">Go Home</span>
            </Link>
            
            <Link
              href="/jobs"
              className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <Briefcase className="w-8 h-8 text-gray-600 group-hover:text-blue-600 mb-3 transition-colors" />
              <span className="font-medium text-gray-900 group-hover:text-blue-600">Browse Jobs</span>
            </Link>
            
            <Link
              href="/blogs"
              className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <Search className="w-8 h-8 text-gray-600 group-hover:text-blue-600 mb-3 transition-colors" />
              <span className="font-medium text-gray-900 group-hover:text-blue-600">Read Blogs</span>
            </Link>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

