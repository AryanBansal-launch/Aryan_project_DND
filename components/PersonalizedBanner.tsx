"use client";

import { useState, useEffect, useRef } from "react";
import { X, Clock, ArrowRight, Sparkles, TrendingUp, UserCheck } from "lucide-react";
import { getUserBehavior } from "@/lib/behavior-tracking";
import { 
  initContentstackPersonalize, 
  setPersonalizeAttributes, 
  getPersonalizedContent,
  getPersonalizeExperiences
} from "@/lib/contentstack-personalize";

// Banner configurations based on user behavior
const BANNER_CONFIGS = {
  ready_to_apply: {
    banner_title: "Ready to Take the Next Step? 🎯",
    banner_message: "You've been exploring some great opportunities. Why not apply to one that matches your skills?",
    cta_text: "Apply Now",
    cta_link: "/jobs",
    icon: TrendingUp,
    gradient: "from-orange-500 to-red-600",
  },
  tech_job_seeker: {
    banner_title: "🚀 Hot Tech Jobs Just Posted!",
    banner_message: "Based on your interest in Engineering roles, check out these new opportunities.",
    cta_text: "View Tech Jobs",
    cta_link: "/jobs?category=Engineering",
    icon: Sparkles,
    gradient: "from-purple-600 to-indigo-700",
  },
  returning_user: {
    banner_title: "Welcome Back! 👋",
    banner_message: "We've got new jobs since your last visit. Check out what's new!",
    cta_text: "See What's New",
    cta_link: "/jobs",
    icon: UserCheck,
    gradient: "from-green-500 to-teal-600",
  },
  first_time_user: {
    banner_title: "Welcome to JobPortal! ✨",
    banner_message: "Discover thousands of opportunities. Create your profile to get personalized recommendations.",
    cta_text: "Get Started",
    cta_link: "/profile",
    icon: Sparkles,
    gradient: "from-blue-500 to-cyan-600",
  },
  default: {
    banner_title: "Find Your Dream Job",
    banner_message: "Explore opportunities from top companies. Your next career move is waiting!",
    cta_text: "Browse Jobs",
    cta_link: "/jobs",
    icon: Clock,
    gradient: "from-blue-600 to-blue-700",
  },
};

// Interface for Contentstack personalized banner entry
export interface ContentstackBannerData {
  banner_title?: string;
  banner_message?: string;
  cta_text?: string;
  cta_link?: string | { title?: string; href: string };
  delay_seconds?: number;
  enabled?: boolean;
  priority?: number;
  [key: string]: any;
}

interface PersonalizedBannerProps {
  contentstackData?: ContentstackBannerData | null;
  delay?: number;
  title?: string;
  message?: string;
  ctaText?: string;
  ctaLink?: string;
  persistDismissal?: boolean;
}

