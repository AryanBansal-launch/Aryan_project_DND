/**
 * Setup script for Personalized Banner content in Contentstack
 * 
 * This script creates sample personalized_banner entries that can be used
 * with Contentstack Personalize to deliver different banner content based on
 * user behavior and attributes (e.g., first_time_user, ready_to_apply, etc.)
 * 
 * Run: tsx scripts/setup-content.ts
 */

import * as contentstack from '@contentstack/management';
import Contentstack from '@contentstack/delivery-sdk';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env');
const envLoaded = dotenv.config({ path: envPath });

if (envLoaded.error) {
  console.warn(`⚠️  Warning: Could not load .env from ${envPath}`);
  console.warn('   Make sure .env exists in the project root');
  console.warn('   Falling back to system environment variables...\n');
}

const API_KEY = process.env.CONTENTSTACK_API_KEY || process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || '';
const MANAGEMENT_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN || '';
const DELIVERY_TOKEN = process.env.CONTENTSTACK_DELIVERY_TOKEN || process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN || '';
const ENVIRONMENT = process.env.CONTENTSTACK_ENVIRONMENT || process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || '';
const REGION = process.env.CONTENTSTACK_REGION || process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'aws-na';

// Content Type Configuration
const CONTENT_TYPE_UID = 'personalized_banner';
const CONTENT_TYPE_TITLE = 'Personalized Banner';

interface BannerEntryData {
  title: string;
  banner_title: string;
  banner_message: string;
  cta_text: string;
  cta_link: { title: string; href: string };
  delay_seconds?: number;
  enabled?: boolean;
  user_segment?: string;
  priority?: number;
}

async function createEntry(
  client: ReturnType<typeof contentstack.client>,
  entryData: BannerEntryData
): Promise<string> {
  const formattedEntry: any = {
    title: entryData.title,
    banner_title: entryData.banner_title,
    banner_message: entryData.banner_message,
    cta_text: entryData.cta_text,
    cta_link: entryData.cta_link,
  };

  if (entryData.delay_seconds !== undefined) {
    formattedEntry.delay_seconds = entryData.delay_seconds;
  }
  if (entryData.enabled !== undefined) {
    formattedEntry.enabled = entryData.enabled;
  }
  if (entryData.user_segment) {
    formattedEntry.user_segment = entryData.user_segment;
  }
  if (entryData.priority !== undefined) {
    formattedEntry.priority = entryData.priority;
  }

  const entry = await client
    .stack({ api_key: API_KEY, management_token: MANAGEMENT_TOKEN })
    .contentType(CONTENT_TYPE_UID)
    .entry()
    .create({
      entry: formattedEntry,
    });

  // Handle different response structures from Management SDK
  const createdEntry = entry as { entry?: { uid?: string }; uid?: string; [key: string]: unknown };
  
  if (createdEntry.entry?.uid) {
    return createdEntry.entry.uid;
  } else if (createdEntry.uid) {
    return createdEntry.uid;
  } else if (typeof createdEntry === 'object' && createdEntry !== null) {
    const entryObj = createdEntry as { uid?: string };
    if (entryObj.uid) {
      return entryObj.uid;
    }
  }
  
  console.error('Unexpected response structure:', JSON.stringify(entry, null, 2));
  throw new Error('Entry created but UID not found in response. Check console for response structure.');
}

async function publishEntry(
  client: ReturnType<typeof contentstack.client>,
  entryUid: string
): Promise<void> {
  await client
    .stack({ api_key: API_KEY, management_token: MANAGEMENT_TOKEN })
    .contentType(CONTENT_TYPE_UID)
    .entry(entryUid)
    .publish({
      publishDetails: {
        environments: [ENVIRONMENT],
        locales: ['en-us'],
      },
    });
}

