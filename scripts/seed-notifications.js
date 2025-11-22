
const https = require('https');
const dotenv = require('dotenv');
dotenv.config();

// ⚠️ CONFIGURE THESE VALUES
const CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
  MANAGEMENT_TOKEN: process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN,
  ENVIRONMENT: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
  REGION: process.env.NEXT_PUBLIC_CONTENTSTACK_REGION,
  CONTENT_TYPE_UID: 'notification',
  BASE_LOCALE: 'en-us'
};

// Base URL based on region
const BASE_URLS = {
  us: 'api.contentstack.io',
  eu: 'eu-api.contentstack.com',
  'azure-na': 'azure-na-api.contentstack.com'
};

const BASE_URL = BASE_URLS[CONFIG.REGION] || BASE_URLS.us;

// Validate configuration
function validateConfig() {
  const missing = [];
  if (!CONFIG.API_KEY) missing.push('NEXT_PUBLIC_CONTENTSTACK_API_KEY');
  if (!CONFIG.MANAGEMENT_TOKEN) missing.push('NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN');
  if (!CONFIG.ENVIRONMENT) missing.push('NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT');
  if (!CONFIG.REGION) missing.push('NEXT_PUBLIC_CONTENTSTACK_REGION');

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(v => console.error(`   - ${v}`));
    console.error('\nPlease set these in your .env file');
    process.exit(1);
  }
}

// Sample notification data
const notifications = [
  {
    user_email: 'user@example.com',
    type: 'application',
    title: 'Application Submitted Successfully',
    message: 'Your application for Senior Frontend Developer at TechCorp has been submitted. A confirmation email has been sent to your inbox.',
    read: false,
    metadata: JSON.stringify({
      jobId: 'blt1234567890',
      jobTitle: 'Senior Frontend Developer',
      companyName: 'TechCorp',
      applicationId: 'APP-1234567890'
    })
  },
  {
    user_email: 'user@example.com',
    type: 'application',
    title: 'Application Submitted Successfully',
    message: 'Your application for Full Stack Engineer at DataSystems has been submitted. A confirmation email has been sent to your inbox.',
    read: false,
    metadata: JSON.stringify({
      jobId: 'blt9876543210',
      jobTitle: 'Full Stack Engineer',
      companyName: 'DataSystems',
      applicationId: 'APP-9876543210'
    })
  },
  {
    user_email: 'user@example.com',
    type: 'job_update',
    title: 'New Job Matches Your Profile',
    message: 'We found 3 new job openings that match your skills and preferences. Check them out!',
    read: false,
    metadata: JSON.stringify({
      jobCount: 3
    })
  },
  {
    user_email: 'user@example.com',
    type: 'system',
    title: 'Welcome to JobDekho!',
    message: 'Thank you for joining JobDekho! Complete your profile to get better job recommendations.',
    read: true,
    metadata: JSON.stringify({
      action: 'complete_profile'
    })
  },
  {
    user_email: 'another.user@example.com',
    type: 'application',
    title: 'Application Submitted Successfully',
    message: 'Your application for DevOps Engineer at CloudNine has been submitted. A confirmation email has been sent to your inbox.',
    read: false,
    metadata: JSON.stringify({
      jobId: 'blt5555555555',
      jobTitle: 'DevOps Engineer',
      companyName: 'CloudNine',
      applicationId: 'APP-5555555555'
    })
  }
];

// Function to create entry
function createEntry(notificationData) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      entry: notificationData
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

// Function to publish an entry
function publishEntry(entryUid) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      entry: {
        environments: [CONFIG.ENVIRONMENT],
        locales: [CONFIG.BASE_LOCALE]
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

// Main function to seed notifications
async function seedNotifications() {
  console.log('🚀 Starting to seed notifications...\n');
  
  validateConfig();

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < notifications.length; i++) {
    const notification = notifications[i];
    try {
      console.log(`[${i + 1}/${notifications.length}] Creating notification: ${notification.title}...`);
      
      // Create entry
      const createdEntry = await createEntry(notification);
      const entryUid = createdEntry.entry.uid;
      console.log(`  ✅ Created successfully (UID: ${entryUid})`);
      
      // Publish entry
      await publishEntry(entryUid);
      console.log(`  📤 Published successfully`);
      
      successCount++;
      
      // Small delay between entries to avoid rate limiting
      if (i < notifications.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`  ❌ Failed: ${error.message}`);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Successfully created: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log('='.repeat(50));
}

// Run the script
seedNotifications().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

