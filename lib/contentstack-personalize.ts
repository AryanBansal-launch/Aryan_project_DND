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
  [key: string]: any;
}

// Store the SDK instance globally so we can use it after initialization
let personalizeSDKInstance: any = null;

/**
 * Initialize Contentstack Personalize Edge SDK (client-side only)
 * This should be called in a client component
 * 
 * NOTE: The @contentstack/personalize-edge-sdk package may need to be installed separately.
 * Check Contentstack documentation for the correct package name and installation instructions.
 */
export async function initContentstackPersonalize(projectUid: string) {
  if (typeof window === 'undefined') {
    console.warn('Contentstack Personalize SDK can only be initialized on the client side');
    return null;
  }

  try {
    // Dynamic import to avoid SSR issues
    // Try different possible package names
    let Personalize;
    try {
      Personalize = (await import('@contentstack/personalize-edge-sdk')).default;
    } catch (e) {
      // Package might not be installed or have different name
      console.warn('Contentstack Personalize Edge SDK not found. Install it with: npm install @contentstack/personalize-edge-sdk');
      console.warn('Or check Contentstack documentation for the correct package name.');
      return null;
    }
    
    // Initialize and store the SDK instance (per SDK v1.0.9+ migration guide)
    personalizeSDKInstance = await Personalize.init(projectUid);
    console.log('✅ Contentstack Personalize SDK initialized successfully!', { projectUid });
    return personalizeSDKInstance;
  } catch (error) {
    console.error('❌ Failed to initialize Contentstack Personalize SDK:', error);
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
    // Use the initialized SDK instance if available
    if (personalizeSDKInstance && typeof personalizeSDKInstance.setAttributes === 'function') {
      await personalizeSDKInstance.setAttributes(attributes);
      console.log('✅ Contentstack Personalize: User attributes set', {
        attributes,
        attributeKeys: Object.keys(attributes),
        attributeValues: Object.entries(attributes).map(([key, value]) => `${key}: ${value} (${typeof value})`),
        attributeDetails: Object.entries(attributes).reduce((acc, [key, value]) => {
          acc[key] = {
            value,
            type: typeof value,
            isNull: value === null,
            isUndefined: value === undefined
          };
          return acc;
        }, {} as any)
      });
      return;
    }
    
    // Fallback: try to get SDK instance
    const Personalize = (await import('@contentstack/personalize-edge-sdk')).default;
    if (Personalize && typeof (Personalize as any).setAttributes === 'function') {
      await (Personalize as any).setAttributes(attributes);
      console.log('✅ Contentstack Personalize: User attributes set', {
        attributes,
        attributeKeys: Object.keys(attributes),
        attributeValues: Object.entries(attributes).map(([key, value]) => `${key}: ${value} (${typeof value})`)
      });
    }
  } catch (error: any) {
    // SDK might not be installed - fail silently
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
    // Use the initialized SDK instance if available (per SDK v1.0.9+ migration guide)
    if (personalizeSDKInstance && typeof personalizeSDKInstance.getExperiences === 'function') {
      const experiences = personalizeSDKInstance.getExperiences() || [];
      console.log('✅ Contentstack Personalize: Active experiences retrieved', { count: experiences.length, experiences });
      return experiences;
    }
    
    // Fallback: try to get SDK instance
    const Personalize = (await import('@contentstack/personalize-edge-sdk')).default;
    if (Personalize && typeof (Personalize as any).getExperiences === 'function') {
      const experiences = (Personalize as any).getExperiences() || [];
      console.log('✅ Contentstack Personalize: Active experiences retrieved', { count: experiences.length, experiences });
      return experiences;
    }
    return [];
  } catch (error: any) {
    // SDK might not be installed - fail silently
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
    // Use the initialized SDK instance if available
    if (personalizeSDKInstance && typeof personalizeSDKInstance.trackEvent === 'function') {
      await personalizeSDKInstance.trackEvent({
        eventKey,
        type: 'EVENT',
        ...eventData,
      });
      console.log('✅ Contentstack Personalize: Event tracked', { eventKey, eventData });
      return;
    }
    
    // Fallback: try to get SDK instance
    const Personalize = (await import('@contentstack/personalize-edge-sdk')).default;
    const personalizeInstance = Personalize as any;
    
    if (personalizeInstance && typeof personalizeInstance.trackEvent === 'function') {
      await personalizeInstance.trackEvent({
        eventKey,
        type: 'EVENT',
        ...eventData,
      });
      console.log('✅ Contentstack Personalize: Event tracked', { eventKey, eventData });
    } else {
      throw new Error('Personalize.trackEvent is not available');
    }
  } catch (error: any) {
    // SDK might not be installed - fail silently
    if (error?.code !== 'MODULE_NOT_FOUND') {
      console.error('❌ Failed to track Personalize event:', error);
    }
  }
}

