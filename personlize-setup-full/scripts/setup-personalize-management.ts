/**
 * End-to-end Personalize setup via Personalize Management API for Job Portal:
 * - Create Attributes: first_time_user, ready_to_apply, tech_job_seeker, returning_user, engagement_level
 * - Create Audiences: First Time Users, Ready to Apply, Tech Job Seekers, Returning Users, High Engagement
 * - Create a Segmented Experience and activate a version with variants for different user segments
 *
 * Auth: uses `authtoken` header (CONTENTSTACK_PERSONALIZE_AUTHTOKEN).
 *
 * Docs: https://www.contentstack.com/docs/developers/apis/personalize-management-api
 */
import * as contentstack from '@contentstack/management';
import * as dotenv from 'dotenv';
import * as path from 'path';
import {
  createPersonalizeManagementClient,
  PersonalizeManagementError,
} from './personalize-management';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const REGION = process.env.CONTENTSTACK_REGION || process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'aws-na';

// Contentstack (CMS) inputs (used only to find the base entry UID if not provided)
const STACK_API_KEY = process.env.CONTENTSTACK_API_KEY || process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || '';
const MANAGEMENT_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN || '';
const LOCALE = process.env.CONTENTSTACK_LOCALE || process.env.NEXT_PUBLIC_CONTENTSTACK_LOCALE || 'en-us';

// Personalize inputs
const PROJECT_UID = process.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID || '';
const AUTHTOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_AUTHTOKEN || process.env.CONTENTSTACK_PERSONALIZE_AUTHTOKEN || process.env.CONTENTSTACK_AUTHTOKEN || '';

// Experience/content linkage (optional but recommended)
const CONTENT_TYPE_UID = process.env.CONTENTSTACK_PERSONALIZE_CONTENT_TYPE_UID || 'personalized_banner';
const BASE_ENTRY_UID_FROM_ENV = process.env.CONTENTSTACK_PERSONALIZE_BASE_ENTRY_UID || '';

type CreatedEntity<T> = T & { uid?: string; id?: string };

async function ensureBaseEntryUid(): Promise<string | null> {
  if (BASE_ENTRY_UID_FROM_ENV) return BASE_ENTRY_UID_FROM_ENV;
  if (!STACK_API_KEY || !MANAGEMENT_TOKEN) return null;

  const client = contentstack.client({ region: REGION as 'us' | 'eu' | 'azure-na' | 'azure-eu' });
  const entries = await client
    .stack({ api_key: STACK_API_KEY, management_token: MANAGEMENT_TOKEN })
    .contentType(CONTENT_TYPE_UID)
    .entry()
    .query()
    .find();

  const items = (entries as { items?: Array<{ uid: string; title?: string }> }).items || [];
  if (!items.length) return null;
  const base = items.find((e) => (e.title || '').includes('Default Welcome')) || items[0];
  return base?.uid || null;
}

async function createOrGetAttribute(
  pm: ReturnType<typeof createPersonalizeManagementClient>,
  args: { name: string; key: string; description: string; dataType: 'STRING' | 'BOOLEAN' | 'NUMBER' }
) {
  const payload = {
    name: args.name,
    key: args.key,
    description: args.description,
    dataType: args.dataType,
  };

  try {
    const created = await pm.request<{ attribute?: CreatedEntity<{ uid?: string; key?: string }> }>(
      'POST',
      `/projects/${PROJECT_UID}/attributes`,
      payload
    );
    return created.attribute || (created as unknown as CreatedEntity<{ uid?: string; key?: string }>);
  } catch (e: unknown) {
    // Fallback: list and find by key.
    const list = await pm.request<{ attributes?: Array<CreatedEntity<{ uid?: string; key?: string }>> }>(
      'GET',
      `/projects/${PROJECT_UID}/attributes`
    );
    const attrs = list.attributes || [];
    const existing = attrs.find((a) => a.key === args.key);
    if (existing) return existing;
    throw e;
  }
}

