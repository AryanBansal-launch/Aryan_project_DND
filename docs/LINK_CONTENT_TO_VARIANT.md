# How to Link Content to Variants in Contentstack Personalize

## Quick Guide

Your Contentstack Personalize setup is correct, but you need to **link your banner entry to the experience/variant**.

## Important: Content Linking Location

In Contentstack Personalize, content is typically linked at the **Experience level**, not the variant level. The variant just defines which audience gets which content.

## Step-by-Step Instructions

### Method 1: Through Experience Configuration (Most Common)

1. **Go to your Experience**
   - Navigate to: **Experiences** → **"Personalized Banner - 30s No Apply"**

2. **Check the "Overview" Tab**
   - Click on **"Overview"** tab (not Configuration)
   - Look for a section like:
     - **"Content Assignment"**
     - **"Content Type"**
     - **"Linked Content"**
     - **"Content Configuration"**

3. **Link Content Type**
   - You should see an option to select a **Content Type**
   - Select: `personalized_banner`
   - Or select the specific entry: **"Personalized Banner"**

4. **Alternative: Check Experience Settings**
   - Look for a **"Settings"** or **"Content"** section in the experience
   - This is usually in the Overview or a separate tab

### Method 2: When Creating/Editing Experience

1. **Edit the Experience**
   - Go to **"Personalized Banner - 30s No Apply"**
   - Click **Edit** or the experience name

2. **Look for Content Selection**
   - When editing, you might see:
     - **"Content Type"** dropdown
     - **"Select Content"** button
     - **"Assign Entry"** option
   - This is usually near the top or in a sidebar

3. **Select Your Banner Entry**
   - Choose content type: `personalized_banner`
   - Select entry: **"Personalized Banner"**
   - Save

### Method 3: Through Variant Configuration (If Available)

1. **Go to Variant**
   - In **Configuration** tab, click on **"Test_banner"** variant

2. **Check for Content Fields**
   - Some setups show content fields directly in the variant
   - You might see fields like `banner_title`, `banner_message`, etc.
   - Fill these in or they might auto-populate from the linked entry

### Method 2: Through Content Entry

1. **Go to your Banner Entry**
   - Navigate to: **Entries** → **"Personalized Banner"**

2. **Check Personalization Tab**
   - Look for a **"Personalization"** or **"Targeting"** tab/section
   - This might be in the right sidebar (target icon)

3. **Link to Experience**
   - Select your experience: **"Personalized Banner - 30s No Apply"**
   - Select the variant: **"Test_banner"**
   - Save

### Method 3: Direct Variant Content Configuration

Some Contentstack setups allow configuring content directly in variants:

1. **Edit Variant**
   - In your experience, click on **"Test_banner"** variant
   - Look for **"Content Configuration"** or **"Content Fields"**

2. **Configure Fields**
   - You might see fields like: `banner_title`, `banner_message`, `cta_text`, etc.
   - Fill these in or link to your entry
   - Save

## Verification Checklist

After linking content, verify:

- [ ] Banner entry is listed under the variant
- [ ] Experience is published/active
- [ ] Variant has content assigned
- [ ] Content fields are populated
- [ ] Experience version is active

## Testing

After linking content:

1. **Refresh your website**
2. **Check browser console** - You should see:
   ```
   ✅ PersonalizedBanner: Using personalized content from Contentstack Personalize!
   ```
3. **Verify banner appears** with content from the variant

## Common Issues

### "Content not found"
- Make sure the banner entry is **published**
- Check that you selected the correct entry

### "Variant has no content"
- Verify content is actually assigned to the variant
- Check if content fields are empty

### "Experience not active"
- Publish the experience after linking content
- Check experience version is active

## Still Not Working?

1. **Check Contentstack Documentation** for your specific version
2. **Contact Contentstack Support** - They can verify your setup
3. **Check Console Logs** - Look for detailed error messages

## Next Steps

Once content is linked:
- The SDK will automatically fetch the personalized content
- The banner will display content from the matching variant
- You'll see success logs in the console

