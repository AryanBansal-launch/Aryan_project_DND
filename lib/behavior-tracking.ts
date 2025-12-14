/**
 * Behavior Tracking Utility
 * 
 * Tracks user behavior and interests for personalization.
 * Integrates with Lytics for analytics and Contentstack Personalize for content delivery.
 * 
 * Features:
 * - Tracks job views, blog reads, categories, skills of interest
 * - Stores behavior locally for immediate personalization
 * - Sends events to Lytics for analytics and audience building
 * - Syncs with Contentstack Personalize for content personalization
 */

// Types for behavior tracking
export interface UserBehavior {
  // Viewing history
  viewedJobs: string[];              // Job UIDs
  viewedBlogs: string[];             // Blog UIDs
  viewedCompanies: string[];         // Company UIDs
  
  // Interests derived from behavior
  interestedCategories: string[];    // Job categories (Engineering, Design, etc.)
  interestedSkills: string[];        // Skills user seems interested in
  interestedLocations: string[];     // Locations user explores
  
  // Engagement metrics
  totalJobViews: number;
  totalBlogReads: number;
  totalTimeOnSite: number;           // In seconds
  sessionCount: number;
  lastVisit: string;                 // ISO date
  firstVisit: string;                // ISO date
  
  // Conversion tracking
  appliedJobs: string[];             // Jobs user applied to
  savedJobs: string[];               // Jobs user saved/bookmarked
}

export interface TrackingEvent {
  event: string;
  timestamp: string;
  data: Record<string, any>;
}

const BEHAVIOR_STORAGE_KEY = 'jobportal_user_behavior';
const EVENTS_STORAGE_KEY = 'jobportal_tracking_events';
const MAX_HISTORY_ITEMS = 50;
const MAX_INTERESTS = 10;

/**
 * Get default user behavior object
 */
function getDefaultBehavior(): UserBehavior {
  return {
    viewedJobs: [],
    viewedBlogs: [],
    viewedCompanies: [],
    interestedCategories: [],
    interestedSkills: [],
    interestedLocations: [],
    totalJobViews: 0,
    totalBlogReads: 0,
    totalTimeOnSite: 0,
    sessionCount: 1,
    lastVisit: new Date().toISOString(),
    firstVisit: new Date().toISOString(),
    appliedJobs: [],
    savedJobs: [],
  };
}

/**
 * Get stored user behavior from localStorage
 */
export function getUserBehavior(): UserBehavior {
  if (typeof window === 'undefined') {
    return getDefaultBehavior();
  }
  
  try {
    const stored = localStorage.getItem(BEHAVIOR_STORAGE_KEY);
    if (stored) {
      const behavior = JSON.parse(stored) as UserBehavior;
      // Update last visit
      behavior.lastVisit = new Date().toISOString();
      return behavior;
    }
  } catch (error) {
    console.error('Error reading user behavior:', error);
  }
  
  return getDefaultBehavior();
}

/**
 * Save user behavior to localStorage
 */
function saveBehavior(behavior: UserBehavior): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(BEHAVIOR_STORAGE_KEY, JSON.stringify(behavior));
  } catch (error) {
    console.error('Error saving user behavior:', error);
  }
}

/**
 * Send event to Lytics
 */
function sendToLytics(eventName: string, eventData: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Check if Lytics jstag is available
    const jstag = (window as any).jstag;
    if (jstag && typeof jstag.send === 'function') {
      jstag.send({
        event: eventName,
        ...eventData,
        timestamp: new Date().toISOString(),
      });
      console.log(`📊 Lytics Event: ${eventName}`, eventData);
    } else {
      // Queue event for when Lytics loads
      console.log(`📊 Lytics not ready, event queued: ${eventName}`, eventData);
    }
  } catch (error) {
    console.error('Error sending to Lytics:', error);
  }
}

/**
 * Sync behavior data to Contentstack Personalize attributes
 * Called after behavior events to keep Personalize in sync
 */