async function createOrGetAudience(
  pm: ReturnType<typeof createPersonalizeManagementClient>,
  args: { name: string; key: string; attributeKey: string; operator: string; value: string | boolean }
) {
  const payload = {
    name: args.name,
    key: args.key,
    conditions: [
      {
        attributeKey: args.attributeKey,
        operator: args.operator,
        value: args.value,
      },
    ],
  };

  try {
    const created = await pm.request<{ audience?: CreatedEntity<{ uid?: string; key?: string }> }>(
      'POST',
      `/projects/${PROJECT_UID}/audiences`,
      payload
    );
    return created.audience || (created as unknown as CreatedEntity<{ uid?: string; key?: string }>);
  } catch (e: unknown) {
    const list = await pm.request<{ audiences?: Array<CreatedEntity<{ uid?: string; key?: string }>> }>(
      'GET',
      `/projects/${PROJECT_UID}/audiences`
    );
    const audiences = list.audiences || [];
    const existing = audiences.find((a) => a.key === args.key);
    if (existing) return existing;
    throw e;
  }
}

async function createSegmentedExperience(
  pm: ReturnType<typeof createPersonalizeManagementClient>,
  args: {
    name: string;
    contentTypeUid?: string;
    entryUid?: string;
  }
) {
  const payload = {
    __type: 'SegmentedExperience',
    name: args.name,
    content: args.contentTypeUid && args.entryUid ? { type: 'ENTRY', contentTypeUid: args.contentTypeUid, entryUid: args.entryUid, locale: LOCALE } : undefined,
  };

  const created = await pm.request<{ experience?: CreatedEntity<{ uid?: string; name?: string }> }>(
    'POST',
    `/projects/${PROJECT_UID}/experiences`,
    payload
  );
  return created.experience || (created as unknown as CreatedEntity<{ uid?: string; name?: string }>);
}

async function createDraftVersion(
  pm: ReturnType<typeof createPersonalizeManagementClient>,
  args: {
    experienceUid: string;
    firstTimeUserAudienceUid: string;
    readyToApplyAudienceUid: string;
    techJobSeekerAudienceUid: string;
    returningUserAudienceUid: string;
  }
) {
  const payload = {
    status: 'DRAFT',
    variants: [
      {
        __type: 'SegmentedVariant',
        name: 'First Time User',
        audiences: [args.firstTimeUserAudienceUid],
        audienceCombinationType: 'AND',
      },
      {
        __type: 'SegmentedVariant',
        name: 'Ready to Apply',
        audiences: [args.readyToApplyAudienceUid],
        audienceCombinationType: 'AND',
      },
      {
        __type: 'SegmentedVariant',
        name: 'Tech Job Seeker',
        audiences: [args.techJobSeekerAudienceUid],
        audienceCombinationType: 'AND',
      },
      {
        __type: 'SegmentedVariant',
        name: 'Returning User',
        audiences: [args.returningUserAudienceUid],
        audienceCombinationType: 'AND',
      },
    ],
  };

  const created = await pm.request<{ version?: CreatedEntity<{ uid?: string; status?: string }> }>(
    'POST',
    `/projects/${PROJECT_UID}/experiences/${args.experienceUid}/versions`,
    payload
  );
  return created.version || (created as unknown as CreatedEntity<{ uid?: string; status?: string }>);
}

async function activateVersion(
  pm: ReturnType<typeof createPersonalizeManagementClient>,
  args: {
    experienceUid: string;
    versionUid: string;
    firstTimeUserAudienceUid: string;
    readyToApplyAudienceUid: string;
    techJobSeekerAudienceUid: string;
    returningUserAudienceUid: string;
  }
) {
  const payload = {
    status: 'ACTIVE',
    variants: [
      {
        __type: 'SegmentedVariant',
        name: 'First Time User',
        audiences: [args.firstTimeUserAudienceUid],
        audienceCombinationType: 'AND',
      },
      {
        __type: 'SegmentedVariant',
        name: 'Ready to Apply',
        audiences: [args.readyToApplyAudienceUid],
        audienceCombinationType: 'AND',
      },
      {
        __type: 'SegmentedVariant',
        name: 'Tech Job Seeker',
        audiences: [args.techJobSeekerAudienceUid],
        audienceCombinationType: 'AND',
      },
      {
        __type: 'SegmentedVariant',
        name: 'Returning User',
        audiences: [args.returningUserAudienceUid],
        audienceCombinationType: 'AND',
      },
    ],
  };

  await pm.request(
    'PUT',
    `/projects/${PROJECT_UID}/experiences/${args.experienceUid}/versions/${args.versionUid}`,
    payload
  );
}

