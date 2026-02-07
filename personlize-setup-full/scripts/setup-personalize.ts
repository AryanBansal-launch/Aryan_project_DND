/**
 * Setup script for Personalized Banner variants in Contentstack
 * 
 * This script helps set up entry variants for personalized banners.
 * It can optionally create variants via CMA or just display configuration info.
 * 
 * Run: tsx scripts/setup-personalize.ts
 */

import * as contentstack from '@contentstack/management';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { createCmaClient, CmaError } from './cma';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const API_KEY = process.env.CONTENTSTACK_API_KEY || process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || '';
const MANAGEMENT_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN || '';
const ENVIRONMENT = process.env.CONTENTSTACK_ENVIRONMENT || process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || '';
const REGION = process.env.CONTENTSTACK_REGION || process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'aws-na';
const PERSONALIZE_PROJECT_UID = process.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID || '';
const LOCALE = process.env.CONTENTSTACK_LOCALE || process.env.NEXT_PUBLIC_CONTENTSTACK_LOCALE || 'en-us';

// Flags
const SHOULD_CREATE_VARIANTS =
  (process.env.CONTENTSTACK_CREATE_ENTRY_VARIANTS || '').toLowerCase() === 'true';
const SHOULD_PUBLISH_VARIANTS =
  (process.env.CONTENTSTACK_PUBLISH_ENTRY_VARIANTS || '').toLowerCase() === 'true';

// Configuration
const CONTENT_TYPE_UID = 'personalized_banner';

// Variant configurations for different user segments
interface VariantConfig {
  name: string;
  uid: string;
  entryTitle: string;
  entryUid?: string;
  personalizeMetadata: {
    experience_uid?: string;
    experience_short_uid?: string;
    project_uid: string;
    variant_short_uid: string;
  };
  entryData: {
    title: string;
    banner_title: string;
    banner_message: string;
    cta_text: string;
    cta_link: { title: string; href: string };
    delay_seconds?: number;
    enabled?: boolean;
    priority?: number;
  };
}

type CreatedVariantInfo = {
  uid?: string;
  variant_uid?: string;
  name?: string;
  [key: string]: unknown;
};

/**
 * Create an entry variant via CMA (REST).
 */
async function createEntryVariantViaCma(args: {
  entryUid: string;
  variant: VariantConfig;
}): Promise<CreatedVariantInfo> {
  const cma = createCmaClient({
    apiKey: API_KEY,
    managementToken: MANAGEMENT_TOKEN,
    region: REGION,
  });

  const payload = {
    entry_variant: {
      uid: args.variant.uid,
      name: args.variant.name,
      locale: LOCALE,
      entry: args.variant.entryData,
      personalize: args.variant.personalizeMetadata,
    },
  };

  const res = await cma.request<{ entry_variant?: CreatedVariantInfo }>(
    'POST',
    `/v3/content_types/${CONTENT_TYPE_UID}/entries/${args.entryUid}/variants`,
    payload
  );

  return res.entry_variant || (res as unknown as CreatedVariantInfo);
}

/**
 * Publish an entry variant via CMA (REST).
 */
async function publishEntryVariantViaCma(args: {
  entryUid: string;
  variantUid: string;
}): Promise<void> {
  const cma = createCmaClient({
    apiKey: API_KEY,
    managementToken: MANAGEMENT_TOKEN,
    region: REGION,
  });

  await cma.request(
    'POST',
    `/v3/content_types/${CONTENT_TYPE_UID}/entries/${args.entryUid}/variants/${args.variantUid}/publish`,
    {
      publishDetails: {
        environments: [ENVIRONMENT],
        locales: [LOCALE],
      },
    }
  );
}

/**
 * Fetch all entries of the content type
 */
async function fetchEntries(
  client: ReturnType<typeof contentstack.client>
): Promise<Array<{ uid: string; title: string }>> {
  try {
    const entries = await client
      .stack({ api_key: API_KEY, management_token: MANAGEMENT_TOKEN })
      .contentType(CONTENT_TYPE_UID)
      .entry()
      .query()
      .find();

    if (entries && Array.isArray(entries.items)) {
      return entries.items.map((entry: { uid: string; title?: string }) => ({
        uid: entry.uid,
        title: (entry as { title?: string }).title || 'Untitled',
      }));
    }
    return [];
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('Error fetching entries:', err?.message);
    return [];
  }
}

