/**
 * Script to seed homepage content to Contentstack
 * Run: node scripts/seed-homepage.js
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
  CONTENT_TYPE_UID: 'homepage',
  
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
    title: "होमपेज",
    hero_section: {
      main_title: "अपनी ड्रीम जॉब खोजें",
      subtitle: "दुनिया भर की शीर्ष कंपनियों से हजारों नौकरी के अवसर खोजें। आपका अगला करियर कदम यहाँ से शुरू होता है।",
      search_job_placeholder: "नौकरी का शीर्षक, कीवर्ड, या कंपनी",
      search_location_placeholder: "शहर, राज्य, या रिमोट",
      search_button_text: "नौकरियां खोजें"
    },
    stats_section: {
      stat_items: [
        { label: "सक्रिय नौकरियां", value: "12,345", icon: "Briefcase" },
        { label: "कंपनियां", value: "2,156", icon: "Building2" },
        { label: "नौकरी चाहने वाले", value: "45,678", icon: "Users" },
        { label: "सफलता दर", value: "89%", icon: "TrendingUp" }
      ]
    },
    featured_jobs_section: {
      section_title: "फीचर्ड जॉब्स",
      view_all_text: "सभी नौकरियां देखें"
    },
    top_companies_section: {
      section_title: "शीर्ष कंपनियां",
      description: "उद्योग की अग्रणी कंपनियों में काम करने वाले हजारों पेशेवरों से जुड़ें"
    },
    cta_section: {
      title: "अपने करियर को आगे बढ़ाने के लिए तैयार हैं?",
      description: "हजारों पेशेवरों से जुड़ें जिन्होंने हमारे प्लेटफॉर्म के माध्यम से अपनी ड्रीम जॉब पाई है",
      primary_button_text: "जॉब सर्च शुरू करें",
      primary_button_link: "/jobs",
      secondary_button_text: "एक जॉब पोस्ट करें",
      secondary_button_link: "/post-job"
    }
  }
};

// Homepage content (base locale)
const homepageContent = {
  title: "Homepage",
  hero_section: {
    main_title: "Find Your Dream Job",
    subtitle: "Discover thousands of job opportunities from top companies worldwide. Your next career move starts here.",
    search_job_placeholder: "Job title, keywords, or company",
    search_location_placeholder: "City, state, or remote",
    search_button_text: "Search Jobs"
  },
  stats_section: {
    stat_items: [
      { label: "Active Jobs", value: "12,345", icon: "Briefcase" },
      { label: "Companies", value: "2,156", icon: "Building2" },
      { label: "Job Seekers", value: "45,678", icon: "Users" },
      { label: "Success Rate", value: "89%", icon: "TrendingUp" }
    ]
  },
  featured_jobs_section: {
    section_title: "Featured Jobs",
    view_all_text: "View All Jobs"
  },
  top_companies_section: {
    section_title: "Top Companies",
    description: "Join thousands of professionals working at industry-leading companies"
  },
  cta_section: {
    title: "Ready to Advance Your Career?",
    description: "Join thousands of professionals who have found their dream jobs through our platform",
    primary_button_text: "Start Job Search",
    primary_button_link: "/jobs",
    secondary_button_text: "Post a Job",
    secondary_button_link: "/post-job"
  }
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
async function seedHomepage() {
  console.log('🚀 Starting to seed homepage content...\n');

  if (CONFIG.ENABLE_LOCALIZATION) {
    console.log(`🌍 Localization enabled for: ${CONFIG.BASE_LOCALE}, ${CONFIG.LOCALES.join(', ')}\n`);
  } else {
    console.log(`📝 Creating entry in base locale only: ${CONFIG.BASE_LOCALE}\n`);
  }

  try {
    console.log('Creating homepage entry in base locale...');
    const createdEntry = await createEntry(homepageContent);
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
    console.log(`Publishing homepage in ${localesToPublish.join(', ')}...`);
    await publishEntry(entryUid, localesToPublish);
    console.log('📤 Published successfully');

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Homepage content seeded successfully!');
    if (CONFIG.ENABLE_LOCALIZATION) {
      console.log(`🌍 Localized versions created: ${localizedCount}`);
    }
    console.log('='.repeat(50));
  } catch (error) {
    console.error('❌ Error seeding homepage:', error.message);
    process.exit(1);
  }
}

// Run the script
validateConfig();
seedHomepage();

