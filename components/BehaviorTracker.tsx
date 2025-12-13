"use client";

/**
 * BehaviorTracker Component
 * 
 * Initializes behavior tracking, session management, and Personalize SDK.
 * This component runs client-side to track user behavior for personalization.
 */

import { useEffect, useRef } from "react";
import { trackSessionStart, updateTimeOnSite, getUserBehavior } from "@/lib/behavior-tracking";
import { 
  initContentstackPersonalize, 
  setPersonalizeAttributes,
  getPersonalizeExperiences 
} from "@/lib/contentstack-personalize";

export default function BehaviorTracker() {
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartedRef = useRef(false);
  const personalizeInitializedRef = useRef(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    const initializeTracking = async () => {
      // Track session start (only once per mount)
      if (!sessionStartedRef.current) {
        sessionStartedRef.current = true;
        trackSessionStart();
        
        // Log personalization status
        const behavior = getUserBehavior();
        
        console.group('🎯 BehaviorTracker: Personalization Status');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 Session #:', behavior.sessionCount);
        console.log('👁️ Total Job Views:', behavior.totalJobViews);
        console.log('📖 Total Blog Reads:', behavior.totalBlogReads);
        console.log('📂 Top Categories:', behavior.interestedCategories.slice(0, 3).join(', ') || 'None yet');
        console.log('🔧 Top Skills:', behavior.interestedSkills.slice(0, 5).join(', ') || 'None yet');
        console.log('🔄 Is Returning User:', behavior.sessionCount > 1);
        console.log('📝 Applied Jobs:', behavior.appliedJobs.length);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.groupEnd();

        // Initialize Contentstack Personalize SDK
        if (!personalizeInitializedRef.current) {
          personalizeInitializedRef.current = true;
          
          const projectUid = process.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID;
          
          console.group('🚀 BehaviorTracker: Initializing Personalize SDK');
          console.log('Project UID:', projectUid ? `${projectUid.substring(0, 8)}...` : '❌ NOT SET');
          
          if (!projectUid) {
            console.error('❌ NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID is not set!');
            console.log('👉 Add it to your .env file');
            console.groupEnd();
            return;
          }

          try {
            const sdk = await initContentstackPersonalize(projectUid);
            
            if (sdk) {
              console.log('✅ Personalize SDK initialized successfully');
              
              // Calculate engagement level
              const engagementLevel = behavior.totalJobViews > 20 ? 'high' : 
                                     behavior.totalJobViews > 5 ? 'medium' : 'low';
              
              // Prepare attributes to send
              const attributes = {
                // From behavior tracking
                total_job_views: behavior.totalJobViews,
                total_blog_reads: behavior.totalBlogReads,
                engagement_level: engagementLevel,
                session_count: behavior.sessionCount,
                top_category: behavior.interestedCategories[0] || 'general',
                top_skill: behavior.interestedSkills[0] || '',
                interested_categories: behavior.interestedCategories.join(','),
                is_returning_user: behavior.sessionCount > 1,
                has_applied: behavior.appliedJobs.length > 0,
                jobs_applied_count: behavior.appliedJobs.length,
                
                // Legacy attributes (for existing experiences)
                time_on_site: behavior.totalTimeOnSite,
                has_clicked_apply_now: localStorage.getItem("apply_now_clicked") === "true",
                first_time_user: behavior.sessionCount === 1,
              };
              
              console.log('📤 Sending attributes to Personalize:', attributes);
              
              await setPersonalizeAttributes(attributes);
              
              console.log('✅ Attributes sent successfully');
              
              // Wait a moment for SDK to process
              await new Promise(resolve => setTimeout(resolve, 500));
              
              // Check active experiences
              const experiences = await getPersonalizeExperiences();
              
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('🎭 Active Experiences:', experiences.length);
              
              if (experiences.length > 0) {
                experiences.forEach((exp: any, idx: number) => {
                  console.log(`  ${idx + 1}. ${exp.name || exp.shortUid}`);
                  console.log(`     - Active Variant: ${exp.activeVariantShortUid || 'NONE'}`);
                  console.log(`     - Variants:`, exp.variants?.length || 0);
                });
              } else {
                console.log('  ⚠️ No experiences found');
                console.log('  👉 Check Personalize dashboard for active experiences');
              }
              
            } else {
              console.log('⚠️ Personalize SDK returned null');
              console.log('👉 Check if @contentstack/personalize-edge-sdk is installed');
            }
          } catch (error) {
            console.error('❌ Error initializing Personalize:', error);
          }
          
          console.groupEnd();
        }
      }
    };

    initializeTracking();

    // Track time on site every 30 seconds
    timeIntervalRef.current = setInterval(() => {
      updateTimeOnSite(30);
    }, 30000);

    // Cleanup
    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}