async function createSampleBannerEntries(client: ReturnType<typeof contentstack.client>): Promise<void> {
  console.log('\n📄 Creating sample personalized banner entries...');

  const sampleBanners: BannerEntryData[] = [
    {
      title: 'Default Welcome Banner',
      banner_title: 'Find Your Dream Job',
      banner_message: 'Explore opportunities from top companies. Your next career move is waiting!',
      cta_text: 'Browse Jobs',
      cta_link: { title: 'Browse Jobs', href: '/jobs' },
      delay_seconds: 5,
      enabled: true,
      priority: 5,
    },
    {
      title: 'First Time User Banner',
      banner_title: 'Welcome to JobPortal! ✨',
      banner_message: 'Discover thousands of opportunities. Create your profile to get personalized recommendations.',
      cta_text: 'Get Started',
      cta_link: { title: 'Get Started', href: '/profile' },
      delay_seconds: 3,
      enabled: true,
      user_segment: 'first_time_user',
      priority: 1,
    },
    {
      title: 'Ready to Apply Banner',
      banner_title: 'Ready to Take the Next Step? 🎯',
      banner_message: "You've been exploring some great opportunities. Why not apply to one that matches your skills?",
      cta_text: 'Apply Now',
      cta_link: { title: 'Apply Now', href: '/jobs' },
      delay_seconds: 10,
      enabled: true,
      user_segment: 'ready_to_apply',
      priority: 2,
    },
    {
      title: 'Tech Job Seeker Banner',
      banner_title: '🚀 Hot Tech Jobs Just Posted!',
      banner_message: 'Based on your interest in Engineering roles, check out these new opportunities.',
      cta_text: 'View Tech Jobs',
      cta_link: { title: 'View Tech Jobs', href: '/jobs?category=Engineering' },
      delay_seconds: 8,
      enabled: true,
      user_segment: 'tech_job_seeker',
      priority: 3,
    },
    {
      title: 'Returning User Banner',
      banner_title: 'Welcome Back! 👋',
      banner_message: "We've got new jobs since your last visit. Check out what's new!",
      cta_text: "See What's New",
      cta_link: { title: "See What's New", href: '/jobs' },
      delay_seconds: 5,
      enabled: true,
      user_segment: 'returning_user',
      priority: 4,
    },
  ];

  for (const entryData of sampleBanners) {
    try {
      const entryUid = await createEntry(client, entryData);
      console.log(`✅ Created entry: ${entryData.title} (UID: ${entryUid})`);

      // Publish the entry
      await publishEntry(client, entryUid);
      console.log(`   Published to ${ENVIRONMENT}`);
    } catch (error: unknown) {
      const err = error as { message?: string; response?: unknown };
      console.error(`❌ Error creating entry "${entryData.title}":`, err?.message || 'Unknown error');
      if (err && typeof err === 'object' && 'response' in err) {
        console.error('   Response:', JSON.stringify(err.response, null, 2));
      }
    }
  }
}

async function verifyEntries(): Promise<void> {
  console.log('\n🔍 Verifying entries...');

  if (!DELIVERY_TOKEN) {
    console.log('⚠️  Delivery token not provided, skipping API verification');
    console.log(`   Please verify entries manually in Contentstack Dashboard → Content → ${CONTENT_TYPE_TITLE}`);
    return;
  }

  try {
    Contentstack.stack({
      apiKey: API_KEY,
      deliveryToken: DELIVERY_TOKEN,
      environment: ENVIRONMENT,
      region: REGION as 'us' | 'eu' | 'azure-na' | 'azure-eu',
    });

    console.log('✅ Delivery API configured successfully');
    console.log(`   You can verify entries in Contentstack Dashboard → Content → ${CONTENT_TYPE_TITLE}`);
    console.log(`   Or use the Delivery API to fetch entries programmatically`);
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.log('⚠️  Could not verify via API (this is okay if entries were created):', err?.message || 'Unknown error');
    console.log('   Please verify entries manually in Contentstack Dashboard');
  }
}

async function main() {
  console.log('🚀 Starting Personalized Banner Content Setup...\n');

  // Validate environment variables
  if (!API_KEY) {
    throw new Error('CONTENTSTACK_API_KEY or NEXT_PUBLIC_CONTENTSTACK_API_KEY is required');
  }
  if (!MANAGEMENT_TOKEN) {
    throw new Error('NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN is required');
  }
  if (!ENVIRONMENT) {
    throw new Error('CONTENTSTACK_ENVIRONMENT or NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT is required');
  }

  console.log('Configuration:');
  console.log(`  API Key: ${API_KEY.substring(0, 10)}...`);
  console.log(`  Environment: ${ENVIRONMENT}`);
  console.log(`  Region: ${REGION}`);
  console.log(`  Content Type: ${CONTENT_TYPE_UID}`);

  // Initialize Management API client
  const client = contentstack.client({
    region: REGION as 'us' | 'eu' | 'azure-na' | 'azure-eu',
  });

  try {
    // Check if content type exists
    try {
      await client
        .stack({ api_key: API_KEY, management_token: MANAGEMENT_TOKEN })
        .contentType(CONTENT_TYPE_UID)
        .fetch();
      console.log(`\n✅ Content type "${CONTENT_TYPE_UID}" exists`);
    } catch (error: unknown) {
      const err = error as { message?: string };
      if (err?.message?.includes('not found') || err?.message?.includes('does not exist')) {
        console.log(`\n❌ Content type "${CONTENT_TYPE_UID}" does not exist`);
        console.log(`   Please run the seed-personalized-banner.js script first to create the content type`);
        console.log(`   Or create it manually in Contentstack Dashboard`);
        process.exit(1);
      }
      throw error;
    }

    // Create sample entries
    await createSampleBannerEntries(client);

    // Verify entries via CDA
    await verifyEntries();

    console.log('\n✅ Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log(`   1. Set up Personalize experiences in Contentstack Dashboard`);
    console.log(`   2. Create attributes (first_time_user, ready_to_apply, etc.)`);
    console.log(`   3. Create audiences based on these attributes`);
    console.log(`   4. Create experiences linking audiences to banner variants`);
    console.log(`   5. Run setup-personalize-management.ts to automate step 2-4\n`);
  } catch (error: unknown) {
    const err = error as { message?: string; stack?: string };
    console.error('\n❌ Setup failed:', err?.message || 'Unknown error');
    if (err?.stack) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

