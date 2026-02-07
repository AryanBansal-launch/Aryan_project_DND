# Contentstack Personalize Setup for Job Portal

This folder contains setup scripts for configuring Contentstack Personalize in the Job Portal application. These scripts automate the creation of attributes, audiences, experiences, and content variants for personalized banner experiences.

## 📁 Folder Structure

```
personlize-setup-full/
├── scripts/
│   ├── cma.ts                          # Content Management API helper
│   ├── personalize-management.ts       # Personalize Management API helper
│   ├── setup-content.ts                # Creates sample personalized banner entries
│   ├── setup-personalize.ts           # Sets up entry variants
│   └── setup-personalize-management.ts # Creates attributes, audiences, and experiences
└── README.md                           # This file
```

## 🎯 What This Setup Does

This setup configures Contentstack Personalize for the Job Portal use case, specifically for personalized banners that change based on user behavior:

### Attributes Created
- `first_time_user` (BOOLEAN) - Whether this is the user's first visit
- `ready_to_apply` (BOOLEAN) - User has viewed 3+ jobs but hasn't applied
- `tech_job_seeker` (BOOLEAN) - User is interested in Engineering/Technology jobs
- `returning_user` (BOOLEAN) - User has visited the site more than once
- `engagement_level` (STRING) - User engagement level: low, medium, or high

### Audiences Created
- **First Time Users** - Users where `first_time_user` equals `true`
- **Ready to Apply** - Users where `ready_to_apply` equals `true`
- **Tech Job Seekers** - Users where `tech_job_seeker` equals `true`
- **Returning Users** - Users where `returning_user` equals `true`

### Experiences Created
- **Job Portal Personalized Banners** - Segmented experience with variants for each audience

### Banner Variants
1. **Default Welcome Banner** - Shown to all users by default
2. **First Time User Banner** - Welcome message for new visitors
3. **Ready to Apply Banner** - Encourages users who've viewed jobs to apply
4. **Tech Job Seeker Banner** - Highlights Engineering jobs for tech-interested users
5. **Returning User Banner** - Welcomes back returning visitors

## 🚀 Getting Started

### Prerequisites

1. **Contentstack Account** with a stack configured
2. **Personalize Project** created in Contentstack
3. **Management Token** for Contentstack CMS
4. **Personalize Auth Token** for Personalize Management API

### Step 1: Install Dependencies

Install the required dependencies for running the setup scripts:

```bash
# From the project root (Aryan_project_DND)
npm install -D tsx @contentstack/management
```

Or if you prefer to install globally:

```bash
npm install -g tsx
```

**Note:** The scripts use `@contentstack/management` for Contentstack Management API operations. Make sure it's installed before running the scripts.

### Step 2: Configure Environment Variables

Add these to your `.env.local` file (or `.env`):

```env
# Contentstack CMS (Required)
NEXT_PUBLIC_CONTENTSTACK_API_KEY=your-api-key
NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN=your-delivery-token
NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT=development
NEXT_PUBLIC_CONTENTSTACK_REGION=us
NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN=your-management-token

# Contentstack Personalize (Required)
NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID=your-project-uid
NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_AUTHTOKEN=your-authtoken
```

**Where to find these values:**
- **API Key & Delivery Token**: Contentstack Dashboard → Settings → Stack → API Key
- **Management Token**: Contentstack Dashboard → Settings → Stack → Tokens → Management Token
- **Personalize Project UID**: Contentstack Dashboard → Personalize → Your Project → Settings → General → Project Details
- **Personalize Auth Token**: Contentstack Dashboard → Personalize → Your Project → Settings → API Keys

### Step 3: Run Setup Scripts

Run the scripts in order:

#### 1. Create Sample Banner Entries

```bash
# From the project root (Aryan_project_DND)
tsx personlize-setup-full/scripts/setup-content.ts
```

This creates sample `personalized_banner` entries in Contentstack. **Note:** The `personalized_banner` content type must already exist. If it doesn't, run the existing `scripts/seed-personalized-banner.js` script first.

#### 2. (Optional) Set Up Entry Variants

```bash
# From the project root (Aryan_project_DND)
tsx personlize-setup-full/scripts/setup-personalize.ts
```

This script displays variant configuration information. To actually create variants via API, set:

```env
CONTENTSTACK_CREATE_ENTRY_VARIANTS=true
CONTENTSTACK_PUBLISH_ENTRY_VARIANTS=true
```

**Note:** Variants can also be created automatically when you create experiences in the Personalize Dashboard.

#### 3. Create Attributes, Audiences, and Experiences

```bash
# From the project root (Aryan_project_DND)
tsx personlize-setup-full/scripts/setup-personalize-management.ts
```

This script automates the creation of:
- Attributes (first_time_user, ready_to_apply, etc.)
- Audiences (First Time Users, Ready to Apply, etc.)
- Segmented Experience with variants
- Activates the experience version

## 📝 Script Details

