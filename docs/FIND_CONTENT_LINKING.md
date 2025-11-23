# Finding Content Linking in Contentstack Personalize

## The Issue

You can create variants with names, but don't see where to link content entries.

## Where Content Linking Usually Is

Content linking in Contentstack Personalize is typically done at the **Experience level**, not the variant level. Here's where to look:

### Location 1: Experience Overview Tab

1. Go to your Experience: **"Personalized Banner - 30s No Apply"**
2. Click **"Overview"** tab (the 'i' icon)
3. Look for:
   - **"Content Type"** field
   - **"Content Assignment"** section
   - **"Linked Content"** section
   - A dropdown or button to select content

### Location 2: Experience Settings/Configuration

1. In your Experience, look for:
   - **"Settings"** tab
   - **"Content"** tab
   - A gear/settings icon
   - An "Edit" button on the experience

2. These sections usually have:
   - Content type selection
   - Entry selection
   - Content configuration options

### Location 3: When Creating Experience

If you're creating a new experience:
1. During creation, there's usually a step to:
   - Select **Content Type**
   - Or **"What content do you want to personalize?"**
2. Select `personalized_banner` here

### Location 4: Experience Header/Actions

1. Look at the top of your experience page
2. Check for:
   - **"Edit"** button
   - **"Configure"** button
   - **"Content"** button in the header
   - A dropdown menu (three dots)

### Location 5: Right Sidebar

1. Check the right sidebar in your experience
2. Look for:
   - **"Content"** icon
   - **"Settings"** icon
   - **"Configuration"** icon
   - Any icon that might relate to content

## What to Look For

When you find the content linking section, you should see:

- **Content Type dropdown**: Select `personalized_banner`
- **Entry selector**: Choose your "Personalized Banner" entry
- **"Link Content"** or **"Assign Content"** button
- **Content fields**: Direct fields to fill in

## If You Still Can't Find It

### Option 1: Check Contentstack Documentation
- Search for "link content to experience" in Contentstack docs
- Look for your specific Contentstack version

### Option 2: Content Might Be Configured Differently
Some Contentstack Personalize setups work differently:
- Content might be configured per variant (not experience)
- Content might need to be set up when creating the experience
- Content might be linked through a different interface

### Option 3: Contact Contentstack Support
- They can guide you to the exact location in your setup
- They can verify if content linking is available in your plan

## Alternative: Configure Content in Variants

If you can't find content linking, some setups allow configuring content directly in variants:

1. **Edit the Variant**
   - Click on "Test_banner" variant
   - Look for content fields or a "Content" section

2. **Fill in Content Fields**
   - You might see fields like:
     - `banner_title`
     - `banner_message`
     - `cta_text`
     - `cta_link`
   - Fill these in directly

3. **Save the Variant**

## Quick Test

To verify if content is linked:
1. Refresh your website
2. Check browser console
3. Look for: `✅ PersonalizedBanner: Using personalized content from Contentstack Personalize!`
4. If you see this, content is linked correctly!

## Next Steps

1. Check the **Overview** tab of your experience first
2. Look for any **"Content"** related sections
3. Check if there's an **"Edit"** button on the experience
4. If still stuck, check Contentstack documentation or support

