"use client";

import Link from "next/link";
import { FileText, BookOpen } from "lucide-react";

export default function DocsClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Documentation</h1>
          <p className="text-lg text-gray-600">
            Choose a document to view
          </p>
        </div>

        {/* Document Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* TRD Card */}
          <Link href="/docs/trd">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-200 transition-colors">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Technical Requirements Document
              </h2>
              <p className="text-gray-600 mb-4">
                Comprehensive technical specifications, architecture, and implementation details.
              </p>
              <div className="text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                View TRD →
              </div>
            </div>
          </Link>

          {/* PRD Card */}
          <Link href="/docs/prd">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 group-hover:bg-green-200 transition-colors">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Product Requirements Document
              </h2>
              <p className="text-gray-600 mb-4">
                Product features, user journeys, business goals, and success metrics.
              </p>
              <div className="text-green-600 font-medium group-hover:text-green-700 transition-colors">
                View PRD →
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