async function syncBehaviorToPersonalize(behavior: UserBehavior): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    // Dynamically import to avoid SSR issues
    const { setPersonalizeAttributes } = await import('./contentstack-personalize');
    
    // Calculate engagement level
    const engagementLevel = behavior.totalJobViews > 20 ? 'high' : 
                           behavior.totalJobViews > 5 ? 'medium' : 'low';
    
    // Determine if returning user
    const isReturningUser = behavior.sessionCount > 1;
    
    // Get top interest
    const topCategory = behavior.interestedCategories[0] || 'general';
    const topSkill = behavior.interestedSkills[0] || '';
    
    // Determine if ready to apply (viewed jobs but hasn't applied)
    const readyToApply = behavior.totalJobViews >= 3 && behavior.appliedJobs.length === 0;
    
    const attributes = {
      // Engagement attributes
      total_job_views: behavior.totalJobViews,
      total_blog_reads: behavior.totalBlogReads,
      engagement_level: engagementLevel,
      session_count: behavior.sessionCount,
      
      // Interest attributes
      top_category: topCategory,
      top_skill: topSkill,
      interested_categories: behavior.interestedCategories.join(','),
      
      // User status
      is_returning_user: isReturningUser,
      has_applied: behavior.appliedJobs.length > 0,
      jobs_applied_count: behavior.appliedJobs.length,
      ready_to_apply: readyToApply,
      
      // Time-based
      time_on_site: behavior.totalTimeOnSite,
      
      // Legacy attributes
      first_time_user: behavior.sessionCount === 1,
      has_clicked_apply_now: localStorage.getItem("apply_now_clicked") === "true",
    };
    
    await setPersonalizeAttributes(attributes);
    
    console.group('🎯 Personalize Attributes Updated');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 engagement_level:', engagementLevel);
    console.log('📂 top_category:', topCategory);
    console.log('🔧 top_skill:', topSkill);
    console.log('🔄 is_returning_user:', isReturningUser);
    console.log('👁️ total_job_views:', behavior.totalJobViews);
    console.log('📝 has_applied:', behavior.appliedJobs.length > 0);
    console.log('🎯 ready_to_apply:', readyToApply);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.groupEnd();
  } catch (error) {
    console.error('❌ Error updating Personalize attributes:', error);
  }
}

/**
 * Add item to array with deduplication and max limit
 */
function addToHistory(array: string[], item: string, maxItems: number = MAX_HISTORY_ITEMS): string[] {
  // Remove if exists (to move to front)
  const filtered = array.filter(i => i !== item);
  // Add to front
  filtered.unshift(item);
  // Limit size
  return filtered.slice(0, maxItems);
}

/**
 * Update interest counts and rankings
 */
function updateInterests(
  currentInterests: string[], 
  newInterest: string, 
  maxInterests: number = MAX_INTERESTS
): string[] {
  if (!newInterest) return currentInterests;
  
  // Simple approach: most recent interests at front
  const filtered = currentInterests.filter(i => i.toLowerCase() !== newInterest.toLowerCase());
  filtered.unshift(newInterest);
  return filtered.slice(0, maxInterests);
}

// ============================================
// PUBLIC TRACKING FUNCTIONS
// ============================================

/**
 * Track a job view
 */
export function trackJobView(job: {
  uid: string;
  title: string;
  category?: string;
  skills?: string[];
  location?: string;
  company?: string;
}): void {
  const behavior = getUserBehavior();
  
  // Update viewing history
  behavior.viewedJobs = addToHistory(behavior.viewedJobs, job.uid);
  behavior.totalJobViews += 1;
  
  // Update interests
  if (job.category) {
    behavior.interestedCategories = updateInterests(behavior.interestedCategories, job.category);
  }
  if (job.skills) {
    job.skills.forEach(skill => {
      behavior.interestedSkills = updateInterests(behavior.interestedSkills, skill);
    });
  }
  if (job.location) {
    behavior.interestedLocations = updateInterests(behavior.interestedLocations, job.location);
  }
  
  // Save locally
  saveBehavior(behavior);
  
  // Log the tracking event
  console.group('👁️ Job View Tracked');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Title:', job.title);
  console.log('🏢 Company:', job.company || 'N/A');
  console.log('📂 Category:', job.category || 'N/A');
  console.log('🔧 Skills:', job.skills?.join(', ') || 'N/A');
  console.log('📍 Location:', job.location || 'N/A');
  console.log('📊 Total Views Now:', behavior.totalJobViews);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.groupEnd();
  
  // Send to Lytics
  sendToLytics('job_view', {
    job_uid: job.uid,
    job_title: job.title,
    job_category: job.category || 'uncategorized',
    job_skills: job.skills?.join(',') || '',
    job_location: job.location || '',
    job_company: job.company || '',
    total_job_views: behavior.totalJobViews,
  });
  
  // Update Personalize after EVERY view for real-time personalization
  syncBehaviorToPersonalize(behavior);
}

