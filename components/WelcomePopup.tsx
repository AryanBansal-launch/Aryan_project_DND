"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Sparkles, ArrowRight, BookOpen } from "lucide-react";

const STORAGE_KEY = "jobportal_welcome_seen";

export default function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user has seen the popup before
    const hasSeenWelcome = localStorage.getItem(STORAGE_KEY);
    
    if (!hasSeenWelcome) {
      // Show popup after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = (markAsSeen: boolean = true) => {
    setIsClosing(true);
    
    if (markAsSeen) {
      localStorage.setItem(STORAGE_KEY, "true");
    }
    
    // Wait for animation to complete
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 300);
  };

  const handleExplore = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsClosing(true);
    
    // Close popup with animation, then navigate
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      router.push("/overview");
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={() => handleClose(true)}
      />
      
      {/* Popup */}
      <div 
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4 transition-all duration-300 ${
          isClosing 
            ? "opacity-0 scale-95" 
            : "opacity-100 scale-100"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-8 text-white">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            {/* Close button */}
            <button
              onClick={() => handleClose(true)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Icon */}
            <div className="relative flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>
            
            <h2 className="relative text-2xl font-bold text-center mb-2">
              Welcome to JobPortal! 👋
            </h2>
            <p className="relative text-white/90 text-center text-sm">
              Your AI-powered job discovery platform
            </p>
          </div>
          
          {/* Content */}
          <div className="px-6 py-6">
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">
                Want to explore all the powerful features we offer?
              </p>
              
              {/* Feature highlights */}
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {["AI Search", "Skill Gap Analysis", "Personalization", "Learning Hub"].map((feature) => (
                  <span
                    key={feature}
                    className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleExplore}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                <BookOpen className="w-5 h-5" />
                Explore Platform Overview
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => handleClose(true)}
                className="w-full px-6 py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors"
              >
                Maybe Later
              </button>
            </div>
            
            {/* Don't show again */}
            <p className="text-center text-xs text-gray-400 mt-4">
              This popup won&apos;t appear again
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

