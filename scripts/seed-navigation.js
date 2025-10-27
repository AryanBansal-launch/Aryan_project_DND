/**
 * Script to seed navigation content to Contentstack
 * Run: node scripts/seed-navigation.js
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
  CONTENT_TYPE_UID: 'navigation',
  
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
    title: "नेविगेशन",
    brand_name: "जॉबदेखो",
    nav_items: [
      { label: "होम", link: "/", icon: "Search" },
      { label: "नौकरियां", link: "/jobs", icon: "Briefcase" },
      { label: "कंपनियां", link: "/companies", icon: "Building2" },
      { label: "आवेदन", link: "/applications", icon: "FileText" },
      { label: "प्रोफ़ाइल", link: "/profile", icon: "User" }
    ]
  }
};

// Navigation content (base locale)
const navigationContent = {
  title: "Navigation",
  brand_name: "JobDekho",
  nav_items: [
    { label: "Home", link: "/", icon: "Search" },
    { label: "Jobs", link: "/jobs", icon: "Briefcase" },
    { label: "Companies", link: "/companies", icon: "Building2" },
    { label: "Applications", link: "/applications", icon: "FileText" },
    { label: "Profile", link: "/profile", icon: "User" }
  ]
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
async function seedNavigation() {
  console.log('🚀 Starting to seed navigation content...\n');

  if (CONFIG.ENABLE_LOCALIZATION) {
    console.log(`🌍 Localization enabled for: ${CONFIG.BASE_LOCALE}, ${CONFIG.LOCALES.join(', ')}\n`);
  } else {
    console.log(`📝 Creating entry in base locale only: ${CONFIG.BASE_LOCALE}\n`);
  }

  try {
    console.log('Creating navigation entry in base locale...');
    const createdEntry = await createEntry(navigationContent);
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
    console.log(`Publishing navigation in ${localesToPublish.join(', ')}...`);
    await publishEntry(entryUid, localesToPublish);
    console.log('📤 Published successfully');

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Navigation content seeded successfully!');
    if (CONFIG.ENABLE_LOCALIZATION) {
      console.log(`🌍 Localized versions created: ${localizedCount}`);
    }
    console.log('='.repeat(50));
  } catch (error) {
    console.error('❌ Error seeding navigation:', error.message);
    process.exit(1);
  }
}

// Run the script
validateConfig();
seedNavigation();

