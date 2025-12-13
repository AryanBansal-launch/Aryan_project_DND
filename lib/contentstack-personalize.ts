/**
 * Contentstack Personalize Edge SDK Integration
 * 
 * This module provides integration with Contentstack Personalize Edge SDK
 * for true personalization based on experiences and audiences.
 * 
 * To use:
 * 1. Install: npm install @contentstack/personalize-edge-sdk
 * 2. Get your Personalize Project UID from Contentstack Personalize dashboard
 * 3. Set NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID in .env
 */

// Client-side only - Personalize Edge SDK runs in browser
export interface PersonalizeUserAttributes {
  time_on_site?: number;
  has_clicked_apply_now?: boolean;
  page_views?: number;
  user_id?: string;
  user_email?: string;
  user_segment?: string;
  first_time_user?: boolean;
  [key: string]: any;
}

// Store the SDK instance globally so we can use it after initialization
let personalizeSDKInstance: any = null;

/**
 * Get current attributes from SDK (for debugging)
 */
export async function getCurrentAttributes() {
  if (typeof window === 'undefined') return null;
  
  try {
    if (personalizeSDKInstance && typeof personalizeSDKInstance.getAttributes === 'function') {
      return personalizeSDKInstance.getAttributes();
    }
  } catch (error) {
    console.error('❌ Failed to get current attributes:', error);
  }
  return null;
}

/**
 * Initialize Contentstack Personalize Edge SDK (client-side only)
 */
export async function initContentstackPersonalize(projectUid: string) {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    let Personalize;
    try {
      Personalize = (await import('@contentstack/personalize-edge-sdk')).default;
    } catch {
      console.warn('⚠️ Personalize SDK not found. Install: npm install @contentstack/personalize-edge-sdk');
      return null;
    }
    
    // Initialize and store the SDK instance
    personalizeSDKInstance = await Personalize.init(projectUid);
    return personalizeSDKInstance;
  } catch (error) {
    console.error('❌ Failed to initialize Personalize SDK:', error);
    return null;
  }
}

/**
 * Set user attributes for personalization (client-side only)
 */
export async function setPersonalizeAttributes(attributes: PersonalizeUserAttributes) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (personalizeSDKInstance && typeof personalizeSDKInstance.setAttributes === 'function') {
      await personalizeSDKInstance.setAttributes(attributes);
      return;
    }
    
    // Fallback: try to get SDK instance
    const Personalize = (await import('@contentstack/personalize-edge-sdk')).default;
    if (Personalize && typeof (Personalize as any).setAttributes === 'function') {
      await (Personalize as any).setAttributes(attributes);
    }
  } catch (error: any) {
    if (error?.code !== 'MODULE_NOT_FOUND') {
      console.error('❌ Failed to set Personalize attributes:', error);
    }
  }
}

/**
 * Get active experiences for the current user (client-side only)
 */
export async function getPersonalizeExperiences() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    if (personalizeSDKInstance && typeof personalizeSDKInstance.getExperiences === 'function') {
      return personalizeSDKInstance.getExperiences() || [];
    }
    
    // Fallback
    const Personalize = (await import('@contentstack/personalize-edge-sdk')).default;
    if (Personalize && typeof (Personalize as any).getExperiences === 'function') {
      return (Personalize as any).getExperiences() || [];
    }
    return [];
  } catch (error: any) {
    if (error?.code !== 'MODULE_NOT_FOUND') {
      console.error('❌ Failed to get Personalize experiences:', error);
    }
    return [];
  }
}

/**
 * Track a user event for personalization (client-side only)
 */
export async function trackPersonalizeEvent(eventKey: string, eventData?: any) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (personalizeSDKInstance && typeof personalizeSDKInstance.trackEvent === 'function') {
      await personalizeSDKInstance.trackEvent({
        eventKey,
        type: 'EVENT',
        ...eventData,
      });
      return;
    }
    
    // Fallback
    const Personalize = (await import('@contentstack/personalize-edge-sdk')).default;
    if (Personalize && typeof (Personalize as any).trackEvent === 'function') {
      await (Personalize as any).trackEvent({
        eventKey,
        type: 'EVENT',
        ...eventData,
      });
    }
  } catch (error: any) {
    if (error?.code !== 'MODULE_NOT_FOUND') {
      console.error('❌ Failed to track Personalize event:', error);
    }
  }
}

/**
 * Get personalized content variant (client-side only)
 */
export async function getPersonalizedContent(contentType: string) {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    if (personalizeSDKInstance && typeof personalizeSDKInstance.getContent === 'function') {
      const content = await personalizeSDKInstance.getContent();
      
      if (!content) {
        return null;
      }
      
      // Try direct key match
      if (content[contentType]) {
        return content[contentType];
      }
      
      // Try case-insensitive match
      const matchingKey = Object.keys(content).find(key => 
        key.toLowerCase() === contentType.toLowerCase()
      );
      if (matchingKey) {
        return content[matchingKey];
      }
      
      return null;
    }
    
    // Fallback
    const Personalize = (await import('@contentstack/personalize-edge-sdk')).default;
    if (Personalize && typeof (Personalize as any).getContent === 'function') {
      const content = await (Personalize as any).getContent();
      if (content && content[contentType]) {
        return content[contentType];
      }
    }
    
    return null;
  } catch (error: any) {
    if (error?.code !== 'MODULE_NOT_FOUND') {
      console.error('❌ Failed to get personalized content:', error);
    }
    return null;
  }
}