/**
 * Track a blog read
 */
export function trackBlogRead(blog: {
  uid: string;
  title: string;
  category?: string;
  tags?: string[];
}): void {
  const behavior = getUserBehavior();
  
  // Update viewing history
  behavior.viewedBlogs = addToHistory(behavior.viewedBlogs, blog.uid);
  behavior.totalBlogReads += 1;
  
  // Update interests based on blog content
  if (blog.category) {
    behavior.interestedCategories = updateInterests(behavior.interestedCategories, blog.category);
  }
  if (blog.tags) {
    blog.tags.forEach(tag => {
      behavior.interestedSkills = updateInterests(behavior.interestedSkills, tag);
    });
  }
  
  // Save locally
  saveBehavior(behavior);
  
  // Log the tracking event
  console.group('📖 Blog Read Tracked');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Title:', blog.title);
  console.log('📂 Category:', blog.category || 'N/A');
  console.log('🏷️ Tags:', blog.tags?.join(', ') || 'N/A');
  console.log('📊 Total Reads Now:', behavior.totalBlogReads);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.groupEnd();
  
  // Send to Lytics
  sendToLytics('blog_read', {
    blog_uid: blog.uid,
    blog_title: blog.title,
    blog_category: blog.category || 'general',
    blog_tags: blog.tags?.join(',') || '',
    total_blog_reads: behavior.totalBlogReads,
  });
  
  // Update Personalize after EVERY blog read
  syncBehaviorToPersonalize(behavior);
}

/**
 * Track job application
 */
export function trackJobApplication(job: {
  uid: string;
  title: string;
  company?: string;
}): void {
  const behavior = getUserBehavior();
  
  // Add to applied jobs
  if (!behavior.appliedJobs.includes(job.uid)) {
    behavior.appliedJobs.push(job.uid);
  }
  
  // Save locally
  saveBehavior(behavior);
  
  // Send to Lytics
  sendToLytics('job_application', {
    job_uid: job.uid,
    job_title: job.title,
    job_company: job.company || '',
    total_applications: behavior.appliedJobs.length,
  });
  
  // Update Personalize immediately for applications
  syncBehaviorToPersonalize(behavior);
}

/**
 * Track search query
 */
export function trackSearch(query: string, filters?: {
  location?: string;
  category?: string;
}): void {
  const behavior = getUserBehavior();
  
  // Update interests based on search
  if (filters?.category) {
    behavior.interestedCategories = updateInterests(behavior.interestedCategories, filters.category);
  }
  if (filters?.location) {
    behavior.interestedLocations = updateInterests(behavior.interestedLocations, filters.location);
  }
  
  // Save locally
  saveBehavior(behavior);
  
  // Send to Lytics
  sendToLytics('search', {
    search_query: query,
    search_location: filters?.location || '',
    search_category: filters?.category || '',
  });
}

/**
 * Track session start
 */
export function trackSessionStart(): void {
  const behavior = getUserBehavior();
  const now = new Date();
  const lastVisitDate = new Date(behavior.lastVisit);
  
  // If more than 30 minutes since last visit, count as new session
  const timeDiff = now.getTime() - lastVisitDate.getTime();
  if (timeDiff > 30 * 60 * 1000) {
    behavior.sessionCount += 1;
  }
  
  behavior.lastVisit = now.toISOString();
  saveBehavior(behavior);
  
  // Send to Lytics
  sendToLytics('session_start', {
    session_count: behavior.sessionCount,
    is_returning: behavior.sessionCount > 1,
    days_since_first_visit: Math.floor(
      (now.getTime() - new Date(behavior.firstVisit).getTime()) / (1000 * 60 * 60 * 24)
    ),
  });
  
  // Update Personalize for returning users
  if (behavior.sessionCount > 1) {
    syncBehaviorToPersonalize(behavior);
  }
}

/**
 * Update time on site (call periodically)
 */
export function updateTimeOnSite(additionalSeconds: number): void {
  const behavior = getUserBehavior();
  behavior.totalTimeOnSite += additionalSeconds;
  saveBehavior(behavior);
}