/**
 * Display entry variant configuration information
 */
async function displayVariantInfo(
  entryUid: string,
  variantConfig: VariantConfig
): Promise<void> {
  console.log(`ℹ️  Variant: "${variantConfig.name}"`);
  console.log(`   Entry UID: ${entryUid}`);
  console.log(`   Suggested Variant Name: ${variantConfig.name}`);
  console.log(`   Content Preview: ${variantConfig.entryData.banner_title}`);
  console.log(
    SHOULD_CREATE_VARIANTS
      ? `   → This script will attempt to create this entry variant via CMA`
      : `   → Create this variant in Personalize Dashboard (or set CONTENTSTACK_CREATE_ENTRY_VARIANTS=true)`
  );
}

/**
 * Setup variants for job portal user segments
 */
async function setupBannerVariants(
  client: ReturnType<typeof contentstack.client>,
  baseEntryUid: string
): Promise<void> {
  console.log('\n🎯 Setting up personalized banner variants...');

  const bannerVariants: VariantConfig[] = [
    {
      name: 'First Time User Variant',
      uid: 'variant_first_time_user',
      entryTitle: 'First Time User Banner',
      personalizeMetadata: {
        project_uid: PERSONALIZE_PROJECT_UID,
        variant_short_uid: 'first_time_user',
      },
      entryData: {
        title: 'First Time User Banner',
        banner_title: 'Welcome to JobPortal! ✨',
        banner_message: 'Discover thousands of opportunities. Create your profile to get personalized recommendations.',
        cta_text: 'Get Started',
        cta_link: { title: 'Get Started', href: '/profile' },
        delay_seconds: 3,
        enabled: true,
        priority: 1,
      },
    },
    {
      name: 'Ready to Apply Variant',
      uid: 'variant_ready_to_apply',
      entryTitle: 'Ready to Apply Banner',
      personalizeMetadata: {
        project_uid: PERSONALIZE_PROJECT_UID,
        variant_short_uid: 'ready_to_apply',
      },
      entryData: {
        title: 'Ready to Apply Banner',
        banner_title: 'Ready to Take the Next Step? 🎯',
        banner_message: "You've been exploring some great opportunities. Why not apply to one that matches your skills?",
        cta_text: 'Apply Now',
        cta_link: { title: 'Apply Now', href: '/jobs' },
        delay_seconds: 10,
        enabled: true,
        priority: 2,
      },
    },
    {
      name: 'Tech Job Seeker Variant',
      uid: 'variant_tech_job_seeker',
      entryTitle: 'Tech Job Seeker Banner',
      personalizeMetadata: {
        project_uid: PERSONALIZE_PROJECT_UID,
        variant_short_uid: 'tech_job_seeker',
      },
      entryData: {
        title: 'Tech Job Seeker Banner',
        banner_title: '🚀 Hot Tech Jobs Just Posted!',
        banner_message: 'Based on your interest in Engineering roles, check out these new opportunities.',
        cta_text: 'View Tech Jobs',
        cta_link: { title: 'View Tech Jobs', href: '/jobs?category=Engineering' },
        delay_seconds: 8,
        enabled: true,
        priority: 3,
      },
    },
    {
      name: 'Returning User Variant',
      uid: 'variant_returning_user',
      entryTitle: 'Returning User Banner',
      personalizeMetadata: {
        project_uid: PERSONALIZE_PROJECT_UID,
        variant_short_uid: 'returning_user',
      },
      entryData: {
        title: 'Returning User Banner',
        banner_title: 'Welcome Back! 👋',
        banner_message: "We've got new jobs since your last visit. Check out what's new!",
        cta_text: "See What's New",
        cta_link: { title: "See What's New", href: '/jobs' },
        delay_seconds: 5,
        enabled: true,
        priority: 4,
      },
    },
  ];

  for (const variant of bannerVariants) {
    await displayVariantInfo(baseEntryUid, variant);
    if (SHOULD_CREATE_VARIANTS) {
      try {
        const created = await createEntryVariantViaCma({ entryUid: baseEntryUid, variant });
        const createdUid = (created.uid || created.variant_uid) as string | undefined;
        console.log(`✅ Created entry variant "${variant.name}"${createdUid ? ` (UID: ${createdUid})` : ''}`);

        if (SHOULD_PUBLISH_VARIANTS && createdUid) {
          await publishEntryVariantViaCma({ entryUid: baseEntryUid, variantUid: createdUid });
          console.log(`   Published variant to ${ENVIRONMENT} (${LOCALE})`);
        } else if (SHOULD_PUBLISH_VARIANTS && !createdUid) {
          console.log(`⚠️  Variant created but UID missing in response; skipping publish.`);
        }
      } catch (error: unknown) {
        if (error instanceof CmaError) {
          console.error(`❌ CMA error creating/publishing variant "${variant.name}": ${error.status} ${error.statusText}`);
          if (error.responseBody) {
            console.error('   Response:', JSON.stringify(error.responseBody, null, 2));
          }
        } else {
          const err = error as { message?: string };
          console.error(`❌ Error creating/publishing variant "${variant.name}":`, err?.message || 'Unknown error');
        }
      }
    }
  }
}

