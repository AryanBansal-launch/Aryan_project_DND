# Contentstack Personalization - Complete Guide

This comprehensive guide covers everything you need to set up and use Contentstack Personalization for the personalized banner feature.

## Table of Contents

1. [Overview](#overview)
2. [Initial Setup](#initial-setup)
3. [Contentstack Personalize Configuration](#contentstack-personalize-configuration)
4. [Variant Configuration](#variant-configuration)
5. [Dynamic Personalization](#dynamic-personalization)
6. [Verification & Testing](#verification--testing)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Topics](#advanced-topics)

---

## Overview

The personalized banner system displays a custom banner to users who have been on the site for more than 30 seconds without clicking "Apply Now". The banner content is managed in Contentstack and can be personalized based on user segments.

### How It Works

- **Server-Side (Default)**: Banner content is fetched server-side when the page loads
- **Client-Side (Dynamic)**: Banner content is fetched client-side with real-time user context for advanced personalization

---

## Initial Setup

### Step 1: Create Content Type and Seed Banner

The content type is created automatically when you run the seed script:

```bash
node scripts/seed-personalized-banner.js
```

This script will:
1. ✅ Create the `personalized_banner` content type (if it doesn't exist)
2. ✅ Create a banner entry with default content
3. ✅ Create localized versions (if enabled)
4. ✅ Publish everything

### Content Type Fields

The `personalized_banner` content type includes:

- **title** (Text) - Internal title for the banner entry
- **banner_title** (Text) - The banner heading text
- **banner_message** (Text) - The banner message/description
- **cta_text** (Text) - Call-to-action button text (e.g., "Apply Now")
- **cta_link** (Link) - URL for the CTA button (object with `title` and `href`)
- **delay_seconds** (Number) - Time in seconds before showing the banner (default: 30)
- **enabled** (Boolean) - Whether this banner is active
- **user_segment** (Text) - User segment identifier (e.g., "users_not_applied_30s")
- **priority** (Number) - Priority order if multiple banners exist (lower = higher priority)

### Verify Banner Entry

After seeding, verify in Contentstack:
1. Go to **Content** → **`personalized_banner`**
2. Open your banner entry
3. Check:
   - ✅ `enabled` = `true`
   - ✅ `user_segment` = `"users_not_applied_30s"`
   - ✅ Status = **Published**

---

## Contentstack Personalize Configuration

### Step 1: Create an Audience (Segment)

1. **Navigate to Audiences**
   - In Contentstack Personalize dashboard, click **"Audiences"** in the top navigation

2. **Create New Audience**
   - Click **"+ New Audience"** button

3. **Configure Audience Details**
   - **Name**: `users_not_applied_30s`
   - **Description**: "Users who have been on site for 30+ seconds without clicking Apply Now"
   - Click **"Save"** or **"Create Audience"**

4. **Set Audience Rules** (Optional)
   - For basic setup, create audience without specific rules (filtering happens client-side)
   - For advanced setup, add conditions based on custom attributes

### Step 2: Create an Experience

1. **Navigate to Experiences**
   - Click **"Experiences"** in the top navigation

2. **Create New Experience**
   - Click **"+ New Experience"** button (purple button, top right)

3. **Configure Experience Details**
   - **Name**: `Personalized Banner - 30s No Apply`
   - **Description**: "Shows personalized banner to users who haven't clicked Apply Now after 30 seconds"
   - **Type**: Select **"Segmented"** (for audience-based personalization)
   - Click **"Next"** or **"Continue"**

4. **Select Audience**
   - Choose the audience: **`users_not_applied_30s`**
   - Click **"Next"**

5. **Review and Activate**
   - Review your experience configuration
   - Click **"Activate"** or **"Save"** to make it active
   - Status should change to **"Active"** (green dot)

### Step 3: Set Experience Priority

1. **Prioritize Experiences**
   - Click **"Prioritize Experiences"** button (top right)
   - Drag and drop experiences to set priority order
   - Higher priority experiences are evaluated first
   - Set your banner experience to priority 1 or 2

2. **Save Priority**
   - Click **"Save"** to apply

### Step 4: Configure Attributes (Optional)

1. **Navigate to Attributes**
   - Click **"Attributes"** in the top navigation

2. **Create Custom Attributes** (if needed)
   - Click **"+ New Attribute"**
   - **Attribute Name**: `time_on_site`
   - **Type**: `Number` or `Integer`
   - **Description**: "Time user has spent on site in seconds"
   - Click **"Save"**
   
   - Repeat for:
     - **Attribute Name**: `has_clicked_apply_now`
     - **Type**: `Boolean`
     - **Description**: "Whether user has clicked Apply Now button"

---

## Variant Configuration

### What is a Variant?

A **variant** is a version of content shown to a specific audience. You're creating a variant that shows the personalized banner to users who haven't clicked "Apply Now" after 30 seconds.

### Variant Configuration Fields

#### 1. Variant Name (Required)
**What to enter**: A descriptive name for this variant

**Examples**:
- `Banner for 30s No Apply`
- `Default Personalized Banner`
- `30 Second Banner Variant`

**Purpose**: Label to identify this variant in the dashboard (doesn't affect what users see)

#### 2. Condition
**Options**:
- **Match All**: Show when ALL selected audiences match
- **Match Any**: Show when ANY selected audiences match

**For your use case**: Keep **"Match All"** (default)

#### 3. Audiences
**What you have**: `users_not_applied_30s` (already selected ✅)

**What it means**: This variant will be shown to users who belong to this audience segment

### Complete Variant Setup

1. ✅ **Variant Name**: Enter `Banner for 30s No Apply`
2. ✅ **Condition**: Keep "Match All" (default)
3. ✅ **Audiences**: Already has `users_not_applied_30s` selected
4. ⏭️ **Click "Save" or "Next"** to proceed
5. ⏭️ **Assign Content** (if visible):
   - Select Content Type: `personalized_banner`
   - Select Entry: Your banner entry
6. ⏭️ **Activate Experience**: Make sure status is "Active"

### Finding Content Assignment

If you don't see the "Configure Content" step:

**Method 1**: Save variant first, then edit experience to assign content

**Method 2**: Check variant row for "Content" column or edit icon

**Method 3**: It may not be required - your code fetches content directly based on `user_segment` field

**Important**: Even if content assignment isn't visible, ensure:
- ✅ Banner entry has `user_segment` = `"users_not_applied_30s"`
- ✅ Banner entry is **published**
- ✅ Banner entry has `enabled` = `true`
- ✅ Experience is **Active**

### Multiple Variants (Advanced)

You can create multiple variants for different scenarios:

**Variant 1: Default Banner**
- Name: `Default Banner`
- Audiences: `users_not_applied_30s`
- Content: Default banner entry

**Variant 2: Returning User Banner**
- Name: `Returning User Banner`
- Audiences: `returning_visitors`
- Content: Different banner entry

**Variant 3: High Intent Banner**
- Name: `High Intent Banner`
- Audiences: `high_intent_users`
- Content: Different banner entry

**Priority Order**: Variants are evaluated top to bottom. First matching variant is used.

---

## Dynamic Personalization

### What is Dynamic Personalization?

Dynamic personalization allows the banner to fetch personalized content from Contentstack in real-time based on user behavior (time on site, clicks, etc.).

### Enable Dynamic Personalization

#### Step 1: Add Environment Variable

1. **Open your `.env` file** (or `.env.local`)

2. **Add this line**:
   ```env
   NEXT_PUBLIC_ENABLE_DYNAMIC_PERSONALIZATION=true
   ```

3. **Save the file**

#### Step 2: Restart Development Server

```bash
# Stop your current server (Ctrl+C)
# Then restart:
npm run dev
```

**Important**: Environment variables are loaded at startup, so restart is required.

### How It Works

When enabled, the component will:

1. **Track user behavior**:
   - Time on site (from session start)
   - Apply Now button clicks
   - Page views (if tracked)

2. **Fetch personalized content**:
   - Makes API call to `/api/personalized-banner`
   - Sends user context as query parameters
   - Contentstack returns personalized banner based on user segment

3. **Display appropriate banner**:
   - Shows banner matching user's current behavior
   - Updates if user behavior changes

### API Call Example

When dynamic personalization is enabled, you'll see API calls like:

```
GET /api/personalized-banner?timeOnSite=45&hasClickedApplyNow=false&userSegment=users_not_applied_30s
```

Response:
```json
{
  "success": true,
  "data": {
    "banner_title": "Still Exploring?",
    "banner_message": "Don't miss out...",
    "cta_text": "Apply Now",
    "cta_link": {
      "title": "Apply Now",
      "href": "/jobs"
    },
    "delay_seconds": 30,
    "enabled": true,
    "user_segment": "users_not_applied_30s"
  }
}
```

### Static vs Dynamic Comparison

| Feature | Static (Default) | Dynamic (Enabled) |
|---------|-----------------|-------------------|
| **Fetch Timing** | Server-side (page load) | Client-side (when banner shows) |
| **User Context** | Limited | Full (time, clicks, segments) |
| **Real-time Updates** | No | Yes |
| **Performance** | Faster initial load | Slightly slower (API call) |
| **Flexibility** | Lower | Higher |

### When to Use Dynamic Personalization

**Use Dynamic When**:
- ✅ You need real-time user behavior tracking
- ✅ You want to personalize based on current session data
- ✅ You have multiple user segments with different content
- ✅ You need to update content based on user actions

**Use Static When**:
- ✅ Simple personalization is enough
- ✅ Performance is critical
- ✅ Content doesn't change based on behavior
- ✅ You want faster initial page load

### Verification

**Method 1: Check Network Tab**
1. Open Browser DevTools (F12) → Network tab
2. Filter by: `personalized-banner`
3. Wait 30+ seconds on your site
4. You should see API call to `/api/personalized-banner`

**Method 2: Test API Directly**
Visit:
```
http://localhost:3000/api/personalized-banner?timeOnSite=45&hasClickedApplyNow=false&userSegment=users_not_applied_30s
```

Expected: JSON response with banner data

---

## Verification & Testing

### Pre-Verification Checklist

Before testing, ensure you have:

- ✅ Created the `personalized_banner` content type
- ✅ Created and published a banner entry
- ✅ Created an audience: `users_not_applied_30s`
- ✅ Created an experience with the audience
- ✅ Experience is **Active** (green dot)
- ✅ Banner entry has `user_segment` = `"users_not_applied_30s"`
- ✅ Banner entry has `enabled` = `true`
- ✅ Banner entry is **Published**

### Verification Method 1: Check Contentstack Setup

#### Step 1: Verify Banner Entry

1. **Go to Contentstack Content Manager**
   - Navigate to: **Content** → **`personalized_banner`**
   - Open your banner entry

2. **Check these fields**:
   ```
   ✅ title: "Personalized Banner"
   ✅ banner_title: "Still Exploring?"
   ✅ banner_message: "Don't miss out..."
   ✅ cta_text: "Apply Now"
   ✅ cta_link: { title: "Apply Now", href: "/jobs" }
   ✅ delay_seconds: 30
   ✅ enabled: true (checked)
   ✅ user_segment: "users_not_applied_30s"
   ✅ priority: 1
   ```

3. **Verify Publishing**:
   - Status should show **"Published"**
   - Check the environment matches your `.env` file

#### Step 2: Verify Experience

1. **Go to Contentstack Personalize** → **Experiences**
2. **Find your experience** in the list
3. **Check**:
   - ✅ Status: **"Active"** (green dot)
   - ✅ Type: **"Segmented"**
   - ✅ Has variant with audience: `users_not_applied_30s`

#### Step 3: Verify Audience

1. **Go to Contentstack Personalize** → **Audiences**
2. **Find**: `users_not_applied_30s`
3. **Verify it exists** and is properly configured

### Verification Method 2: Test on Your Website

#### Step 1: Clear Browser Data

1. **Open Browser DevTools** (F12)
2. **Go to Application tab** (Chrome) or **Storage tab** (Firefox)
3. **Clear Local Storage**:
   - Right-click → "Clear"
   - Or manually delete:
     - `session_start_time`
     - `apply_now_clicked`
     - `banner_dismissed_*`

4. **Refresh the page**

#### Step 2: Monitor the Page

1. **Open Browser DevTools** (F12)
2. **Go to Console tab** (to see any errors)
3. **Go to Network tab** (to see API calls)
4. **Filter by**: `personalized-banner` or `contentstack`

#### Step 3: Wait and Observe

1. **Visit your homepage** or any page
2. **Wait 30+ seconds** without clicking "Apply Now"
3. **Expected behavior**:
   - ✅ Banner should appear at the bottom of the page
   - ✅ Banner should show your Contentstack content
   - ✅ Banner should have your custom title and message

#### Step 4: Test Different Scenarios

**Scenario A: Banner Should Appear**
- ✅ Wait 30+ seconds
- ✅ Don't click "Apply Now"
- ✅ **Result**: Banner appears

**Scenario B: Banner Should NOT Appear**
- ✅ Click "Apply Now" before 30 seconds
- ✅ **Result**: Banner does NOT appear

**Scenario C: Banner Should NOT Appear (After Click)**
- ✅ Wait 30+ seconds (banner appears)
- ✅ Click "Apply Now"
- ✅ Refresh page
- ✅ Wait 30+ seconds again
- ✅ **Result**: Banner does NOT appear (because you clicked Apply Now)

### Verification Method 3: Check API Calls

#### Step 1: Check Server-Side Fetch

1. **Open Browser DevTools** → **Network tab**
2. **Filter by**: `Fetch/XHR`
3. **Look for**: Requests to your domain

#### Step 2: Check API Route (If Dynamic Personalization Enabled)

1. **If you have** `NEXT_PUBLIC_ENABLE_DYNAMIC_PERSONALIZATION=true`:
2. **Look for API calls** to: `/api/personalized-banner`
3. **Check the request**:
   ```
   GET /api/personalized-banner?timeOnSite=45&hasClickedApplyNow=false&userSegment=users_not_applied_30s
   ```
4. **Check the response**: Should return JSON with banner data

#### Step 3: Test API Route Directly

1. **Open browser** and go to:
   ```
   http://localhost:3000/api/personalized-banner?timeOnSite=45&hasClickedApplyNow=false&userSegment=users_not_applied_30s
   ```

2. **Expected response**: JSON with banner data

### Verification Method 4: Check Local Storage

1. **Open DevTools** → **Application** → **Local Storage**
2. **After 30+ seconds**, check for:
   ```
   session_start_time: "1234567890123" (timestamp)
   ```
3. **After clicking Apply Now**, check for:
   ```
   apply_now_clicked: "true"
   ```
4. **After dismissing banner**, check for:
   ```
   banner_dismissed_session: "true" (or banner_dismissed_permanent)
   ```

### Quick Verification Checklist

Run through this checklist:

- [ ] Banner entry exists and is published
- [ ] Banner entry has `enabled` = `true`
- [ ] Banner entry has `user_segment` = `"users_not_applied_30s"`
- [ ] Experience exists and is **Active**
- [ ] Experience has audience `users_not_applied_30s`
- [ ] Cleared browser localStorage
- [ ] Waited 30+ seconds without clicking Apply Now
- [ ] Banner appears with correct content
- [ ] Banner shows Contentstack data (not default props)
- [ ] Clicking Apply Now prevents banner from showing
- [ ] API route returns correct data (if dynamic personalization enabled)

### Automated Test Script

Run the test script to verify setup:

```bash
node scripts/test-personalization.js
```

This will:
- Check your configuration
- Fetch the banner from Contentstack
- Validate all required fields
- Show any issues

---

## Troubleshooting

### Banner Not Appearing

**Check**:
1. ✅ Banner entry is published
2. ✅ `enabled` field is `true`
3. ✅ Experience is Active
4. ✅ localStorage is cleared
5. ✅ Waited full 30 seconds
6. ✅ Didn't click Apply Now

**Debug**:
- Check browser console for errors
- Check Network tab for failed API calls
- Verify `session_start_time` in localStorage
- Check Experience status in Contentstack Personalize

### Banner Shows Default Content (Not from Contentstack)

**Check**:
1. ✅ Banner entry is published
2. ✅ API is returning Contentstack data
3. ✅ `contentstackData` prop is being passed to component

**Debug**:
- Check API response in Network tab
- Verify `getPersonalizedBanner()` is being called
- Check server-side fetch in `app/layout.tsx`

### Banner Appears Even After Clicking Apply Now

**Check**:
1. ✅ `apply_now_clicked` is set in localStorage
2. ✅ Event listener is working
3. ✅ Component is checking localStorage correctly

**Debug**:
- Check localStorage for `apply_now_clicked`
- Verify Apply Now buttons have `data-apply-now="true"`

### Personalization Not Working

**Check**:
1. ✅ Contentstack Personalization is enabled in your stack
2. ✅ Segments are properly configured
3. ✅ User context is being passed correctly
4. ✅ API route logs for errors

**Debug**:
- Verify API Key and Tokens in `.env`
- Check API route: `/api/personalized-banner`
- Verify experience priority settings
- Check Contentstack Personalization settings

### Dynamic Personalization Not Working

**Check**:
1. ✅ Environment variable is set: `NEXT_PUBLIC_ENABLE_DYNAMIC_PERSONALIZATION=true`
2. ✅ Server was restarted after adding variable
3. ✅ Variable is exactly `'true'` (string, lowercase)

**Debug**:
- Check Network tab for API calls
- Verify API route is accessible
- Check browser console for errors
- Test API route directly

### Content Not Updating

**Check**:
1. ✅ Entry is republished after changes
2. ✅ Correct environment is being used
3. ✅ Browser cache is cleared

**Debug**:
- Clear Contentstack cache (if using CDN)
- Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Verify environment matches `.env` file

### Variant Not Showing

**Check**:
1. ✅ Experience is **Active** (green dot)
2. ✅ Audience is correctly configured
3. ✅ Content is assigned to variant (if required)
4. ✅ Variant priority/order

**Debug**:
- Check variant configuration
- Verify audience selection
- Check experience status

### "Please enter a variant name" Error

**Solution**: Enter any descriptive name in the "Variant name" field
**Example**: `Banner for 30s No Apply`

---

## Advanced Topics

### Creating Multiple Banner Variations

You can create different banners for different audiences:

1. **Create Additional Banner Entries**
   - In Contentstack, create more `personalized_banner` entries
   - Each with different content (title, message, CTA)
   - Set different `user_segment` values

2. **Create Additional Audiences**
   - `returning_visitors` - Users who have visited before
   - `high_intent_users` - Users who viewed multiple job pages
   - `location_specific` - Users from specific regions

3. **Create Additional Experiences**
   - One experience per audience
   - Each targeting a different banner entry
   - Set appropriate priorities

### Custom User Attributes

You can extend personalization by adding custom attributes:

1. **Update API Route** (`app/api/personalized-banner/route.ts`):
   - Add new query parameters
   - Pass to `PersonalizationContext`

2. **Update Component** (`components/PersonalizedBanner.tsx`):
   - Track additional user data
   - Include in API call

3. **Update Contentstack**:
   - Create attributes in Personalize → Attributes
   - Use in audience rules

Example:
```typescript
// In component, add to API call:
const params = new URLSearchParams({
  timeOnSite: timeOnSite.toString(),
  hasClickedApplyNow: applyNowClicked.toString(),
  userSegment: "users_not_applied_30s",
  pageViews: pageViews.toString(), // Custom attribute
  userId: userId, // Custom attribute
});
```

### A/B Testing

1. **Create Multiple Banner Variations**
   - Create different banner entries with different content
   - Assign to different experiences or variants

2. **Use Contentstack's A/B Testing Features**
   - Set up experiments in Contentstack Personalize
   - Track conversion rates

3. **Monitor Performance**
   - Track which banners perform better
   - Optimize based on data

### API Endpoint Reference

The `/api/personalized-banner` endpoint accepts:

**Query Parameters**:
- `timeOnSite` - Time in seconds user has been on site
- `hasClickedApplyNow` - Boolean indicating if user clicked Apply Now
- `userSegment` - User segment identifier (e.g., "users_not_applied_30s")
- `userId` - Optional user ID
- `userEmail` - Optional user email
- `pageViews` - Optional number of pages viewed
- `locale` - Optional locale code

**Example**:
```
GET /api/personalized-banner?timeOnSite=45&hasClickedApplyNow=false&userSegment=users_not_applied_30s
```

**Response**:
```json
{
  "success": true,
  "data": {
    "banner_title": "Still Exploring?",
    "banner_message": "Don't miss out...",
    "cta_text": "Apply Now",
    "cta_link": {
      "title": "Apply Now",
      "href": "/jobs"
    },
    "delay_seconds": 30,
    "enabled": true,
    "user_segment": "users_not_applied_30s"
  }
}
```

### Environment Variables Reference

**Required Variables**:
```env
NEXT_PUBLIC_CONTENTSTACK_API_KEY=your_api_key
NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token
NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT=your_environment
NEXT_PUBLIC_CONTENTSTACK_REGION=us
```

**Optional (Dynamic Personalization)**:
```env
NEXT_PUBLIC_ENABLE_DYNAMIC_PERSONALIZATION=true
```

### Key Terms Reference

- **Experience**: A personalized content variation (your banner)
- **Audience/Segment**: A group of users with similar characteristics
- **Variant**: A version of content shown to a specific audience
- **Priority**: Order in which experiences are evaluated (higher = first)
- **Status**: Active (live) vs Draft (not live)

### Contentstack Personalize Navigation

- **Experiences**: Where you create and manage personalized content experiences
- **Audiences**: Where you define user segments/audiences
- **Attributes**: Custom user properties for targeting
- **Events**: User actions/events for tracking
- **Settings**: Configuration and preferences

---

## Success Indicators

Your setup is working if:

✅ **Banner appears** after 30 seconds
✅ **Banner shows Contentstack content** (title, message from CMS)
✅ **Banner doesn't appear** if you clicked Apply Now
✅ **Banner can be dismissed** and doesn't reappear
✅ **API returns correct data** (if dynamic personalization enabled)
✅ **No console errors**
✅ **LocalStorage tracking works** correctly

---

## Next Steps

After setup:

1. ✅ **Monitor performance** - Check if banner is appearing for users
2. ✅ **Test different audiences** - Create more segments if needed
3. ✅ **A/B test variations** - Create multiple banner entries
4. ✅ **Track conversions** - Monitor Apply Now clicks from banner
5. ✅ **Optimize timing** - Adjust `delay_seconds` if needed

---

## Support & Resources

**Code Files**:
- `components/PersonalizedBanner.tsx` - Banner component
- `app/api/personalized-banner/route.ts` - API route
- `lib/contentstack.ts` - Contentstack integration
- `scripts/seed-personalized-banner.js` - Seed script
- `scripts/test-personalization.js` - Test script

**Documentation**:
- Contentstack Personalization documentation
- Contentstack API documentation

**For Issues**:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Check Network tab for failed requests
4. Verify all checklist items are completed
5. Share specific error messages for targeted help

