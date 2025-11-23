"use client";

import { useState, useEffect, useRef } from "react";
import { X, Clock, ArrowRight } from "lucide-react";
import { 
  initContentstackPersonalize, 
  setPersonalizeAttributes, 
  getPersonalizeExperiences,
  trackPersonalizeEvent,
  PersonalizeUserAttributes 
} from "@/lib/contentstack-personalize";

// Interface for Contentstack personalized banner entry
export interface ContentstackBannerData {
  banner_title?: string;
  banner_message?: string;
  cta_text?: string;
  cta_link?: string | { title?: string; href: string }; // Link can be string or object
  delay_seconds?: number;
  enabled?: boolean;
  user_segment?: string;
  priority?: number;
  [key: string]: any; // Allow additional fields from Contentstack
}

interface PersonalizedBannerProps {
  /**
   * Contentstack banner data (overrides individual props if provided)
   */
  contentstackData?: ContentstackBannerData | null;
  /**
   * Time in milliseconds before showing the banner (default: 30000 = 30 seconds)
   */
  delay?: number;
  /**
   * Banner title text
   */
  title?: string;
  /**
   * Banner message text
   */
  message?: string;
  /**
   * CTA button text
   */
  ctaText?: string;
  /**
   * CTA button link
   */
  ctaLink?: string;
  /**
   * Whether to persist banner dismissal across sessions
   */
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
  const [dynamicBannerData, setDynamicBannerData] = useState<ContentstackBannerData | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timeOnSiteRef = useRef<number>(0);
  const personalizeSDKReadyRef = useRef<boolean>(false); // Track if SDK is initialized

  // Use dynamic banner data if available, otherwise use props/Contentstack data
  const finalBannerData = dynamicBannerData || contentstackData;
  const finalBannerTitle = finalBannerData?.banner_title || title || "Still Exploring?";
  const finalBannerMessage = finalBannerData?.banner_message || message || "Don't miss out on great opportunities! Apply now to get started.";
  const finalBannerCtaText = finalBannerData?.cta_text || ctaText || "Apply Now";
  
  // Handle link field - can be string or object with {title, href}
  const ctaLinkValue = finalBannerData?.cta_link || ctaLink || "/jobs";
  const finalBannerCtaLink = typeof ctaLinkValue === 'string' 
    ? ctaLinkValue 
    : (ctaLinkValue?.href || "/jobs");
  const finalBannerDelay = finalBannerData?.delay_seconds 
    ? finalBannerData.delay_seconds * 1000 
    : delay || 30000;
  const finalIsEnabled = finalBannerData?.enabled !== false;

  // Don't show banner if disabled in Contentstack
  if (!finalIsEnabled) {
    return null;
  }

