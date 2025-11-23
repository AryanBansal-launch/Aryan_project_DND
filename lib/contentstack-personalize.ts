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
 * Diagnostic function to check what attributes the SDK currently has
 * This helps debug why variants aren't activating
 */
export async function getCurrentAttributes() {
  if (typeof window === 'undefined') return null;
  
  try {
    if (personalizeSDKInstance && typeof personalizeSDKInstance.getAttributes === 'function') {
      const attrs = personalizeSDKInstance.getAttributes();
      console.group('🔍 Contentstack Personalize: Current Attributes in SDK');
      console.log('Attributes:', attrs);
      console.log('Attributes (JSON):', JSON.stringify(attrs, null, 2));
      console.groupEnd();
      return attrs;
    }
  } catch (error) {
    console.error('❌ Failed to get current attributes:', error);
  }
  return null;
}

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
    } catch {
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
      // CRITICAL: Log BEFORE setting to see what we're sending
      console.group('🔧 Contentstack Personalize: Setting Attributes (BEFORE)');
      console.log('Attributes to set:', JSON.stringify(attributes, null, 2));
      console.log('Attribute types:', Object.entries(attributes).map(([k, v]) => `${k}: ${typeof v}`).join(', '));
      console.log('Attribute values:', Object.entries(attributes).map(([k, v]) => `${k} = ${v}`).join(', '));
      console.groupEnd();
      
      await personalizeSDKInstance.setAttributes(attributes);
      
      // Verify attributes were set correctly
      console.group('✅ Contentstack Personalize: Attributes Set (AFTER)');
      console.log('Total Attributes:', Object.keys(attributes).length);
      console.log('\n📝 Attribute Details:');
      Object.entries(attributes).forEach(([key, value]) => {
        console.log(`  ${key}:`, {
          value,
          type: typeof value,
          isNull: value === null,
          isUndefined: value === undefined,
          stringified: String(value),
          json: JSON.stringify(value)
        });
      });
      console.log('\n📋 All Attributes (JSON):', JSON.stringify(attributes, null, 2));
      console.log('\n🔍 Expected Audience Rules:');
      console.log('  "users_not_applied_30s": time_on_site > 30 AND has_clicked_apply_now = false');
      console.log('  "First_time_users": first_time_user = true');
      console.log('\n✅ Attributes sent - SDK should now evaluate audience rules');
      console.groupEnd();
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
      
      // Detailed logging for experiences
      console.group('📊 Contentstack Personalize: Experiences');
      console.log('Total Experiences:', experiences.length);
      console.log('⚠️ CRITICAL: If no active variants, check:');
      console.log('  1. Attributes match audience rules (see attribute logs above)');
      console.log('  2. Variant has content entry linked (not just content type)');
      console.log('  3. Experience is Active and Published');
      console.log('  4. Wait 2-3 seconds after setting attributes before checking');
      
      experiences.forEach((exp: any, index: number) => {
        console.group(`Experience ${index + 1}`);
        console.log('Short UID:', exp.shortUid);
        console.log('Active Variant UID:', exp.activeVariantShortUid);
        console.log('Has Active Variant:', exp.activeVariantShortUid !== null);
        console.log('Experience Name:', exp.name || exp.title || 'N/A');
        console.log('Experience Type:', exp.type || 'N/A');
        console.log('Experience Status:', exp.status || exp.state || 'N/A');
        console.log('All Variants:', exp.variants || 'N/A');
        if (exp.variants && Array.isArray(exp.variants)) {
          console.log('Variant Details:');
          exp.variants.forEach((variant: any, vIndex: number) => {
            const isActive = variant.uid === exp.activeVariantShortUid || 
                           variant.shortUid === exp.activeVariantShortUid ||
                           String(variant.uid) === String(exp.activeVariantShortUid) ||
                           String(variant.shortUid) === String(exp.activeVariantShortUid);
            
            // Get audience details
            const audiences = variant.audiences || variant.audienceIds || variant.audience || [];
            const audienceArray = Array.isArray(audiences) ? audiences : (audiences ? [audiences] : []);
            const audienceNames = audienceArray.map((a: any) => {
              if (typeof a === 'string') return a;
              if (a && typeof a === 'object') return a.name || a.id || a.uid || JSON.stringify(a);
              return String(a);
            });
            
            console.log(`  Variant ${vIndex + 1}:`, {
              uid: variant.uid || variant.shortUid,
              name: variant.name || variant.title,
              isActive: isActive,
              audiences: audienceNames.length > 0 ? audienceNames : 'N/A',
              audienceCount: audienceArray.length,
              hasContent: !!(variant.content || variant.entry || variant.entryUid),
              contentType: variant.contentType || 'N/A',
              entryUid: variant.entryUid || variant.entry || 'N/A'
            });
            
            // Show FULL variant object for debugging
            console.log(`  Variant ${vIndex + 1} FULL DATA:`, JSON.stringify(variant, null, 2));
            
            // Show why variant is inactive
            if (!isActive) {
              console.log(`    ⚠️ Why inactive:`);
              if (audienceArray.length === 0) {
                console.log(`      ❌ No audiences assigned to variant`);
                console.log(`      → Action: Go to Experience > Configuration > Variants`);
                console.log(`      → Assign "First_time_users" or "users_not_applied_30s" audience to this variant`);
              } else {
                console.log(`      ⚠️ Variant has audiences: ${audienceNames.join(', ')}`);
                console.log(`      → But user attributes don't match audience rules`);
                console.log(`      → Check if audience names match exactly:`);
                console.log(`        - Expected: "First_time_users" or "users_not_applied_30s"`);
                console.log(`        - Actual: ${audienceNames.join(', ')}`);
              }
              if (!variant.content && !variant.entry && !variant.entryUid) {
                console.log(`      ❌ CRITICAL: No content entry linked to variant!`);
                console.log(`      → Action: Go to Contentstack > Settings > Variants`);
                console.log(`      → Click "Link" and select your banner entry`);
                console.log(`      → OR in Experience config, assign entry to variant`);
              } else {
                console.log(`      ✅ Content entry linked: ${variant.entryUid || variant.entry || variant.content}`);
              }
            } else {
              console.log(`    ✅ Variant is ACTIVE!`);
            }
          });
        } else {
          console.log('⚠️ No variants found in experience!');
          console.log('  - Check if variants are configured in Contentstack Personalize dashboard');
          console.log('  - Full experience data:', JSON.stringify(exp, null, 2));
        }
        console.log('Full Experience Data:', exp);
        console.groupEnd();
      });
      console.groupEnd();
      
      return experiences;
    }
    
    // Fallback: try to get SDK instance
    const Personalize = (await import('@contentstack/personalize-edge-sdk')).default;
    if (Personalize && typeof (Personalize as any).getExperiences === 'function') {
      const experiences = (Personalize as any).getExperiences() || [];
      
      // Detailed logging for experiences
      console.group('📊 Contentstack Personalize: Experiences');
      console.log('Total Experiences:', experiences.length);
      experiences.forEach((exp: any, index: number) => {
        console.group(`Experience ${index + 1}`);
        console.log('Short UID:', exp.shortUid);
        console.log('Active Variant UID:', exp.activeVariantShortUid);
        console.log('Has Active Variant:', exp.activeVariantShortUid !== null);
        console.log('Full Experience Data:', exp);
        console.groupEnd();
      });
      console.groupEnd();
      
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
      
      // Detailed logging for content/variants
      console.group('📦 Contentstack Personalize: Variant Content');
      console.log('Content Type Requested:', contentType);
      console.log('Has Content:', !!content);
      console.log('Content Type:', typeof content);
      console.log('Content Keys:', content ? Object.keys(content) : []);
      
      if (content && typeof content === 'object') {
        console.log('\n📋 Variant Entries:');
        Object.entries(content).forEach(([key, value]) => {
          console.log(`  - ${key}:`, {
            type: typeof value,
            isArray: Array.isArray(value),
            isObject: typeof value === 'object' && value !== null,
            keys: typeof value === 'object' && value !== null ? Object.keys(value) : 'N/A',
            preview: typeof value === 'object' ? JSON.stringify(value).substring(0, 200) + '...' : value
          });
        });
      }
      
      console.log('\n📄 Full Content:', content);
      console.groupEnd();
      
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
          console.group('✅ Contentstack Personalize: Variant Entry Found');
          console.log('Content Type:', contentType);
          console.log('Variant Entry Data:', content[contentType]);
          console.log('Entry Keys:', Object.keys(content[contentType] || {}));
          console.log('Full Entry:', JSON.stringify(content[contentType], null, 2));
          console.groupEnd();
          return content[contentType];
        }
        
        // Try case-insensitive match
        const matchingKey = Object.keys(content).find(key => 
          key.toLowerCase() === contentType.toLowerCase()
        );
        if (matchingKey) {
          console.group('✅ Contentstack Personalize: Variant Entry Found (case-insensitive)');
          console.log('Requested Content Type:', contentType);
          console.log('Matched Key:', matchingKey);
          console.log('Variant Entry Data:', content[matchingKey]);
          console.log('Full Entry:', JSON.stringify(content[matchingKey], null, 2));
          console.groupEnd();
          return content[matchingKey];
        }
        
        // Content exists but not for this content type - log what we got
        console.group('ℹ️ Contentstack Personalize: No Matching Variant Entry');
        console.log('Requested Content Type:', contentType);
        console.log('Available Content Types:', Object.keys(content));
        console.log('Available Entries:', content);
        console.log('Suggestion: Check if content type name matches. Available: ' + Object.keys(content).join(', '));
        console.groupEnd();
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

