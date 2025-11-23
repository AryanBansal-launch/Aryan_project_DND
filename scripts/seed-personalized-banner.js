/**
 * Script to seed personalized banner content to Contentstack
 * Run: node scripts/seed-personalized-banner.js
 * 
 * This script:
 * 1. Creates the personalized_banner content type (if it doesn't exist)
 * 2. Creates a personalized_banner entry that can be used
 *    with Contentstack Personalization to deliver different banner content
 *    based on user segments (e.g., users who haven't clicked Apply Now after 30 seconds)
 */

const https = require('https');
const dotenv = require('dotenv');
dotenv.config();

// ⚠️ CONFIGURE THESE VALUES
const CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
  MANAGEMENT_TOKEN: process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN,
  ENVIRONMENT: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
  REGION: process.env.NEXT_PUBLIC_CONTENTSTACK_REGION,
  CONTENT_TYPE_UID: 'personalized_banner',
  
  // Localization settings
  ENABLE_LOCALIZATION: true, // Set to false to only create in base locale
  BASE_LOCALE: 'en-us',
  LOCALES: ['hi-in'] // Additional locales to create
};

// Base URL based on region
const BASE_URLS = {
  us: 'api.contentstack.io',
  eu: 'eu-api.contentstack.com',
  'azure-na': 'azure-na-api.contentstack.com',
  'azure-eu': 'azure-eu-api.contentstack.com'
};

const BASE_URL = BASE_URLS[CONFIG.REGION] || BASE_URLS.us;

// Localized content for each locale
const localizedContent = {
  'hi-in': {
    title: "Personalized Banner",
    banner_title: "अभी भी खोज रहे हैं?",
    banner_message: "महान अवसरों को याद मत करें! शुरू करने के लिए अभी आवेदन करें।",
    cta_text: "अभी आवेदन करें",
    cta_link: {
      title: "अभी आवेदन करें",
      href: "/jobs"
    },
    delay_seconds: 30,
    enabled: true,
    user_segment: "users_not_applied_30s" // Segment for users who haven't applied after 30 seconds
  }
};

// Personalized banner content (base locale)
// This can be personalized based on user segments in Contentstack
const bannerContent = {
  title: "Personalized Banner",
  banner_title: "Still Exploring?",
  banner_message: "Don't miss out on great opportunities! Apply now to get started.",
  cta_text: "Apply Now",
  cta_link: {
    title: "Apply Now",
    href: "/jobs"
  },
  delay_seconds: 30, // Time in seconds before showing banner
  enabled: true, // Whether this banner is enabled
  user_segment: "users_not_applied_30s", // User segment identifier for personalization
  // Additional fields for personalization
  priority: 1, // Priority order if multiple banners exist
  // Note: display_conditions removed - Contentstack doesn't support JSON field type
  // You can add custom fields in Contentstack UI if needed
};

// Validation function
function validateConfig() {
  const missing = [];
  if (!CONFIG.API_KEY) missing.push('API_KEY');
  if (!CONFIG.MANAGEMENT_TOKEN) missing.push('MANAGEMENT_TOKEN');
  if (!CONFIG.ENVIRONMENT) missing.push('ENVIRONMENT');
  if (!CONFIG.REGION) missing.push('REGION');

  if (missing.length > 0) {
    console.error('❌ Missing required configuration:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\nPlease set these in your .env file or directly in the CONFIG object.');
    process.exit(1);
  }
}