  // Initialize Contentstack Personalize SDK (client-side only)
  useEffect(() => {
    const projectUid = process.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID;
    
    if (projectUid) {
      console.log('🚀 Initializing Contentstack Personalize SDK...', { projectUid });
      initContentstackPersonalize(projectUid).then((personalize) => {
        if (personalize) {
          console.log('✅ PersonalizedBanner: Contentstack Personalize SDK is active!');
          personalizeSDKReadyRef.current = true; // Mark SDK as ready
          
          // Set user attributes for personalization
          const userAttributes: PersonalizeUserAttributes = {
            time_on_site: timeOnSiteRef.current,
            has_clicked_apply_now: hasClickedApplyNow,
            user_segment: hasClickedApplyNow ? undefined : "users_not_applied_30s",
          };
          
          setPersonalizeAttributes(userAttributes);
          
          // If banner should be shown and we haven't fetched personalized content yet, 
          // trigger a fetch now that SDK is ready
          const elapsed = Date.now() - (startTimeRef.current || Date.now());
          const bannerDelay = finalBannerData?.delay_seconds 
            ? finalBannerData.delay_seconds * 1000 
            : delay || 30000;
          
          if (elapsed >= bannerDelay && !dynamicBannerData) {
            console.log('🔄 PersonalizedBanner: SDK now ready, retrying fetch with Personalize SDK...');
            
            // Retry fetch now that SDK is ready
            setTimeout(async () => {
              const timeOnSite = Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000);
              const applyNowClicked = localStorage.getItem("apply_now_clicked") === "true";
              
              try {
                await setPersonalizeAttributes({
                  time_on_site: timeOnSite,
                  has_clicked_apply_now: applyNowClicked,
                  user_segment: applyNowClicked ? undefined : "users_not_applied_30s",
                });
                
                await new Promise(resolve => setTimeout(resolve, 200));
                
                const experiences = await getPersonalizeExperiences();
                console.log('🔍 PersonalizedBanner: Checking experiences', {
                  experiencesCount: experiences.length,
                  experiences: experiences,
                  activeVariants: experiences.filter((exp: any) => exp.activeVariantShortUid !== null).length,
                  inactiveVariants: experiences.filter((exp: any) => exp.activeVariantShortUid === null).length
                });
                
                // Check if any experience has an active variant
                const hasActiveVariant = experiences.some((exp: any) => exp.activeVariantShortUid !== null);
                if (!hasActiveVariant) {
                  console.warn('⚠️ PersonalizedBanner: No active variants found!', {
                    reason: 'User attributes may not match audience rules',
                    userAttributes: {
                      time_on_site: timeOnSite,
                      has_clicked_apply_now: applyNowClicked,
                      user_segment: applyNowClicked ? undefined : "users_not_applied_30s"
                    },
                    attributeDetails: {
                      time_on_site: {
                        value: timeOnSite,
                        type: typeof timeOnSite,
                        shouldMatch: timeOnSite >= 30 ? 'YES (>= 30)' : 'NO (< 30)'
                      },
                      has_clicked_apply_now: {
                        value: applyNowClicked,
                        type: typeof applyNowClicked,
                        shouldMatch: applyNowClicked === false ? 'YES (false)' : 'NO (true)'
                      },
                      user_segment: {
                        value: applyNowClicked ? undefined : "users_not_applied_30s",
                        type: typeof (applyNowClicked ? undefined : "users_not_applied_30s")
                      }
                    },
                    experiences: experiences.map((exp: any) => ({
                      shortUid: exp.shortUid,
                      activeVariantShortUid: exp.activeVariantShortUid,
                      hasActiveVariant: exp.activeVariantShortUid !== null
                    })),
                    troubleshooting: [
                      '1. Check if audience rules match these exact attribute names: time_on_site, has_clicked_apply_now',
                      '2. Verify attribute types: time_on_site should be number, has_clicked_apply_now should be boolean',
                      '3. Check if audience condition is: time_on_site > 30 AND has_clicked_apply_now = false',
                      '4. Ensure the variant is linked to the correct audience',
                      '5. Check if the experience is published/active'
                    ],
                    suggestion: 'Check audience rules in Contentstack Personalize dashboard'
                  });
                }
                
                const { getPersonalizedContent } = await import('@/lib/contentstack-personalize');
                const personalizeContent = await getPersonalizedContent('personalized_banner');
                
                console.log('🔍 PersonalizedBanner: Content check result', {
                  hasContent: !!personalizeContent,
                  contentType: typeof personalizeContent,
                  contentKeys: personalizeContent ? Object.keys(personalizeContent) : []
                });
                
                if (personalizeContent) {
                  console.log('✅ PersonalizedBanner: Using personalized content from Contentstack Personalize!', {
                    banner_title: personalizeContent.banner_title,
                    experiences_count: experiences.length,
                    fullContent: personalizeContent
                  });
                  setDynamicBannerData(personalizeContent);
                  setShowBanner(true);
                  await trackPersonalizeEvent('banner_impression', {
                    banner_title: personalizeContent.banner_title,
                  });
                } else {
                  // No variant is active, fetch the base entry from Contentstack
                  console.log('ℹ️ PersonalizedBanner: No active variant, fetching base entry from Contentstack', {
                    experiencesCount: experiences.length,
                    reason: 'No variant active - fetching base/default entry'
                  });
                  
                  // Fetch base entry from Contentstack (no user context = default entry)
                  // COMMENTED OUT: Fallback code
                  /*
                  try {
                    const response = await fetch('/api/personalized-banner');
                    if (response.ok) {
                      const result = await response.json();
                      if (result.success && result.data) {
                        console.log('✅ PersonalizedBanner: Using base entry from Contentstack', {
                          banner_title: result.data.banner_title
                        });
                        setDynamicBannerData(result.data);
                        setShowBanner(true);
                        return; // Use base entry, don't fall through
                      }
                    }
                  } catch (error) {
                    console.error('❌ Failed to fetch base entry:', error);
                    // Fall through to API method with user_segment filtering
                  }
                  */
                }
              } catch (error) {
                console.error('❌ Failed to fetch personalized content after SDK init:', error);
              }
            }, 300); // Small delay to ensure SDK is fully ready
          }
        } else {
          console.log('ℹ️ PersonalizedBanner: Contentstack Personalize SDK not available, using fallback method');
          personalizeSDKReadyRef.current = false;
        }
      });
    } else {
      console.log('ℹ️ PersonalizedBanner: No Personalize Project UID found, using fallback method');
      personalizeSDKReadyRef.current = false;
    }
  }, []);

  // Check localStorage for existing state
  useEffect(() => {
    const storageKey = persistDismissal ? "banner_dismissed_permanent" : "banner_dismissed_session";
    const sessionStartKey = "session_start_time"; // Declare early so it can be used in dismissal logic
    const dismissed = localStorage.getItem(storageKey);
    
    // If dismissed permanently, don't show again
    if (persistDismissal && dismissed === "true") {
      return; // Don't show banner if permanently dismissed
    }
    
    // Progressive delay system: If dismissed, check if enough time has passed based on dismissal count
    // 1st dismissal: wait 1 minute (60s), 2nd: 1.5 minutes (90s), 3rd: 2 minutes (120s), etc.
    if (!persistDismissal && dismissed === "true") {
      const dismissCountKey = "banner_dismissed_count";
      const dismissTimeKey = "banner_dismissed_time";
      
      const dismissCount = parseInt(localStorage.getItem(dismissCountKey) || "0", 10);
      const dismissTime = localStorage.getItem(dismissTimeKey);
      
      if (dismissTime) {
        const timeSinceDismiss = Date.now() - parseInt(dismissTime, 10);
        
        // Calculate progressive delay: 30s base + (dismissCount * 30s)
        // 1st dismissal (count=1): 30s + 30s = 60s (1 minute)
        // 2nd dismissal (count=2): 30s + 60s = 90s (1.5 minutes)
        // 3rd dismissal (count=3): 30s + 90s = 120s (2 minutes)
        const progressiveDelay = finalBannerDelay + (dismissCount * 30000); // 30 seconds per dismissal
        
        if (timeSinceDismiss < progressiveDelay) {
          // Not enough time has passed, set a timer to check again when delay is met
          const remainingDelay = progressiveDelay - timeSinceDismiss;
          timerRef.current = setTimeout(() => {
            // When delay is met, clear dismissal and show banner immediately
            localStorage.removeItem(storageKey);
            // Show banner right away since enough time has passed
            setShowBanner(true);
          }, remainingDelay);
          return; // Don't show banner yet
        }
        // Enough time has passed, clear dismissal flag and show banner immediately
        localStorage.removeItem(storageKey);
        // Show banner right away since enough time has passed since dismissal
        setShowBanner(true);
        return; // Exit early since we're showing the banner now
      } else {
        // Old dismissal without timestamp, reset and allow to show again
        localStorage.removeItem(storageKey);
        localStorage.removeItem(dismissCountKey);
      }
    }

    // Check if user has already clicked Apply Now
    const applyNowClicked = localStorage.getItem("apply_now_clicked");
    if (applyNowClicked === "true") {
      setHasClickedApplyNow(true);
      return; // Don't show banner if already clicked
    }

    // Get session start time or set it
    let sessionStartTime = localStorage.getItem(sessionStartKey);
    
    // Only set new session start if it wasn't already set by dismissal logic above
    if (!sessionStartTime) {
      // New session, set start time
      const now = Date.now();
      localStorage.setItem(sessionStartKey, now.toString());
      startTimeRef.current = now;
    } else {
      startTimeRef.current = parseInt(sessionStartTime, 10);
    }

    // Calculate elapsed time
    const elapsed = Date.now() - (startTimeRef.current || Date.now());
    timeOnSiteRef.current = Math.floor(elapsed / 1000);
    
    // Optional: Fetch personalized banner dynamically when about to show
    const fetchPersonalizedBanner = async () => {
      // Check if Contentstack Personalize SDK is available
      const projectUid = process.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID;
      const usePersonalizeSDK = !!projectUid;
      
      // Only fetch if we want dynamic personalization
      const shouldFetchDynamic = process.env.NEXT_PUBLIC_ENABLE_DYNAMIC_PERSONALIZATION === 'true' || usePersonalizeSDK;
      
      if (shouldFetchDynamic) {
        try {
          const timeOnSite = Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000);
          const applyNowClicked = localStorage.getItem("apply_now_clicked") === "true";
          
          // Try Contentstack Personalize SDK first (if available and initialized)
          if (usePersonalizeSDK && personalizeSDKReadyRef.current) {
            try {
              console.log('🔄 PersonalizedBanner: Fetching content via Contentstack Personalize SDK...');
              
              // Update user attributes
              await setPersonalizeAttributes({
                time_on_site: timeOnSite,
                has_clicked_apply_now: applyNowClicked,
                user_segment: applyNowClicked ? undefined : "users_not_applied_30s",
              });
              
              // Wait a bit to ensure attributes are set
              await new Promise(resolve => setTimeout(resolve, 100));
              
              // Get active experiences
              const experiences = await getPersonalizeExperiences();
              
              // Get personalized content from Personalize
              // Note: This requires @contentstack/personalize-edge-sdk to be installed
              // The getPersonalizedContent function is in contentstack-personalize.ts
              const { getPersonalizedContent } = await import('@/lib/contentstack-personalize');
              const personalizeContent = await getPersonalizedContent('personalized_banner');
              
              if (personalizeContent) {
                console.log('✅ PersonalizedBanner: Using personalized content from Contentstack Personalize!', {
                  banner_title: personalizeContent.banner_title,
                  experiences_count: experiences.length
                });
                setDynamicBannerData(personalizeContent);
                // Track banner impression
                await trackPersonalizeEvent('banner_impression', {
                  banner_title: personalizeContent.banner_title,
                });
                return; // Use Personalize content, skip API fallback
              } else {
                // No variant is active, fetch the base entry from Contentstack
                console.log('ℹ️ PersonalizedBanner: No personalized content from SDK, fetching base entry', {
                  reason: 'No active variant - fetching base/default entry from Contentstack'
                });
                
                // COMMENTED OUT: Fallback code
                /*
                // Fetch base entry (no query params = default entry)
                try {
                  const baseResponse = await fetch('/api/personalized-banner');
                  if (baseResponse.ok) {
                    const baseResult = await baseResponse.json();
                    if (baseResult.success && baseResult.data) {
                      console.log('✅ PersonalizedBanner: Using base entry from Contentstack', {
                        banner_title: baseResult.data.banner_title
                      });
                      setDynamicBannerData(baseResult.data);
                      return; // Use base entry, don't fall through
                    }
                  }
                } catch (error) {
                  console.error('❌ Failed to fetch base entry:', error);
                  // Fall through to behavior-based API method
                }
                */
              }
            } catch (personalizeError) {
              console.warn('⚠️ PersonalizedBanner: Contentstack Personalize SDK error, falling back to base entry:', personalizeError);
              // COMMENTED OUT: Fallback code
              /*
              // Try to fetch base entry on error
              try {
                const baseResponse = await fetch('/api/personalized-banner');
                if (baseResponse.ok) {
                  const baseResult = await baseResponse.json();
                  if (baseResult.success && baseResult.data) {
                    console.log('✅ PersonalizedBanner: Using base entry after SDK error', {
                      banner_title: baseResult.data.banner_title
                    });
                    setDynamicBannerData(baseResult.data);
                    return;
                  }
                }
              } catch (error) {
                console.error('❌ Failed to fetch base entry after SDK error:', error);
                // Fall through to behavior-based API method
              }
              */
            }
          } else if (usePersonalizeSDK && !personalizeSDKReadyRef.current) {
            console.log('⏳ PersonalizedBanner: SDK not ready yet, fetching base entry');
            // COMMENTED OUT: Fallback code
            /*
            // Fetch base entry while SDK initializes
            try {
              const baseResponse = await fetch('/api/personalized-banner');
              if (baseResponse.ok) {
                const baseResult = await baseResponse.json();
                if (baseResult.success && baseResult.data) {
                  console.log('✅ PersonalizedBanner: Using base entry (SDK not ready)', {
                    banner_title: baseResult.data.banner_title
                  });
                  setDynamicBannerData(baseResult.data);
                  return;
                }
              }
            } catch (error) {
              console.error('❌ Failed to fetch base entry:', error);
            }
            */
          } else {
            console.log('ℹ️ PersonalizedBanner: Using API route method (Personalize SDK not configured)');
          }
          
          // COMMENTED OUT: Final fallback code
          /*
          // Final fallback: Use API route method with behavior-based filtering
          // This method filters the base entry by user_segment based on user behavior
          const params = new URLSearchParams({
            timeOnSite: timeOnSite.toString(),
            hasClickedApplyNow: applyNowClicked.toString(),
            userSegment: applyNowClicked ? "" : "users_not_applied_30s",
          });

          console.log('🔄 PersonalizedBanner: Fetching banner via API (behavior-based fallback)', {
            userSegment: applyNowClicked ? "" : "users_not_applied_30s",
            timeOnSite,
            hasClickedApplyNow: applyNowClicked
          });

          const response = await fetch(`/api/personalized-banner?${params.toString()}`);
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
              console.log('✅ PersonalizedBanner: Using behavior-based banner from API', {
                banner_title: result.data.banner_title,
                user_segment: result.data.user_segment
              });
              setDynamicBannerData(result.data);
            }
          }
          */
        } catch (error) {
          console.error("Failed to fetch personalized banner:", error);
          // Fall back to static content
        }
      }
    };

    if (elapsed >= finalBannerDelay) {
      // Already past the delay, fetch personalized content and show
      fetchPersonalizedBanner().then(() => {
        setShowBanner(true);
      });
    } else {
      // Set timer for remaining time
      const remainingTime = finalBannerDelay - elapsed;
      timerRef.current = setTimeout(() => {
        fetchPersonalizedBanner().then(() => {
          setShowBanner(true);
        });
      }, remainingTime);
    }

    // Listen for Apply Now button clicks
    const handleApplyNowClick = () => {
      setHasClickedApplyNow(true);
      localStorage.setItem("apply_now_clicked", "true");
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setShowBanner(false);
    };

    // Listen for clicks on any element with "Apply Now" text or data attribute
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const buttonText = target.textContent?.toLowerCase() || "";
      const hasApplyNowText = buttonText.includes("apply now") || 
                              buttonText.includes("apply") ||
                              target.closest('[data-apply-now="true"]') !== null;
      
      if (hasApplyNowText) {
        handleApplyNowClick();
      }
    };

    document.addEventListener("click", handleClick);

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      document.removeEventListener("click", handleClick);
    };
  }, [finalBannerDelay, persistDismissal]);

  const handleDismiss = () => {
    setShowBanner(false);
    const storageKey = persistDismissal ? "banner_dismissed_permanent" : "banner_dismissed_session";
    localStorage.setItem(storageKey, "true");
    
    // If session dismissal, store timestamp and increment dismissal count for progressive delays
    if (!persistDismissal) {
      const dismissCountKey = "banner_dismissed_count";
      const currentCount = parseInt(localStorage.getItem(dismissCountKey) || "0", 10);
      const newCount = currentCount + 1;
      
      localStorage.setItem("banner_dismissed_time", Date.now().toString());
      localStorage.setItem(dismissCountKey, newCount.toString());
      
      // Log for debugging (optional)
      const nextDelayMinutes = (finalBannerDelay + (newCount * 30000)) / 60000;
      console.log(`Banner dismissed (${newCount} time${newCount > 1 ? 's' : ''}). Will check again after ${nextDelayMinutes.toFixed(1)} minutes.`);
    }
  };

  const handleCTAClick = async () => {
    // Mark as clicked when CTA is clicked
    localStorage.setItem("apply_now_clicked", "true");
    setHasClickedApplyNow(true);
    setShowBanner(false);
    
    // Track event in Contentstack Personalize (if available)
    await trackPersonalizeEvent('banner_cta_click', {
      banner_title: finalBannerTitle,
      cta_text: finalBannerCtaText,
    });
    
    // Update Personalize attributes
    await setPersonalizeAttributes({
      has_clicked_apply_now: true,
      user_segment: undefined, // Clear segment since they clicked
    });
    
    // Navigate to the link
    if (finalBannerCtaLink.startsWith("http")) {
      window.open(finalBannerCtaLink, "_blank");
    } else {
      window.location.href = finalBannerCtaLink;
    }
  };

  // Don't render if conditions aren't met
  if (!showBanner || hasClickedApplyNow) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-xl border border-blue-500 p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="flex-shrink-0 mt-1">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold mb-1">
                  {finalBannerTitle}
                </h3>
                <p className="text-sm sm:text-base text-blue-100 mb-3">
                  {finalBannerMessage}
                </p>
                <button
                  onClick={handleCTAClick}
                  className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md font-medium text-sm sm:text-base transition-colors"
                >
                  {finalBannerCtaText}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-white hover:text-blue-200 transition-colors p-1"
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

