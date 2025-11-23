/**
 * Quick test script to verify Contentstack Personalization setup
 * Run: node scripts/test-personalization.js
 */

const https = require('https');
const dotenv = require('dotenv');
dotenv.config();

const CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
  DELIVERY_TOKEN: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN,
  ENVIRONMENT: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
  REGION: process.env.NEXT_PUBLIC_CONTENTSTACK_REGION,
};

const BASE_URLS = {
  us: 'cdn.contentstack.io',
  eu: 'eu-cdn.contentstack.com',
  'azure-na': 'azure-na-cdn.contentstack.com',
  'azure-eu': 'azure-eu-cdn.contentstack.com'
};

const BASE_URL = BASE_URLS[CONFIG.REGION] || BASE_URLS.us;

function fetchBanner(userSegment = 'users_not_applied_30s') {
  return new Promise((resolve, reject) => {
    const path = `/v3/content_types/personalized_banner/entries?environment=${CONFIG.ENVIRONMENT}&query={"user_segment":"${userSegment}","enabled":true}`;
    
    const options = {
      hostname: BASE_URL,
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'api_key': CONFIG.API_KEY,
        'access_token': CONFIG.DELIVERY_TOKEN,
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e.message}`));
          }
        } else {
          reject(new Error(`API request failed: ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function testPersonalization() {
  console.log('🧪 Testing Contentstack Personalization Setup...\n');
  console.log('='.repeat(60));

  // Check configuration
  console.log('\n📋 Step 1: Checking Configuration...');
  const missing = [];
  if (!CONFIG.API_KEY) missing.push('NEXT_PUBLIC_CONTENTSTACK_API_KEY');
  if (!CONFIG.DELIVERY_TOKEN) missing.push('NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN');
  if (!CONFIG.ENVIRONMENT) missing.push('NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT');
  if (!CONFIG.REGION) missing.push('NEXT_PUBLIC_CONTENTSTACK_REGION');

  if (missing.length > 0) {
    console.error('❌ Missing configuration:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\nPlease set these in your .env file.');
    process.exit(1);
  }
  console.log('✅ Configuration complete');

  // Test fetching banner
  console.log('\n📋 Step 2: Testing Banner Fetch...');
  try {
    const result = await fetchBanner();
    
    if (result.entries && result.entries.length > 0) {
      const entry = result.entries[0];
      console.log('✅ Banner entry found!');
      console.log('\n📄 Banner Details:');
      console.log(`   Title: ${entry.title || 'N/A'}`);
      console.log(`   Banner Title: ${entry.banner_title || 'N/A'}`);
      console.log(`   Banner Message: ${entry.banner_message?.substring(0, 50) || 'N/A'}...`);
      console.log(`   CTA Text: ${entry.cta_text || 'N/A'}`);
      console.log(`   Delay Seconds: ${entry.delay_seconds || 'N/A'}`);
      console.log(`   Enabled: ${entry.enabled !== false ? 'Yes' : 'No'}`);
      console.log(`   User Segment: ${entry.user_segment || 'N/A'}`);
      console.log(`   Priority: ${entry.priority || 'N/A'}`);
      
      // Validation checks
      console.log('\n📋 Step 3: Validating Banner Entry...');
      const issues = [];
      
      if (!entry.enabled) {
        issues.push('⚠️  Banner is disabled (enabled = false)');
      }
      if (entry.user_segment !== 'users_not_applied_30s') {
        issues.push(`⚠️  User segment mismatch: expected "users_not_applied_30s", got "${entry.user_segment}"`);
      }
      if (!entry.banner_title) {
        issues.push('⚠️  Banner title is missing');
      }
      if (!entry.banner_message) {
        issues.push('⚠️  Banner message is missing');
      }
      if (!entry.cta_text) {
        issues.push('⚠️  CTA text is missing');
      }
      if (!entry.cta_link) {
        issues.push('⚠️  CTA link is missing');
      }
      
      if (issues.length > 0) {
        console.log('\n⚠️  Issues found:');
        issues.forEach(issue => console.log(`   ${issue}`));
      } else {
        console.log('✅ All validations passed!');
      }
      
      console.log('\n' + '='.repeat(60));
      console.log('✅ Setup Verification Complete!');
      console.log('\n📝 Next Steps:');
      console.log('   1. Verify experience is Active in Contentstack Personalize');
      console.log('   2. Verify audience "users_not_applied_30s" exists');
      console.log('   3. Test on your website (wait 30+ seconds)');
      console.log('   4. Check browser console for any errors');
      console.log('='.repeat(60));
      
    } else {
      console.error('❌ No banner entries found!');
      console.error('\nPossible issues:');
      console.error('   1. Banner entry not created - Run: node scripts/seed-personalized-banner.js');
      console.error('   2. Banner entry not published');
      console.error('   3. user_segment mismatch');
      console.error('   4. enabled field is false');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error fetching banner:', error.message);
    console.error('\nPossible issues:');
    console.error('   1. Invalid API credentials');
    console.error('   2. Content type "personalized_banner" doesn\'t exist');
    console.error('   3. Network/connectivity issues');
    console.error('   4. Wrong region configuration');
    process.exit(1);
  }
}

// Run the test
testPersonalization();

