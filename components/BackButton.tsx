"use client";

import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
    >
      <ArrowLeft className="w-5 h-5 mr-2" />
      Go Back
    </button>
  );
}