// Function to check if content type exists
function checkContentTypeExists() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      port: 443,
      path: `/v3/content_types/${CONFIG.CONTENT_TYPE_UID}`,
      method: 'GET',
      headers: {
        'api_key': CONFIG.API_KEY,
        'authorization': CONFIG.MANAGEMENT_TOKEN,
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(true); // Content type exists
        } else if (res.statusCode === 404) {
          resolve(false); // Content type doesn't exist
        } else {
          reject(new Error(`Failed to check content type: ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Function to create content type
function createContentType() {
  return new Promise((resolve, reject) => {
    const contentTypeSchema = {
      content_type: {
        title: 'Personalized Banner',
        uid: CONFIG.CONTENT_TYPE_UID,
        schema: [
          {
            display_name: 'Title',
            uid: 'title',
            field_metadata: {
              _uid: 'title',
            },
            data_type: 'text',
            mandatory: true,
            unique: false,
            multiple: false,
            non_localizable: false,
          },
          {
            display_name: 'Banner Title',
            uid: 'banner_title',
            field_metadata: {
              _uid: 'banner_title',
            },
            data_type: 'text',
            mandatory: true,
            unique: false,
            multiple: false,
            non_localizable: false,
          },
          {
            display_name: 'Banner Message',
            uid: 'banner_message',
            field_metadata: {
              _uid: 'banner_message',
              rich_text_type: 'standard',
            },
            data_type: 'text',
            mandatory: true,
            unique: false,
            multiple: false,
            non_localizable: false,
          },
          {
            display_name: 'CTA Text',
            uid: 'cta_text',
            field_metadata: {
              _uid: 'cta_text',
            },
            data_type: 'text',
            mandatory: true,
            unique: false,
            multiple: false,
            non_localizable: false,
          },
          {
            display_name: 'CTA Link',
            uid: 'cta_link',
            field_metadata: {
              _uid: 'cta_link',
            },
            data_type: 'link',
            mandatory: true,
            unique: false,
            multiple: false,
            non_localizable: false,
          },
          {
            display_name: 'Delay Seconds',
            uid: 'delay_seconds',
            field_metadata: {
              _uid: 'delay_seconds',
              format: 'decimal',
            },
            data_type: 'number',
            mandatory: false,
            unique: false,
            multiple: false,
            non_localizable: false,
          },
          {
            display_name: 'Enabled',
            uid: 'enabled',
            field_metadata: {
              _uid: 'enabled',
            },
            data_type: 'boolean',
            mandatory: false,
            unique: false,
            multiple: false,
            non_localizable: false,
          },
          {
            display_name: 'User Segment',
            uid: 'user_segment',
            field_metadata: {
              _uid: 'user_segment',
            },
            data_type: 'text',
            mandatory: false,
            unique: false,
            multiple: false,
            non_localizable: false,
          },
          {
            display_name: 'Priority',
            uid: 'priority',
            field_metadata: {
              _uid: 'priority',
              format: 'integer',
            },
            data_type: 'number',
            mandatory: false,
            unique: false,
            multiple: false,
            non_localizable: false,
          },
        ],
        options: {
          is_page: false,
          singleton: false,
          title: 'title',
          sub_title: [],
          url_pattern: null,
          url_prefix: null,
        },
        description: 'Content type for personalized banners used with Contentstack Personalization',
      }
    };

    const postData = JSON.stringify(contentTypeSchema);

    const options = {
      hostname: BASE_URL,
      port: 443,
      path: '/v3/content_types',
      method: 'POST',
      headers: {
        'api_key': CONFIG.API_KEY,
        'authorization': CONFIG.MANAGEMENT_TOKEN,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          // If content type already exists, that's okay
          if (res.statusCode === 422 && data.includes('already exists')) {
            console.log('ℹ️  Content type already exists, skipping creation...');
            resolve({ content_type: { uid: CONFIG.CONTENT_TYPE_UID } });
          } else {
            reject(new Error(`Failed to create content type: ${res.statusCode} - ${data}`));
          }
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Function to create entry
function createEntry(entryData) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      entry: entryData
    });

    const options = {
      hostname: BASE_URL,
      port: 443,
      path: `/v3/content_types/${CONFIG.CONTENT_TYPE_UID}/entries`,
      method: 'POST',
      headers: {
        'api_key': CONFIG.API_KEY,
        'authorization': CONFIG.MANAGEMENT_TOKEN,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Failed to create entry: ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Function to create localized version
function createLocalizedVersion(entryUid, localizedData, locale) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      entry: localizedData
    });

    const options = {
      hostname: BASE_URL,
      port: 443,
      path: `/v3/content_types/${CONFIG.CONTENT_TYPE_UID}/entries/${entryUid}?locale=${locale}`,
      method: 'PUT',
      headers: {
        'api_key': CONFIG.API_KEY,
        'authorization': CONFIG.MANAGEMENT_TOKEN,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Failed to create localized version: ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Function to publish entry
function publishEntry(entryUid, locales = [CONFIG.BASE_LOCALE]) {
  return new Promise((resolve, reject) => {
    const localeArray = Array.isArray(locales) ? locales : [locales];
    
    const postData = JSON.stringify({
      entry: {
        environments: [CONFIG.ENVIRONMENT],
        locales: localeArray
      }
    });

    const options = {
      hostname: BASE_URL,
      port: 443,
      path: `/v3/content_types/${CONFIG.CONTENT_TYPE_UID}/entries/${entryUid}/publish`,
      method: 'POST',
      headers: {
        'api_key': CONFIG.API_KEY,
        'authorization': CONFIG.MANAGEMENT_TOKEN,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Failed to publish entry: ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Main function
async function seedPersonalizedBanner() {
  console.log('🚀 Starting to seed personalized banner content...\n');

  try {
    // Step 1: Check if content type exists, create if it doesn't
    console.log('📋 Step 1: Checking if content type exists...');
    const contentTypeExists = await checkContentTypeExists().catch(() => false);
    
    if (contentTypeExists) {
      console.log(`✅ Content type "${CONFIG.CONTENT_TYPE_UID}" already exists\n`);
    } else {
      console.log(`📝 Content type "${CONFIG.CONTENT_TYPE_UID}" not found, creating...`);
      await createContentType();
      console.log(`✅ Content type "${CONFIG.CONTENT_TYPE_UID}" created successfully\n`);
    }

    console.log('📝 Note: After seeding, configure Personalization in Contentstack:');
    console.log('   1. Go to Personalization → Segments');
    console.log('   2. Create a segment for "users_not_applied_30s"');
    console.log('   3. Set up rules based on user behavior (time on site, no Apply Now click)');
    console.log('   4. Assign this banner entry to that segment\n');

    if (CONFIG.ENABLE_LOCALIZATION) {
      console.log(`🌍 Localization enabled for: ${CONFIG.BASE_LOCALE}, ${CONFIG.LOCALES.join(', ')}\n`);
    } else {
      console.log(`📝 Creating entry in base locale only: ${CONFIG.BASE_LOCALE}\n`);
    }

    // Step 2: Create entry
    console.log('📋 Step 2: Creating personalized banner entry in base locale...');
    const createdEntry = await createEntry(bannerContent);
    const entryUid = createdEntry.entry.uid;
    console.log(`✅ Created in ${CONFIG.BASE_LOCALE} (UID: ${entryUid})`);

    // Collect all locales to publish
    const localesToPublish = [CONFIG.BASE_LOCALE];
    let localizedCount = 0;

    // Create localized versions if enabled
    if (CONFIG.ENABLE_LOCALIZATION && CONFIG.LOCALES.length > 0) {
      for (const locale of CONFIG.LOCALES) {
        try {
          const localeContent = localizedContent[locale];
          if (localeContent) {
            console.log(`Creating localized version for ${locale}...`);
            await createLocalizedVersion(entryUid, localeContent, locale);
            console.log(`🌍 Created in ${locale}`);
            localesToPublish.push(locale);
            localizedCount++;
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 300));
          } else {
            console.warn(`⚠️  No translation found for locale: ${locale}`);
          }
        } catch (localeError) {
          console.error(`❌ Failed to localize to ${locale}:`, localeError.message);
        }
      }
    }

    // Publish all locales together
    console.log(`Publishing personalized banner in ${localesToPublish.join(', ')}...`);
    await publishEntry(entryUid, localesToPublish);
    console.log('📤 Published successfully');

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Personalized banner content seeded successfully!');
    if (CONFIG.ENABLE_LOCALIZATION) {
      console.log(`🌍 Localized versions created: ${localizedCount}`);
    }
    console.log('\n📋 Next Steps:');
    console.log('   1. Go to Contentstack → Personalization → Segments');
    console.log('   2. Create a segment targeting users who haven\'t clicked Apply Now after 30 seconds');
    console.log('   3. Assign this banner entry to that segment');
    console.log('   4. The banner will be delivered based on user behavior');
    console.log('='.repeat(50));
  } catch (error) {
    console.error('❌ Error seeding personalized banner:', error.message);
    process.exit(1);
  }
}

// Run the script
validateConfig();
seedPersonalizedBanner();