/**
 * Update Personalize attributes with custom data
 * Use this for skill gap analysis data or other custom attributes
 */
export async function updatePersonalizeAttributes(customAttributes: Record<string, any>): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    const { setPersonalizeAttributes } = await import('./contentstack-personalize');
    await setPersonalizeAttributes(customAttributes);
  } catch (error) {
    console.error('Error updating Personalize attributes:', error);
  }
}

/**
 * Track learning resource view
 */
export function trackLearningView(learning: {
  uid: string;
  title: string;
  technology: string;
  skills?: string[];
}): void {
  const behavior = getUserBehavior();
  
  // Add technology/skill to interests
  if (learning.technology) {
    behavior.interestedSkills = updateInterests(behavior.interestedSkills, learning.technology);
  }
  
  // Add skills covered to interests
  if (learning.skills) {
    learning.skills.forEach(skill => {
      behavior.interestedSkills = updateInterests(behavior.interestedSkills, skill);
    });
  }
  
  // Save locally
  saveBehavior(behavior);
  
  // Send to Lytics
  sendToLytics('learning_view', {
    learning_uid: learning.uid,
    learning_title: learning.title,
    technology: learning.technology,
    skills: learning.skills?.join(','),
  });
}

/**
 * Track learning resource completion
 */
export function trackLearningComplete(learning: {
  uid: string;
  title: string;
  technology: string;
  skills?: string[];
}): void {
  // Send to Lytics
  sendToLytics('learning_complete', {
    learning_uid: learning.uid,
    learning_title: learning.title,
    technology: learning.technology,
    skills: learning.skills?.join(','),
  });
  
  // Could also update a "completed learnings" counter in behavior
}

// ============================================
// PERSONALIZATION DATA GETTERS
// ============================================

/**
 * Get user's top interested categories
 */
export function getTopCategories(limit: number = 3): string[] {
  const behavior = getUserBehavior();
  return behavior.interestedCategories.slice(0, limit);
}

/**
 * Get user's top interested skills
 */
export function getTopSkills(limit: number = 5): string[] {
  const behavior = getUserBehavior();
  return behavior.interestedSkills.slice(0, limit);
}

/**
 * Get recently viewed job UIDs
 */
export function getRecentlyViewedJobs(limit: number = 10): string[] {
  const behavior = getUserBehavior();
  return behavior.viewedJobs.slice(0, limit);
}

/**
 * Check if user has viewed a specific job
 */
export function hasViewedJob(jobUid: string): boolean {
  const behavior = getUserBehavior();
  return behavior.viewedJobs.includes(jobUid);
}

/**
 * Get user engagement level
 */
export function getEngagementLevel(): 'new' | 'low' | 'medium' | 'high' {
  const behavior = getUserBehavior();
  
  if (behavior.sessionCount === 1 && behavior.totalJobViews < 3) {
    return 'new';
  }
  if (behavior.totalJobViews > 20 || behavior.appliedJobs.length > 2) {
    return 'high';
  }
  if (behavior.totalJobViews > 5 || behavior.sessionCount > 2) {
    return 'medium';
  }
  return 'low';
}

/**
 * Check if user is returning visitor
 */
export function isReturningUser(): boolean {
  const behavior = getUserBehavior();
  return behavior.sessionCount > 1;
}

/**
 * Get personalization summary for display
 */
export function getPersonalizationSummary(): {
  isReturning: boolean;
  engagementLevel: string;
  topCategory: string | null;
  topSkills: string[];
  jobViewCount: number;
  hasApplied: boolean;
} {
  const behavior = getUserBehavior();
  
  return {
    isReturning: behavior.sessionCount > 1,
    engagementLevel: getEngagementLevel(),
    topCategory: behavior.interestedCategories[0] || null,
    topSkills: behavior.interestedSkills.slice(0, 3),
    jobViewCount: behavior.totalJobViews,
    hasApplied: behavior.appliedJobs.length > 0,
  };
}

/**
 * Clear all behavior data (for privacy/logout)
 */
export function clearBehaviorData(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(BEHAVIOR_STORAGE_KEY);
  localStorage.removeItem(EVENTS_STORAGE_KEY);
  console.log('🗑️ User behavior data cleared');
}