### `setup-content.ts`

Creates sample personalized banner entries in Contentstack:
- Default Welcome Banner
- First Time User Banner
- Ready to Apply Banner
- Tech Job Seeker Banner
- Returning User Banner

**Requirements:**
- `personalized_banner` content type must exist
- Management Token must have write permissions

### `setup-personalize.ts`

Displays variant configuration information and optionally creates entry variants via CMA.

**Features:**
- Fetches existing banner entries
- Shows variant configurations for each user segment
- Can create variants programmatically (if `CONTENTSTACK_CREATE_ENTRY_VARIANTS=true`)

### `setup-personalize-management.ts`

Automates the complete Personalize setup:
- Creates attributes for user behavior tracking
- Creates audiences based on attribute conditions
- Creates a segmented experience
- Creates and activates a version with variants

**Requirements:**
- Personalize Project UID
- Personalize Auth Token
- Base entry UID (optional - script will auto-detect)

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID` | Personalize Project UID | Yes |
| `NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_AUTHTOKEN` | Personalize Auth Token | Yes |
| `CONTENTSTACK_CREATE_ENTRY_VARIANTS` | Create variants via API | No |
| `CONTENTSTACK_PUBLISH_ENTRY_VARIANTS` | Publish variants after creation | No |
| `CONTENTSTACK_PERSONALIZE_BASE_ENTRY_UID` | Base entry UID for variants | No |
| `CONTENTSTACK_PERSONALIZE_CONTENT_TYPE_UID` | Content type UID (default: `personalized_banner`) | No |
| `CONTENTSTACK_PERSONALIZE_MANAGEMENT_BASE_URL` | Override API base URL | No |
| `CONTENTSTACK_PERSONALIZE_MANAGEMENT_API_PREFIX` | Override API prefix (default: `/v1`) | No |

## 🎨 How It Works

1. **User Behavior Tracking**: The Job Portal tracks user behavior (job views, session count, etc.) using the `BehaviorTracker` component and `behavior-tracking.ts` library.

2. **Attribute Setting**: User attributes are set in the `PersonalizedBanner` component using the Personalize Edge SDK:
   ```typescript
   await setPersonalizeAttributes({
     first_time_user: behavior.sessionCount === 1,
     ready_to_apply: behavior.totalJobViews >= 3 && behavior.appliedJobs.length === 0,
     tech_job_seeker: behavior.interestedCategories.includes("Engineering"),
     returning_user: behavior.sessionCount > 1,
     engagement_level: behavior.totalJobViews > 20 ? 'high' : 'medium'
   });
   ```

3. **Experience Matching**: Contentstack Personalize matches users to audiences based on their attributes.

4. **Variant Delivery**: The appropriate banner variant is delivered based on the matched audience.

5. **Content Display**: The `PersonalizedBanner` component displays the personalized content.

## 🐛 Troubleshooting

### Script Fails with "Content type does not exist"

**Solution:** Run `scripts/seed-personalized-banner.js` first to create the content type, or create it manually in Contentstack Dashboard.

### Script Fails with "Personalize Auth Token invalid"

**Solution:** 
- Verify the token in Contentstack Dashboard → Personalize → Your Project → Settings → API Keys
- Make sure the token has permission to manage attributes, audiences, and experiences

### Variants Not Showing in Personalize Dashboard

**Solution:**
- Variants are created when you create experiences in the Personalize Dashboard
- Or set `CONTENTSTACK_CREATE_ENTRY_VARIANTS=true` to create them via API
- Make sure the experience version is activated

### Personalize Management API Errors

**Solution:**
- Check if your tenant uses a different API host/prefix
- Set `CONTENTSTACK_PERSONALIZE_MANAGEMENT_BASE_URL` and `CONTENTSTACK_PERSONALIZE_MANAGEMENT_API_PREFIX`
- Verify the API endpoint structure matches your tenant's configuration

## 📚 Additional Resources

- [Contentstack Personalize Documentation](https://www.contentstack.com/docs/personalize)
- [Personalize Management API Reference](https://www.contentstack.com/docs/developers/apis/personalize-management-api)
- [Personalize Edge SDK Reference](https://www.contentstack.com/docs/developers/sdks/personalize-edge-sdk/javascript/reference)

## ✅ Next Steps

After running the setup scripts:

1. **Verify in Dashboard**: Check Contentstack Dashboard → Personalize → Your Project to see created attributes, audiences, and experiences

2. **Test Personalization**: 
   - Set user attributes in your app
   - Verify the correct banner variant is shown
   - Check browser console for Personalize SDK logs

3. **Customize Content**: Edit banner content in Contentstack Dashboard to match your brand

4. **Add More Segments**: Create additional audiences and variants for other user segments

5. **Monitor Performance**: Use Personalize analytics to see which variants perform best

---

**Note:** This setup is specifically tailored for the Job Portal use case. Modify the scripts as needed for other personalization scenarios.