export default function PersonalizedBanner({
  contentstackData,
  delay,
  title,
  message,
  ctaText,
  ctaLink,
  persistDismissal = false,
}: PersonalizedBannerProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [hasClickedApplyNow, setHasClickedApplyNow] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<keyof typeof BANNER_CONFIGS>("default");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Get banner config based on selection
  const bannerConfig = BANNER_CONFIGS[selectedBanner];
  const IconComponent = bannerConfig.icon;
  
  // Use Contentstack data if available, otherwise use behavior-based config
  const finalBannerTitle = contentstackData?.banner_title || title || bannerConfig.banner_title;
  const finalBannerMessage = contentstackData?.banner_message || message || bannerConfig.banner_message;
  const finalBannerCtaText = contentstackData?.cta_text || ctaText || bannerConfig.cta_text;
  
  const ctaLinkValue = contentstackData?.cta_link || ctaLink || bannerConfig.cta_link;
  const finalBannerCtaLink = typeof ctaLinkValue === 'string' 
    ? ctaLinkValue 
    : (ctaLinkValue?.href || "/jobs");
  
  const finalBannerDelay = contentstackData?.delay_seconds 
    ? contentstackData.delay_seconds * 1000 
    : delay || 10000; // Reduced to 10 seconds for testing
  const finalIsEnabled = contentstackData?.enabled !== false;

  // Main banner logic - tries Personalize SDK first, falls back to LOCAL behavior
  useEffect(() => {
    if (!finalIsEnabled) return;
    if (typeof window === 'undefined') return;
    
    const storageKey = persistDismissal ? "banner_dismissed_permanent" : "banner_dismissed_session";

    // Check for dismissal
    if (localStorage.getItem(storageKey) === "true") {
      return;
    }

    // Check if user has already clicked Apply Now
    if (localStorage.getItem("apply_now_clicked") === "true") {
      setHasClickedApplyNow(true);
      return;
    }

    // Get or set session start time
    const sessionStartKey = "session_start_time";
    const sessionStartTime = localStorage.getItem(sessionStartKey);
    if (!sessionStartTime) {
      const now = Date.now();
      localStorage.setItem(sessionStartKey, now.toString());
      startTimeRef.current = now;
    } else {
      startTimeRef.current = parseInt(sessionStartTime, 10);
    }

    // Try to get personalized content from Contentstack Personalize SDK
    const tryPersonalizeSDK = async (): Promise<boolean> => {
      const projectUid = process.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID;
      if (!projectUid) {
        console.log('⚠️ PersonalizedBanner: No Personalize project UID configured');
        return false;
      }

      try {
        console.group('🔄 PersonalizedBanner: Trying Contentstack Personalize SDK');
        
        // Initialize SDK
        const sdk = await initContentstackPersonalize(projectUid);
        if (!sdk) {
          console.log('❌ SDK initialization failed');
          console.groupEnd();
          return false;
        }

        // Get behavior data and send as attributes
        const behavior = getUserBehavior();
        const engagementLevel = behavior.totalJobViews > 20 ? 'high' : 
                               behavior.totalJobViews > 5 ? 'medium' : 'low';
        
        await setPersonalizeAttributes({
          total_job_views: behavior.totalJobViews,
          total_blog_reads: behavior.totalBlogReads,
          engagement_level: engagementLevel,
          session_count: behavior.sessionCount,
          top_category: behavior.interestedCategories[0] || 'general',
          is_returning_user: behavior.sessionCount > 1,
          has_applied: behavior.appliedJobs.length > 0,
          ready_to_apply: behavior.totalJobViews >= 3 && behavior.appliedJobs.length === 0,
          first_time_user: behavior.sessionCount === 1,
        });

        // Wait for SDK to process
        await new Promise(resolve => setTimeout(resolve, 300));

        // Try to get personalized content
        const content = await getPersonalizedContent('personalized_banner');
        
        if (content && content.banner_title) {
          console.log('✅ Got personalized content from Contentstack:', content.banner_title);
          console.groupEnd();
          
          // Use the Contentstack content - update banner data
          // The contentstackData prop will be used via finalBannerTitle etc.
          return true;
        }

        // Check experiences for active variants
        const experiences = await getPersonalizeExperiences();
        const hasActiveVariant = experiences.some((exp: any) => exp.activeVariantShortUid);
        
        if (hasActiveVariant) {
          console.log('✅ Personalize has active variants');
          console.groupEnd();
          return true;
        }

        console.log('⚠️ No active variants from Personalize, will use local fallback');
        console.groupEnd();
        return false;
      } catch (error) {
        console.error('❌ Personalize SDK error:', error);
        console.groupEnd();
        return false;
      }
    };

    // Determine which banner to show based on LOCAL behavior (fallback)
    const selectBannerBasedOnBehavior = () => {
      const behavior = getUserBehavior();
      
      console.group('🎨 PersonalizedBanner: Using LOCAL behavior fallback');
      console.log('Behavior data:', {
        totalJobViews: behavior.totalJobViews,
        sessionCount: behavior.sessionCount,
        topCategory: behavior.interestedCategories[0],
        hasApplied: behavior.appliedJobs.length > 0,
      });

      // Priority-based selection (highest priority first)
      
      // 1. Ready to Apply - viewed 3+ jobs but hasn't applied
      if (behavior.totalJobViews >= 3 && behavior.appliedJobs.length === 0) {
        console.log('✅ Selected: ready_to_apply (viewed 3+ jobs, no applications)');
        console.groupEnd();
        return "ready_to_apply";
      }
      
      // 2. Tech Job Seeker - interested in Engineering
      if (behavior.interestedCategories.includes("Engineering")) {
        console.log('✅ Selected: tech_job_seeker (interested in Engineering)');
        console.groupEnd();
        return "tech_job_seeker";
      }
      
      // 3. Returning User
      if (behavior.sessionCount > 1) {
        console.log('✅ Selected: returning_user (session count > 1)');
        console.groupEnd();
        return "returning_user";
      }
      
      // 4. First Time User with low engagement
      if (behavior.sessionCount === 1 && behavior.totalJobViews < 3) {
        console.log('✅ Selected: first_time_user (new user, < 3 views)');
        console.groupEnd();
        return "first_time_user";
      }
      
      console.log('✅ Selected: default');
      console.groupEnd();
      return "default";
    };

    // Calculate elapsed time and show banner
    const elapsed = Date.now() - (startTimeRef.current || Date.now());
    
    // Main function to show personalized banner
    const showBannerWithPersonalization = async () => {
      // First, try Contentstack Personalize SDK
      const personalizeWorked = await tryPersonalizeSDK();
      
      if (!personalizeWorked) {
        // Fallback to local behavior-based selection
        const bannerType = selectBannerBasedOnBehavior();
        setSelectedBanner(bannerType as keyof typeof BANNER_CONFIGS);
      }
      
      setShowBanner(true);
    };

    if (elapsed >= finalBannerDelay) {
      showBannerWithPersonalization();
    } else {
      const remainingTime = finalBannerDelay - elapsed;
      timerRef.current = setTimeout(showBannerWithPersonalization, remainingTime);
    }

    // Listen for Apply Now button clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const buttonText = target.textContent?.toLowerCase() || "";
      const hasApplyNowText = buttonText.includes("apply now") || 
                              buttonText.includes("apply") ||
                              target.closest('[data-apply-now="true"]') !== null;
      
      if (hasApplyNowText) {
        setHasClickedApplyNow(true);
        localStorage.setItem("apply_now_clicked", "true");
        if (timerRef.current) clearTimeout(timerRef.current);
        setShowBanner(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      document.removeEventListener("click", handleClick);
    };
  }, [finalBannerDelay, persistDismissal, finalIsEnabled]);

  const handleDismiss = () => {
    setShowBanner(false);
    const storageKey = persistDismissal ? "banner_dismissed_permanent" : "banner_dismissed_session";
    localStorage.setItem(storageKey, "true");
    localStorage.setItem("banner_dismissed_time", Date.now().toString());
  };

  const handleCTAClick = () => {
    localStorage.setItem("apply_now_clicked", "true");
    setHasClickedApplyNow(true);
    setShowBanner(false);
    
    if (finalBannerCtaLink.startsWith("http")) {
      window.open(finalBannerCtaLink, "_blank");
    } else {
      window.location.href = finalBannerCtaLink;
    }
  };

  if (!showBanner || hasClickedApplyNow) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className={`bg-gradient-to-r ${bannerConfig.gradient} text-white rounded-lg shadow-xl p-4 sm:p-6`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="flex-shrink-0 mt-1 p-2 bg-white/20 rounded-lg">
                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base sm:text-lg font-semibold">
                    {finalBannerTitle}
                  </h3>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    Personalized
                  </span>
                </div>
                <p className="text-sm sm:text-base text-white/90 mb-3">
                  {finalBannerMessage}
                </p>
                <button
                  onClick={handleCTAClick}
                  className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-md font-medium text-sm sm:text-base transition-colors shadow-md"
                >
                  {finalBannerCtaText}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-white/80 hover:text-white transition-colors p-1"
              aria-label="Dismiss banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
