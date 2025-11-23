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

  // Initialize Contentstack Personalize SDK (client-side only)
  useEffect(() => {
    // Don't initialize if banner is disabled
    if (!finalIsEnabled) {
      return;
    }
    const projectUid = process.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID;
    
    if (projectUid) {
      console.log('🚀 Initializing Contentstack Personalize SDK...', { projectUid });
      initContentstackPersonalize(projectUid).then((personalize) => {
        if (personalize) {
          console.log('✅ PersonalizedBanner: Contentstack Personalize SDK is active!');
          personalizeSDKReadyRef.current = true; // Mark SDK as ready
          
          // Set user attributes for personalization - matching your Contentstack Personalize setup
          // Attributes: time_on_site, has_clicked_apply_now, first_time_user
          const isFirstTimeUser = !localStorage.getItem("session_start_time") || 
                                  localStorage.getItem("first_visit") === null;
          
          const userAttributes: PersonalizeUserAttributes = {
            time_on_site: timeOnSiteRef.current,
            has_clicked_apply_now: hasClickedApplyNow,
            first_time_user: isFirstTimeUser,
          };
          
          setPersonalizeAttributes(userAttributes);
          
          // Immediately fetch and log full summary for verification (test fetch)
          setTimeout(async () => {
            try {
              const timeOnSite = Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000);
              const applyNowClicked = localStorage.getItem("apply_now_clicked") === "true";
              const isFirstTimeUserCheck = !localStorage.getItem("session_start_time") || 
                                          localStorage.getItem("first_visit") === null;
              
              const testAttributes = {
                time_on_site: timeOnSite,
                has_clicked_apply_now: applyNowClicked,
                first_time_user: isFirstTimeUserCheck,
              };
              
              await setPersonalizeAttributes(testAttributes);
              
              // Verify attributes were set correctly
              const { getCurrentAttributes } = await import('@/lib/contentstack-personalize');
              await new Promise(resolve => setTimeout(resolve, 200));
              await getCurrentAttributes();
              
              // CRITICAL: Wait longer for SDK to process attributes and evaluate audience rules
              console.log('⏳ Waiting for SDK to process attributes and evaluate audience rules...');
              await new Promise(resolve => setTimeout(resolve, 1000)); // Increased to 1 second
              
              // Try getting experiences multiple times to see if they activate
              let experiences = await getPersonalizeExperiences();
              let retryCount = 0;
              const maxRetries = 3;
              
              // Retry if no active variants (SDK might need more time)
              while (retryCount < maxRetries && experiences.every((exp: any) => exp.activeVariantShortUid === null)) {
                retryCount++;
                console.log(`🔄 Retry ${retryCount}/${maxRetries}: Waiting for variant activation...`);
                await new Promise(resolve => setTimeout(resolve, 500));
                experiences = await getPersonalizeExperiences();
              }
              
              if (retryCount > 0) {
                console.log(`ℹ️ Checked ${retryCount + 1} time(s) for active variants`);
              }
              
              // Final diagnostic: Check if SDK has the attributes
              console.group('🔬 Final Diagnostic Check');
              const finalAttrs = await getCurrentAttributes();
              if (finalAttrs) {
                console.log('✅ SDK has attributes stored');
                console.log('Expected: first_time_user = true (for First_time_users audience)');
                console.log('Actual:', finalAttrs);
                const firstTimeMatch = finalAttrs.first_time_user === true;
                console.log('first_time_user match:', firstTimeMatch ? '✅ TRUE' : `❌ ${finalAttrs.first_time_user}`);
              } else {
                console.log('❌ SDK does not have attributes stored!');
                console.log('This might be why variants are not activating.');
              }
              
              // Check experience details for common issues
              console.log('\n🔍 Common Issues Checklist:');
              experiences.forEach((exp: any, idx: number) => {
                console.log(`\nExperience ${idx + 1} (${exp.shortUid}):`);
                console.log('  ✅ Experience exists:', !!exp);
                console.log('  ❌ Active variant:', exp.activeVariantShortUid || 'NONE');
                console.log('  Experience name:', exp.name || exp.title || 'N/A');
                console.log('  Experience status:', exp.status || exp.state || 'N/A');
                
                if (exp.variants && exp.variants.length > 0) {
                  exp.variants.forEach((variant: any, vIdx: number) => {
                    const audiences = variant.audiences || variant.audienceIds || variant.audience || [];
                    const audienceArray = Array.isArray(audiences) ? audiences : (audiences ? [audiences] : []);
                    const audienceNames = audienceArray.map((a: any) => {
                      if (typeof a === 'string') return a;
                      if (a && typeof a === 'object') return a.name || a.id || a.uid || JSON.stringify(a);
                      return String(a);
                    });
                    
                    console.log(`  Variant ${vIdx + 1} (${variant.name || variant.uid}):`);
                    console.log('    - Audiences:', audienceNames.length > 0 ? audienceNames.join(', ') : 'NONE');
                    console.log('    - Has content entry:', !!(variant.entryUid || variant.entry || variant.content));
                    console.log('    - Content entry UID:', variant.entryUid || variant.entry || variant.content || 'NONE');
                    console.log('    - Is active:', variant.uid === exp.activeVariantShortUid || variant.shortUid === exp.activeVariantShortUid);
                    
                    // Check if audience name matches
                    if (matchesFirstTime && audienceNames.length > 0) {
                      const hasFirstTimeAudience = audienceNames.some((name: string) => 
                        name.toLowerCase().includes('first') || 
                        name.toLowerCase().includes('first_time') ||
                        name === 'First_time_users'
                      );
                      console.log('    - Matches "First_time_users"?', hasFirstTimeAudience ? '✅ YES' : `❌ NO (has: ${audienceNames.join(', ')})`);
                      if (!hasFirstTimeAudience) {
                        console.log('      ⚠️ Audience name mismatch! Expected "First_time_users" but variant has:', audienceNames);
                      }
                    }
                  });
                } else {
                  console.log('  ⚠️ No variants found in experience!');
                  console.log('  Full experience data:', JSON.stringify(exp, null, 2));
                }
              });
              
              console.log('\n💡 If everything is linked but still inactive, check:');
              console.log('  1. DAL Connection: Go to Administration > Data Activation Layer');
              console.log('     → Ensure Personalize project is connected to active DAL');
              console.log('     → Test the connection');
              console.log('  2. Audience Sync: Audiences must be synced from Lytics/Data source');
              console.log('     → Check if "First_time_users" audience exists and is active');
              console.log('     → Check if "users_not_applied_30s" audience exists and is active');
              console.log('  3. Content Entry Linking: Not just content type, but specific entry');
              console.log('     → In Experience config, ensure entry is selected for variant');
              console.log('  4. Experience Publishing: Experience must be published, not just saved');
              console.log('  5. Attribute Format: Ensure attributes match exactly (case-sensitive)');
              console.log('     → first_time_user (not firstTimeUser or First_Time_User)');
              console.log('     → has_clicked_apply_now (not hasClickedApplyNow)');
              console.log('     → time_on_site (not timeOnSite)');
              
              console.groupEnd();
              
              // Comprehensive summary log for all 5 items
              console.group('📋 PersonalizedBanner: Complete Personalization Summary (Initial Check)');
              
              // 1. Attributes
              console.group('1️⃣ Attributes (Sent to SDK)');
              console.table(testAttributes);
              Object.entries(testAttributes).forEach(([key, value]) => {
                if (value !== undefined) {
                  console.log(`  ${key}:`, value, `(${typeof value})`);
                }
              });
              console.groupEnd();
              
              // 2. Experiences - WITH CRITICAL VARIANT AUDIENCE CHECK
              console.group('2️⃣ Experiences');
              console.log('Total:', experiences.length);
              experiences.forEach((exp: any, index: number) => {
                console.log(`  Experience ${index + 1}:`, {
                  shortUid: exp.shortUid,
                  hasActiveVariant: exp.activeVariantShortUid !== null,
                  activeVariantUid: exp.activeVariantShortUid
                });
                
                // CRITICAL: Show variant audiences immediately
                if (exp.variants && Array.isArray(exp.variants) && exp.variants.length > 0) {
                  console.log(`  🔍 Experience ${index + 1} Variant Details:`);
                  exp.variants.forEach((variant: any, vIdx: number) => {
                    const audiences = variant.audiences || variant.audienceIds || variant.audience || [];
                    const audienceArray = Array.isArray(audiences) ? audiences : (audiences ? [audiences] : []);
                    const audienceNames = audienceArray.map((a: any) => {
                      if (typeof a === 'string') return a;
                      if (a && typeof a === 'object') return a.name || a.id || a.uid || JSON.stringify(a);
                      return String(a);
                    });
                    
                    const isActive = variant.uid === exp.activeVariantShortUid || variant.shortUid === exp.activeVariantShortUid;
                    
                    console.log(`    Variant "${variant.name || variant.uid}":`, {
                      audiences: audienceNames.length > 0 ? audienceNames.join(', ') : 'NONE ❌',
                      hasContent: !!(variant.entryUid || variant.entry || variant.content),
                      contentEntry: variant.entryUid || variant.entry || variant.content || 'MISSING ❌',
                      isActive: isActive ? '✅ YES' : '❌ NO'
                    });
                    
                    // Check if this variant should match "First_time_users"
                    if (matchesFirstTime && audienceNames.length > 0) {
                      const shouldMatch = audienceNames.some((name: string) => 
                        name.toLowerCase().includes('first') || 
                        name === 'First_time_users' ||
                        name === 'first_time_users'
                      );
                      if (shouldMatch && !isActive) {
                        console.log(`    ⚠️🚨 CRITICAL ISSUE FOUND!`);
                        console.log(`    → Variant has "First_time_users" audience: ✅`);
                        console.log(`    → User matches audience (first_time_user=true): ✅`);
                        console.log(`    → But variant is INACTIVE: ❌`);
                        if (!(variant.entryUid || variant.entry || variant.content)) {
                          console.log(`    → ROOT CAUSE: Content entry NOT linked to variant!`);
                          console.log(`    → Action: Link content entry in Experience config or Settings > Variants`);
                        } else {
                          console.log(`    → Content entry IS linked: ${variant.entryUid || variant.entry || variant.content}`);
                          console.log(`    → Possible causes: Experience not published, DAL not connected, or SDK delay`);
                        }
                      }
                    }
                  });
                } else {
                  console.log(`  ⚠️ Experience ${index + 1} has NO variants!`);
                }
              });
              console.groupEnd();
              
              // 3. Variants (from experiences)
              console.group('3️⃣ Variants');
              const activeVariants = experiences.filter((exp: any) => exp.activeVariantShortUid !== null);
              const inactiveVariants = experiences.filter((exp: any) => exp.activeVariantShortUid === null);
              console.log('Active Variants:', activeVariants.length);
              activeVariants.forEach((exp: any, index: number) => {
                console.log(`  Variant ${index + 1}:`, {
                  variantUid: exp.activeVariantShortUid,
                  experienceUid: exp.shortUid
                });
              });
              console.log('Inactive Variants:', inactiveVariants.length);
              inactiveVariants.forEach((exp: any, index: number) => {
                console.log(`  Variant ${index + 1}:`, {
                  variantUid: 'null (no active variant)',
                  experienceUid: exp.shortUid,
                  reason: 'User attributes may not match audience rules'
                });
              });
              console.groupEnd();
              
              // 4. Audiences (from your Contentstack Personalize setup)
              console.group('4️⃣ Audiences');
              console.log('Configured Audiences:');
              console.log('  1. "users_not_applied_30s"');
              console.log('     Rules: time_on_site > 30 AND has_clicked_apply_now = false');
              const matchesUsersNotApplied = timeOnSite > 30 && applyNowClicked === false;
              console.log('     Match Status:', {
                time_on_site: timeOnSite > 30 ? `✅ Matches (${timeOnSite} > 30)` : `❌ Does not match (${timeOnSite} <= 30)`,
                has_clicked_apply_now: applyNowClicked === false ? '✅ Matches (false)' : '❌ Does not match (true)',
                overall: matchesUsersNotApplied ? '✅ User matches audience' : '❌ User does not match',
                note: timeOnSite <= 30 ? '⏳ Wait 30+ seconds for this audience to match' : ''
              });
              console.log('  2. "First_time_users"');
              console.log('     Rules: first_time_user = true');
              const matchesFirstTime = isFirstTimeUserCheck === true;
              console.log('     Match Status:', {
                first_time_user: isFirstTimeUserCheck ? '✅ Matches (true)' : '❌ Does not match (false)',
                overall: matchesFirstTime ? '✅ User matches audience' : '❌ User does not match',
                note: matchesFirstTime ? '💡 This should activate a variant if content is linked!' : ''
              });
              // 5. Variant Entries (Content) - Fetch first for diagnosis
              console.group('5️⃣ Variant Entries (Content)');
              const { getPersonalizedContent } = await import('@/lib/contentstack-personalize');
              const personalizeContent = await getPersonalizedContent('personalized_banner');
              
              console.log('\n🔍 Diagnosis:');
              if (!matchesUsersNotApplied && !matchesFirstTime) {
                console.log('  ⚠️ No audiences match - no variants will be active');
                console.log('  💡 Wait 30+ seconds for "users_not_applied_30s" to match');
              } else if (matchesFirstTime && activeVariants.length === 0) {
                console.log('  ⚠️ "First_time_users" matches but no variant is active!');
                console.log('  🔴 CRITICAL ISSUES TO CHECK:');
                console.log('  1. Content Linking (MOST COMMON):');
                console.log('     → Go to Contentstack > Settings > Variants');
                console.log('     → Find your variant (e.g., "first_time_banner")');
                console.log('     → Click "Link" and select your banner entry');
                console.log('     → Ensure content type is "Personalized Banner"');
                console.log('  2. Variant-Audience Assignment:');
                console.log('     → Go to Experience > Configuration');
                console.log('     → Verify variant is assigned to "First_time_users" audience');
                console.log('  3. Experience Status:');
                console.log('     → Ensure experience is "Active" (not Draft/Paused)');
                console.log('     → Check if experience is published');
                console.log('  4. SDK Processing:');
                console.log('     → Try refreshing page after 2-3 seconds');
                console.log('     → Attributes may need time to propagate');
              } else if (matchesUsersNotApplied && timeOnSite <= 30) {
                console.log('  ⏳ "users_not_applied_30s" will match after 30 seconds');
              } else if (matchesUsersNotApplied && activeVariants.length === 0) {
                console.log('  ⚠️ "users_not_applied_30s" matches but no variant is active!');
                console.log('  🔴 Check the same issues as above (content linking, variant assignment, etc.)');
              }
              console.log('\n📋 Quick Checklist:');
              console.log('  ✅ Attributes sent correctly:', Object.keys(testAttributes).join(', '));
              console.log('  ✅ Experiences retrieved:', experiences.length);
              console.log('  ❌ Active variants:', activeVariants.length, '(should be > 0 if audience matches)');
              console.log('  ❌ Variant content:', personalizeContent ? 'Found' : 'Missing');
              console.log('Has Variant Entry:', !!personalizeContent);
              console.log('Content Type:', typeof personalizeContent);
              if (personalizeContent) {
                console.log('✅ Variant content found!');
                console.log('Entry Keys:', Object.keys(personalizeContent));
                console.log('Entry Preview:', {
                  banner_title: personalizeContent.banner_title,
                  banner_message: personalizeContent.banner_message,
                  cta_text: personalizeContent.cta_text,
                  enabled: personalizeContent.enabled
                });
                console.log('Full Entry Data:', personalizeContent);
              } else {
                console.log('❌ No variant entry returned');
                console.log('\n🔴 ROOT CAUSE ANALYSIS:');
                if (activeVariants.length === 0) {
                  console.log('  → No active variants (this is why no content is returned)');
                  console.log('  → Variants are inactive because:');
                  if (matchesFirstTime) {
                    console.log('     • "First_time_users" audience matches, but variant still inactive');
                    console.log('     • Most likely: Content not linked to variant in Settings > Variants');
                  } else if (matchesUsersNotApplied) {
                    console.log('     • "users_not_applied_30s" audience matches, but variant still inactive');
                    console.log('     • Most likely: Content not linked to variant in Settings > Variants');
                  } else {
                    console.log('     • No audiences match user attributes');
                  }
                } else {
                  console.log('  → Variants are active but no content returned');
                  console.log('  → This means: Content is NOT linked to the active variant');
                  console.log('  → Action: Go to Settings > Variants and link content entry');
                }
                console.log('\n💡 Content Linking Steps:');
                console.log('  1. Go to Contentstack > Settings > Variants');
                console.log('  2. Find your variant (e.g., "first_time_banner" or "Test_banner")');
                console.log('  3. Click "Link" button next to the variant');
                console.log('  4. Select your "Personalized Banner" entry');
                console.log('  5. Save and publish');
                console.log('  6. Refresh this page');
              }
              console.groupEnd();
              
              console.groupEnd(); // End complete summary
            } catch (error) {
              console.error('❌ Error during initial personalization check:', error);
            }
          }, 500); // Small delay to ensure SDK is fully ready
          
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
                // Set attributes first - matching your Contentstack Personalize setup
                // Attributes: time_on_site, has_clicked_apply_now, first_time_user
                // Audiences: users_not_applied_30s (time_on_site > 30 AND has_clicked_apply_now = false)
                //           First_time_users (first_time_user = true)
                const isFirstTimeUser = !localStorage.getItem("session_start_time") || 
                                        localStorage.getItem("first_visit") === null;
                
                const userAttributes = {
                  time_on_site: timeOnSite,
                  has_clicked_apply_now: applyNowClicked,
                  first_time_user: isFirstTimeUser,
                };
                
                await setPersonalizeAttributes(userAttributes);
                
                await new Promise(resolve => setTimeout(resolve, 200));
                
                const experiences = await getPersonalizeExperiences();
                
                // Comprehensive summary log for all 5 items
                console.group('📋 PersonalizedBanner: Complete Personalization Summary');
                
                // 1. Attributes
                console.group('1️⃣ Attributes (Sent to SDK)');
                console.table(userAttributes);
                Object.entries(userAttributes).forEach(([key, value]) => {
                  console.log(`  ${key}:`, value, `(${typeof value})`);
                });
                console.groupEnd();
                
                // 2. Experiences
                console.group('2️⃣ Experiences');
                console.log('Total:', experiences.length);
                experiences.forEach((exp: any, index: number) => {
                  console.log(`  Experience ${index + 1}:`, {
                    shortUid: exp.shortUid,
                    hasActiveVariant: exp.activeVariantShortUid !== null,
                    activeVariantUid: exp.activeVariantShortUid
                  });
                });
                console.groupEnd();
                
                // 3. Variants (from experiences)
                console.group('3️⃣ Variants');
                const activeVariants = experiences.filter((exp: any) => exp.activeVariantShortUid !== null);
                const inactiveVariants = experiences.filter((exp: any) => exp.activeVariantShortUid === null);
                console.log('Active Variants:', activeVariants.length);
                activeVariants.forEach((exp: any, index: number) => {
                  console.log(`  Variant ${index + 1}:`, {
                    variantUid: exp.activeVariantShortUid,
                    experienceUid: exp.shortUid
                  });
                });
                console.log('Inactive Variants:', inactiveVariants.length);
                inactiveVariants.forEach((exp: any, index: number) => {
                  console.log(`  Variant ${index + 1}:`, {
                    variantUid: 'null (no active variant)',
                    experienceUid: exp.shortUid,
                    reason: 'User attributes may not match audience rules'
                  });
                });
                console.groupEnd();
                
                // 4. Audiences (inferred from variant configuration)
                console.group('4️⃣ Audiences');
                console.log('Expected Audience: "users_not_applied_30s"');
                console.log('Audience Rules:');
                console.log('  - time_on_site > 30');
                console.log('  - has_clicked_apply_now = false');
                console.log('Current User Match:', {
                  time_on_site: timeOnSite >= 30 ? '✅ Matches' : '❌ Does not match',
                  has_clicked_apply_now: applyNowClicked === false ? '✅ Matches' : '❌ Does not match'
                });
                console.groupEnd();
                
                console.groupEnd(); // End complete summary
                
                // Detailed logging for experiences and variants
                console.group('🎯 PersonalizedBanner: Experience & Variant Analysis');
                console.log('Total Experiences:', experiences.length);
                console.log('Active Variants:', experiences.filter((exp: any) => exp.activeVariantShortUid !== null).length);
                console.log('Inactive Variants:', experiences.filter((exp: any) => exp.activeVariantShortUid === null).length);
                
                experiences.forEach((exp: any, index: number) => {
                  console.group(`Experience ${index + 1}`);
                  console.log('Short UID:', exp.shortUid);
                  console.log('Active Variant UID:', exp.activeVariantShortUid);
                  console.log('Has Active Variant:', exp.activeVariantShortUid !== null);
                  console.log('Full Experience Data:', exp);
                  console.groupEnd();
                });
                console.groupEnd();
                
                // Check if any experience has an active variant
                const hasActiveVariant = experiences.some((exp: any) => exp.activeVariantShortUid !== null);
                if (!hasActiveVariant) {
                  console.group('⚠️ PersonalizedBanner: No Active Variants');
                  console.warn('Reason: User attributes may not match audience rules');
                  console.log('\n📊 User Attributes Sent:');
                  const isFirstTimeUser = !localStorage.getItem("session_start_time") || 
                                          localStorage.getItem("first_visit") === null;
                  
                  console.log({
                    time_on_site: {
                      value: timeOnSite,
                      type: typeof timeOnSite,
                      shouldMatch: timeOnSite > 30 ? '✅ YES (> 30)' : `❌ NO (${timeOnSite} <= 30)`
                    },
                    has_clicked_apply_now: {
                      value: applyNowClicked,
                      type: typeof applyNowClicked,
                      shouldMatch: applyNowClicked === false ? '✅ YES (false)' : '❌ NO (true)'
                    },
                    first_time_user: {
                      value: isFirstTimeUser,
                      type: typeof isFirstTimeUser,
                      shouldMatch: isFirstTimeUser ? '✅ YES (true)' : '❌ NO (false)'
                    }
                  });
                  console.log('\n🔍 Configured Audience Rules:');
                  console.log('Audience "users_not_applied_30s":');
                  console.log('  - time_on_site: Number greater than 30');
                  console.log('  - has_clicked_apply_now: Is false');
                  console.log('Audience "First_time_users":');
                  console.log('  - first_time_user: Is true');
                  console.log('\n💡 Troubleshooting:');
                  console.log('1. Check if audience rules match these exact attribute names');
                  console.log('2. Verify attribute types match (number, boolean)');
                  console.log('3. Ensure variant is linked to the correct audience');
                  console.log('4. Check if content is linked to the variant');
                  console.log('5. Verify experience is published/active');
                  console.groupEnd();
                }
                
                const { getPersonalizedContent } = await import('@/lib/contentstack-personalize');
                const personalizeContent = await getPersonalizedContent('personalized_banner');
                
                // 5. Variant Entries (Content)
                console.group('5️⃣ Variant Entries (Content)');
                console.log('Has Variant Entry:', !!personalizeContent);
                console.log('Content Type:', typeof personalizeContent);
                if (personalizeContent) {
                  console.log('Entry Keys:', Object.keys(personalizeContent));
                  console.log('Entry Preview:', {
                    banner_title: personalizeContent.banner_title,
                    banner_message: personalizeContent.banner_message,
                    cta_text: personalizeContent.cta_text,
                    enabled: personalizeContent.enabled
                  });
                  console.log('Full Entry Data:', personalizeContent);
                  console.log('Full Entry JSON:', JSON.stringify(personalizeContent, null, 2));
                } else {
                  console.log('❌ No variant entry returned');
                  console.log('Possible reasons:');
                  console.log('  - Content not linked to variant');
                  console.log('  - No active variant (audience rules not matched)');
                  console.log('  - Content type name mismatch');
                }
                console.groupEnd();
                
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
  }, [finalIsEnabled]);

  // Check localStorage for existing state
  useEffect(() => {
    // Don't run if banner is disabled
    if (!finalIsEnabled) {
      return;
    }
    
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
    const sessionStartTime = localStorage.getItem(sessionStartKey);
    
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
              
              // Set attributes first - matching your Contentstack Personalize setup
              // Attributes: time_on_site, has_clicked_apply_now, first_time_user
              // Audiences: users_not_applied_30s (time_on_site > 30 AND has_clicked_apply_now = false)
              //           First_time_users (first_time_user = true)
              const isFirstTimeUserCheck = !localStorage.getItem("session_start_time") || 
                                      localStorage.getItem("first_visit") === null;
              
              const userAttributes = {
                time_on_site: timeOnSite,
                has_clicked_apply_now: applyNowClicked,
                first_time_user: isFirstTimeUserCheck,
              };
              
              await setPersonalizeAttributes(userAttributes);
              
              // Wait a bit to ensure attributes are set
              await new Promise(resolve => setTimeout(resolve, 200));
              
              // Get active experiences
              const experiences = await getPersonalizeExperiences();
              
              // Comprehensive summary log for all 5 items
              console.group('📋 PersonalizedBanner: Complete Personalization Summary');
              
              // 1. Attributes
              console.group('1️⃣ Attributes (Sent to SDK)');
              console.table(userAttributes);
              Object.entries(userAttributes).forEach(([key, value]) => {
                if (value !== undefined) {
                  console.log(`  ${key}:`, value, `(${typeof value})`);
                }
              });
              console.groupEnd();
              
              // 2. Experiences
              console.group('2️⃣ Experiences');
              console.log('Total:', experiences.length);
              experiences.forEach((exp: any, index: number) => {
                console.log(`  Experience ${index + 1}:`, {
                  shortUid: exp.shortUid,
                  hasActiveVariant: exp.activeVariantShortUid !== null,
                  activeVariantUid: exp.activeVariantShortUid
                });
              });
              console.groupEnd();
              
              // 3. Variants (from experiences)
              console.group('3️⃣ Variants');
              const activeVariants = experiences.filter((exp: any) => exp.activeVariantShortUid !== null);
              const inactiveVariants = experiences.filter((exp: any) => exp.activeVariantShortUid === null);
              console.log('Active Variants:', activeVariants.length);
              activeVariants.forEach((exp: any, index: number) => {
                console.log(`  Variant ${index + 1}:`, {
                  variantUid: exp.activeVariantShortUid,
                  experienceUid: exp.shortUid
                });
              });
              console.log('Inactive Variants:', inactiveVariants.length);
              inactiveVariants.forEach((exp: any, index: number) => {
                console.log(`  Variant ${index + 1}:`, {
                  variantUid: 'null (no active variant)',
                  experienceUid: exp.shortUid,
                  reason: 'User attributes may not match audience rules'
                });
              });
              console.groupEnd();
              
              // 4. Audiences (from your Contentstack Personalize setup)
              console.group('4️⃣ Audiences');
              console.log('Configured Audiences:');
              console.log('  1. "users_not_applied_30s"');
              console.log('     Rules: time_on_site > 30 AND has_clicked_apply_now = false');
              console.log('     Match Status:', {
                time_on_site: timeOnSite > 30 ? '✅ Matches (> 30)' : `❌ Does not match (${timeOnSite} <= 30)`,
                has_clicked_apply_now: applyNowClicked === false ? '✅ Matches (false)' : '❌ Does not match (true)',
                overall: timeOnSite > 30 && applyNowClicked === false ? '✅ User matches audience' : '❌ User does not match'
              });
              console.log('  2. "First_time_users"');
              console.log('     Rules: first_time_user = true');
              console.log('     Match Status:', {
                first_time_user: isFirstTimeUserCheck ? '✅ Matches (true)' : '❌ Does not match (false)',
                overall: isFirstTimeUserCheck ? '✅ User matches audience' : '❌ User does not match'
              });
              console.groupEnd();
              
              console.groupEnd(); // End complete summary
              
              // Get personalized content from Personalize
              // Note: This requires @contentstack/personalize-edge-sdk to be installed
              // The getPersonalizedContent function is in contentstack-personalize.ts
              const { getPersonalizedContent } = await import('@/lib/contentstack-personalize');
              const personalizeContent = await getPersonalizedContent('personalized_banner');
              
              // 5. Variant Entries (Content)
              console.group('5️⃣ Variant Entries (Content)');
              console.log('Has Variant Entry:', !!personalizeContent);
              console.log('Content Type:', typeof personalizeContent);
              if (personalizeContent) {
                console.log('Entry Keys:', Object.keys(personalizeContent));
                console.log('Entry Preview:', {
                  banner_title: personalizeContent.banner_title,
                  banner_message: personalizeContent.banner_message,
                  cta_text: personalizeContent.cta_text,
                  enabled: personalizeContent.enabled
                });
                console.log('Full Entry Data:', personalizeContent);
                console.log('Full Entry JSON:', JSON.stringify(personalizeContent, null, 2));
              } else {
                console.log('❌ No variant entry returned');
                console.log('Possible reasons:');
                console.log('  - Content not linked to variant');
                console.log('  - No active variant (audience rules not matched)');
                console.log('  - Content type name mismatch');
              }
              console.groupEnd();
              
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
    const isFirstTimeUserAfterClick = !localStorage.getItem("session_start_time") || 
                                      localStorage.getItem("first_visit") === null;
    await setPersonalizeAttributes({
      has_clicked_apply_now: true,
      first_time_user: isFirstTimeUserAfterClick,
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