async function main() {
  console.log('🧩 Starting Personalize Management API setup for Job Portal...\n');

  if (!PROJECT_UID) throw new Error('NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID is required');
  if (!AUTHTOKEN) throw new Error('NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_AUTHTOKEN (or CONTENTSTACK_PERSONALIZE_AUTHTOKEN or CONTENTSTACK_AUTHTOKEN) is required');

  console.log('Configuration:');
  console.log(`  Project UID: ${PROJECT_UID}`);
  console.log(`  Locale: ${LOCALE}`);
  console.log(`  Content type: ${CONTENT_TYPE_UID}`);

  const pm = createPersonalizeManagementClient({ authtoken: AUTHTOKEN });

  try {
    const baseEntryUid = await ensureBaseEntryUid();
    if (baseEntryUid) console.log(`  Base entry UID: ${baseEntryUid}`);
    else console.log('  Base entry UID: (not set / not resolved) — experience will be created without CMS entry linkage');

    console.log('\n1) Creating/getting attributes for job portal personalization');
    
    const firstTimeUserAttr = await createOrGetAttribute(pm, {
      name: 'First Time User',
      key: 'first_time_user',
      description: 'Whether this is the user\'s first visit to the job portal',
      dataType: 'BOOLEAN',
    });
    console.log(`✅ Attribute ready: first_time_user uid=${firstTimeUserAttr.uid || '(unknown)'}`);

    const readyToApplyAttr = await createOrGetAttribute(pm, {
      name: 'Ready to Apply',
      key: 'ready_to_apply',
      description: 'User has viewed 3+ jobs but hasn\'t applied yet',
      dataType: 'BOOLEAN',
    });
    console.log(`✅ Attribute ready: ready_to_apply uid=${readyToApplyAttr.uid || '(unknown)'}`);

    const techJobSeekerAttr = await createOrGetAttribute(pm, {
      name: 'Tech Job Seeker',
      key: 'tech_job_seeker',
      description: 'User is interested in Engineering/Technology jobs',
      dataType: 'BOOLEAN',
    });
    console.log(`✅ Attribute ready: tech_job_seeker uid=${techJobSeekerAttr.uid || '(unknown)'}`);

    const returningUserAttr = await createOrGetAttribute(pm, {
      name: 'Returning User',
      key: 'returning_user',
      description: 'User has visited the site more than once',
      dataType: 'BOOLEAN',
    });
    console.log(`✅ Attribute ready: returning_user uid=${returningUserAttr.uid || '(unknown)'}`);

    const engagementLevelAttr = await createOrGetAttribute(pm, {
      name: 'Engagement Level',
      key: 'engagement_level',
      description: 'User engagement level: low, medium, or high',
      dataType: 'STRING',
    });
    console.log(`✅ Attribute ready: engagement_level uid=${engagementLevelAttr.uid || '(unknown)'}`);

    console.log('\n2) Creating/getting audiences');
    
    const firstTimeUserAudience = await createOrGetAudience(pm, {
      name: 'First Time Users',
      key: 'first_time_users',
      attributeKey: 'first_time_user',
      operator: 'equals',
      value: true,
    });
    console.log(`✅ Audience ready: first_time_users uid=${firstTimeUserAudience.uid || '(unknown)'}`);

    const readyToApplyAudience = await createOrGetAudience(pm, {
      name: 'Ready to Apply',
      key: 'ready_to_apply_users',
      attributeKey: 'ready_to_apply',
      operator: 'equals',
      value: true,
    });
    console.log(`✅ Audience ready: ready_to_apply_users uid=${readyToApplyAudience.uid || '(unknown)'}`);

    const techJobSeekerAudience = await createOrGetAudience(pm, {
      name: 'Tech Job Seekers',
      key: 'tech_job_seekers',
      attributeKey: 'tech_job_seeker',
      operator: 'equals',
      value: true,
    });
    console.log(`✅ Audience ready: tech_job_seekers uid=${techJobSeekerAudience.uid || '(unknown)'}`);

    const returningUserAudience = await createOrGetAudience(pm, {
      name: 'Returning Users',
      key: 'returning_users',
      attributeKey: 'returning_user',
      operator: 'equals',
      value: true,
    });
    console.log(`✅ Audience ready: returning_users uid=${returningUserAudience.uid || '(unknown)'}`);

    if (!firstTimeUserAudience.uid || !readyToApplyAudience.uid || !techJobSeekerAudience.uid || !returningUserAudience.uid) {
      console.log('\n⚠️  Audience UIDs missing from response; skipping experience creation.');
      console.log('   (This usually indicates the endpoint/payload differs for your tenant; adjust base URL/prefix/payload.)');
      return;
    }

    console.log('\n3) Creating segmented experience');
    const experience = await createSegmentedExperience(pm, {
      name: 'Job Portal Personalized Banners',
      contentTypeUid: CONTENT_TYPE_UID,
      entryUid: baseEntryUid || undefined,
    });
    const experienceUid = experience.uid;
    console.log(`✅ Experience created: uid=${experienceUid || '(unknown)'}`);

    if (!experienceUid) {
      console.log('\n⚠️  Experience UID missing from response; cannot create/activate versions.');
      return;
    }

    console.log('\n4) Creating draft version with user segment variants');
    const version = await createDraftVersion(pm, {
      experienceUid,
      firstTimeUserAudienceUid: firstTimeUserAudience.uid,
      readyToApplyAudienceUid: readyToApplyAudience.uid,
      techJobSeekerAudienceUid: techJobSeekerAudience.uid,
      returningUserAudienceUid: returningUserAudience.uid,
    });
    const versionUid = version.uid;
    console.log(`✅ Draft version created: uid=${versionUid || '(unknown)'} status=${version.status || 'DRAFT'}`);

    if (!versionUid) {
      console.log('\n⚠️  Version UID missing from response; cannot activate.');
      return;
    }

    console.log('\n5) Activating version');
    await activateVersion(pm, {
      experienceUid,
      versionUid,
      firstTimeUserAudienceUid: firstTimeUserAudience.uid,
      readyToApplyAudienceUid: readyToApplyAudience.uid,
      techJobSeekerAudienceUid: techJobSeekerAudience.uid,
      returningUserAudienceUid: returningUserAudience.uid,
    });
    console.log('✅ Version activated (ACTIVE)');

    console.log('\n✅ Personalize Management API setup complete!');
    console.log('\n📋 Next steps:');
    console.log('   1. Verify the experience in Contentstack Dashboard → Personalize → Your Project');
    console.log('   2. Create entry variants for each audience segment (or they will be created automatically)');
    console.log('   3. Test personalization in your app by setting user attributes');
    console.log('   4. The PersonalizedBanner component will automatically use these experiences\n');
  } catch (error: unknown) {
    if (error instanceof PersonalizeManagementError) {
      console.error(`\n❌ Personalize Management API error: ${error.status} ${error.statusText}`);
      if (error.responseBody) console.error(JSON.stringify(error.responseBody, null, 2));
    } else {
      const err = error as { message?: string; stack?: string };
      console.error('\n❌ Setup failed:', err?.message || 'Unknown error');
      if (err?.stack) console.error(err.stack);
    }

    console.error('\nTroubleshooting:');
    console.error('- Confirm the Personalize Management API host/prefix for your org.');
    console.error('- Set CONTENTSTACK_PERSONALIZE_MANAGEMENT_BASE_URL and/or CONTENTSTACK_PERSONALIZE_MANAGEMENT_API_PREFIX.');
    console.error('- Confirm `authtoken` is valid and has permission to manage Personalize project settings.');
    process.exit(1);
  }
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});