/**
 * Get personalized content variant (client-side only)
 * This returns the variant/content for the current user based on active experiences
 */
export async function getPersonalizedContent(contentType: string) {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    // Use the initialized SDK instance if available
    if (personalizeSDKInstance && typeof personalizeSDKInstance.getContent === 'function') {
      const content = await personalizeSDKInstance.getContent();
      
      console.log('🔍 Contentstack Personalize: Raw content from SDK', {
        contentType,
        hasContent: !!content,
        contentTypeOf: typeof content,
        contentKeys: content ? Object.keys(content) : [],
        fullContent: content,
        contentStringified: JSON.stringify(content, null, 2)
      });
      
      // Check if content is an object with keys or an array
      if (!content) {
        console.log('ℹ️ Contentstack Personalize: No content returned from SDK', {
          contentType,
          sdkInstanceExists: !!personalizeSDKInstance,
          hasGetContent: typeof personalizeSDKInstance.getContent === 'function'
        });
        return null;
      }
      
      // Content might be returned as an object with content type as key
      if (typeof content === 'object' && !Array.isArray(content)) {
        // Try direct key match
        if (content[contentType]) {
          console.log('✅ Contentstack Personalize: Personalized content retrieved (direct key)', { 
            contentType, 
            hasContent: !!content[contentType],
            contentKeys: Object.keys(content || {}),
            contentData: content[contentType]
          });
          return content[contentType];
        }
        
        // Try case-insensitive match
        const matchingKey = Object.keys(content).find(key => 
          key.toLowerCase() === contentType.toLowerCase()
        );
        if (matchingKey) {
          console.log('✅ Contentstack Personalize: Personalized content retrieved (case-insensitive match)', { 
            contentType,
            matchedKey: matchingKey,
            contentData: content[matchingKey]
          });
          return content[matchingKey];
        }
        
        // Content exists but not for this content type - log what we got
        console.log('ℹ️ Contentstack Personalize: Content returned but not for content type', {
          contentType,
          availableKeys: Object.keys(content),
          contentStructure: content,
          suggestion: 'Check if content type name matches. Available keys: ' + Object.keys(content).join(', ')
        });
      } else if (Array.isArray(content)) {
        // Content might be an array - try to find matching entry
        console.log('ℹ️ Contentstack Personalize: Content is an array', {
          contentType,
          arrayLength: content.length,
          arrayItems: content
        });
      }
      
      return null;
    }
    
    // Fallback: try to get SDK instance
    const Personalize = (await import('@contentstack/personalize-edge-sdk')).default;
    if (Personalize && typeof (Personalize as any).getContent === 'function') {
      const content = await (Personalize as any).getContent();
      
      console.log('🔍 Contentstack Personalize: Raw content from SDK (fallback)', {
        contentType,
        hasContent: !!content,
        contentKeys: content ? Object.keys(content) : []
      });
      
      // Filter for the specific content type
      if (content && content[contentType]) {
        console.log('✅ Contentstack Personalize: Personalized content retrieved', { 
          contentType, 
          hasContent: !!content[contentType],
          contentKeys: Object.keys(content || {})
        });
        return content[contentType];
      } else {
        console.log('ℹ️ Contentstack Personalize: No personalized content found for', contentType, {
          availableKeys: content ? Object.keys(content) : []
        });
      }
    }
    
    return null;
  } catch (error: any) {
    // SDK might not be installed - fail silently
    if (error?.code !== 'MODULE_NOT_FOUND') {
      console.error('❌ Failed to get personalized content:', error);
    }
    return null;
  }
}

