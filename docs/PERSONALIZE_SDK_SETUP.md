# Contentstack Personalize Edge SDK Setup

## Overview

This project now includes integration with Contentstack Personalize Edge SDK for true personalization based on experiences and audiences.

## Installation

### Step 1: Install the SDK

The Contentstack Personalize Edge SDK needs to be installed. Check the [Contentstack Personalize documentation](https://www.contentstack.com/docs/personalize/) for the correct package name and installation command.

**Possible package names:**
- `@contentstack/personalize-edge-sdk`
- `@contentstack/personalize-sdk`
- `contentstack-personalize-edge-sdk`

**Installation command:**
```bash
npm install @contentstack/personalize-edge-sdk
```

**Note:** If the package name is different, check Contentstack documentation or contact Contentstack support.

### Step 2: Get Your Personalize Project UID

1. Log in to your Contentstack account
2. Navigate to **Personalize** section
3. Select or create a Personalize project
4. Copy the **Project UID** from the project settings

### Step 3: Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Contentstack Personalize Project UID
NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID=your_project_uid_here
```

## How It Works

### Current Implementation (Hybrid Approach)

The code uses a **hybrid approach** that works with or without the Personalize SDK:

1. **If Personalize SDK is available:**
   - Initializes the SDK with your Project UID
   - Sets user attributes (time on site, clicks, etc.)
   - Gets active experiences from Contentstack
   - Fetches personalized content variants
   - Tracks events (impressions, clicks)

2. **If Personalize SDK is NOT available:**
   - Falls back to the API route method (`/api/personalized-banner`)
   - Uses manual filtering by `user_segment` field
   - Still provides personalization, but not through Contentstack's engine

### Integration Points

#### 1. Component Initialization

The `PersonalizedBanner` component automatically:
- Initializes Personalize SDK on mount (if Project UID is set)
- Sets user attributes based on behavior
- Updates attributes as user behavior changes

#### 2. Content Fetching

When the banner is about to show:
1. **First tries Personalize SDK** (if available)
   - Gets personalized content from Contentstack
   - Uses experiences and audiences you configured
   
2. **Falls back to API route** (if SDK not available)
   - Uses `/api/personalized-banner` endpoint
   - Manual filtering by `user_segment`

#### 3. Event Tracking

The component tracks:
- **Banner impressions**: When banner is shown
- **CTA clicks**: When user clicks "Apply Now"
- **User attributes**: Time on site, clicks, segments

## Configuration in Contentstack

### 1. Create Experiences

In Contentstack Personalize dashboard:
1. Create an **Experience** for your banner
2. Set up **Audiences** based on:
   - `time_on_site` attribute
   - `has_clicked_apply_now` attribute
   - `user_segment` attribute

### 2. Create Variants

For each experience:
1. Create **Variants** with different banner content
2. Assign variants to specific audiences
3. Set up A/B testing if needed

### 3. Link Content

1. In your Experience, link the `personalized_banner` content type
2. Assign specific banner entries to variants
3. Configure targeting rules

## User Attributes

The following user attributes are automatically sent to Contentstack Personalize:

| Attribute | Type | Description |
|-----------|------|-------------|
| `time_on_site` | number | Time in seconds user has been on site |
| `has_clicked_apply_now` | boolean | Whether user clicked "Apply Now" |
| `user_segment` | string | User segment (e.g., "users_not_applied_30s") |
| `page_views` | number | Number of pages viewed (optional) |
| `user_id` | string | User ID (optional) |
| `user_email` | string | User email (optional) |

## Events Tracked

| Event | When | Data |
|-------|------|------|
| `banner_impression` | Banner is shown | `banner_title` |
| `banner_cta_click` | User clicks CTA | `banner_title`, `cta_text` |

## Troubleshooting

### SDK Not Found Error

If you see errors about the SDK not being found:

1. **Check package name**: Verify the correct package name in Contentstack docs
2. **Install package**: Run `npm install` with the correct package name
3. **Check version**: Ensure you're using a compatible version

### SDK Not Initializing

1. **Check Project UID**: Verify `NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID` is set correctly
2. **Check console**: Look for initialization errors in browser console
3. **Verify access**: Ensure your Contentstack account has Personalize enabled

### No Personalized Content

1. **Check experiences**: Verify experiences are active in Contentstack
2. **Check audiences**: Ensure user attributes match audience rules
3. **Check variants**: Verify variants are assigned to experiences
4. **Check fallback**: The code will fall back to API route if SDK fails

## Fallback Behavior

The implementation is designed to **gracefully degrade**:

- ✅ **With Personalize SDK**: Full personalization via Contentstack engine
- ✅ **Without Personalize SDK**: Still works via API route + manual filtering
- ✅ **No configuration**: Still works with static content from Contentstack

## Next Steps

1. **Install SDK**: Get the correct package and install it
2. **Get Project UID**: Copy from Contentstack Personalize dashboard
3. **Set environment variable**: Add to `.env.local`
4. **Test**: Verify personalization is working
5. **Configure**: Set up experiences and audiences in Contentstack

## Resources

- [Contentstack Personalize Documentation](https://www.contentstack.com/docs/personalize/)
- [Personalize Edge API](https://www.contentstack.com/docs/developers/apis/personalize-edge-api)
- [Personalize Edge SDK Reference](https://personalize-sdk-docs.contentstackapps.com/)