/**
 * Main setup function
 */
async function main() {
  console.log('🎯 Starting Personalized Banner Variants Setup...\n');

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
  if (!PERSONALIZE_PROJECT_UID) {
    console.warn('⚠️  NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID not set. Variants will be created but may need manual configuration.');
  }

  console.log('Configuration:');
  console.log(`  API Key: ${API_KEY.substring(0, 10)}...`);
  console.log(`  Environment: ${ENVIRONMENT}`);
  console.log(`  Region: ${REGION}`);
  console.log(`  Personalize Project UID: ${PERSONALIZE_PROJECT_UID || 'Not set'}`);
  console.log(`  Locale: ${LOCALE}`);
  console.log(`  Create entry variants via CMA: ${SHOULD_CREATE_VARIANTS ? 'YES' : 'no'}`);
  console.log(`  Publish entry variants via CMA: ${SHOULD_PUBLISH_VARIANTS ? 'YES' : 'no'}`);

  // Initialize Management API client
  const client = contentstack.client({
    region: REGION as 'us' | 'eu' | 'azure-na' | 'azure-eu',
  });

  try {
    // Fetch existing entries
    console.log('\n📋 Fetching existing entries...');
    const entries = await fetchEntries(client);

    if (entries.length === 0) {
      console.log('❌ No entries found. Please run setup-content.ts first to create entries.');
      process.exit(1);
    }

    console.log(`✅ Found ${entries.length} entries:`);
    entries.forEach((entry) => {
      console.log(`   - ${entry.title} (UID: ${entry.uid})`);
    });

    // Use the default banner as the base entry for variants
    const baseEntry = entries.find((e) => e.title.includes('Default Welcome')) || entries[0];
    console.log(`\n📌 Using entry "${baseEntry.title}" (${baseEntry.uid}) as base for variants`);

    console.log('\n📝 Entry Variant Information:');
    console.log(
      SHOULD_CREATE_VARIANTS
        ? '   This run will attempt to create entry variants via the CMA REST API.'
        : '   This run will only show variant configs (no API writes).'
    );
    console.log('   You can also create variants automatically when you create experiences in Personalize Dashboard.\n');

    // Setup banner variants
    await setupBannerVariants(client, baseEntry.uid);

    console.log('\n✅ Personalize setup information provided!');
    console.log('\n📋 Next steps (IMPORTANT - Do these in Personalize Dashboard):');
    console.log('   1. Go to Contentstack Dashboard → Personalize → Your Project');
    console.log('   2. Create Attributes (if not already done):');
    console.log('      - first_time_user (BOOLEAN)');
    console.log('      - ready_to_apply (BOOLEAN)');
    console.log('      - tech_job_seeker (BOOLEAN)');
    console.log('      - returning_user (BOOLEAN)');
    console.log('      - engagement_level (STRING: low/medium/high)');
    console.log('   3. Create Audiences:');
    console.log('      - First Time Users (first_time_user equals true)');
    console.log('      - Ready to Apply (ready_to_apply equals true)');
    console.log('      - Tech Job Seekers (tech_job_seeker equals true)');
    console.log('      - Returning Users (returning_user equals true)');
    console.log('   4. Create Experiences (this is where variants are created):');
    console.log('      - Go to Experiences → Create Experience');
    console.log('      - Select your entry: "Default Welcome Banner"');
    console.log('      - Add Audience Conditions and create variants');
    console.log('      - Save and Publish the experience');
    console.log('   5. Run setup-personalize-management.ts to automate steps 2-4\n');
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

