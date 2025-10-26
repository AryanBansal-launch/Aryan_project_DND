# Contentstack Seeding Scripts

These scripts automatically create and publish entries in your Contentstack CMS.

## 📋 Prerequisites

1. **Get your Management Token** from Contentstack:
   - Go to https://app.contentstack.com
   - Navigate to **Settings** → **Tokens**
   - Click **+ New Token** → Select **Management Token**
   - Name: `Management Token for Entries`
   - Permissions: Check **Content Types** and **Entries** (Read & Write)
   - **Copy the token** - you won't see it again!

2. **Get your API Key**:
   - Go to **Settings** → **Stack** → **Settings**
   - Copy your **API Key**

3. **Know your Environment name**:
   - Usually `development` or `production`
   - Found under **Settings** → **Environments**

## 🚀 How to Run

### Step 1: Configure the Scripts

Edit the `CONFIG` object at the top of each script:

**For Companies (`seed-companies.js`):**
```javascript
const CONFIG = {
  API_KEY: 'bltxxxxxxxxxx',              // Your Contentstack API Key
  MANAGEMENT_TOKEN: 'csxxxxxxxxxx',      // Your Management Token
  ENVIRONMENT: 'development',            // Your environment name
  REGION: 'us',                          // Your region (us, eu, azure-na)
  CONTENT_TYPE_UID: 'company'            // Your company content type UID
};
```

**For Jobs (`seed-jobs.js`):**
```javascript
const CONFIG = {
  API_KEY: 'bltxxxxxxxxxx',              // Your Contentstack API Key
  MANAGEMENT_TOKEN: 'csxxxxxxxxxx',      // Your Management Token
  ENVIRONMENT: 'development',            // Your environment name
  REGION: 'us',                          // Your region (us, eu, azure-na)
  CONTENT_TYPE_UID: 'job'                // Your job content type UID
};
```

**For Blog Posts (`seed-blogs.js`):**
```javascript
const CONFIG = {
  API_KEY: 'bltxxxxxxxxxx',              // Your Contentstack API Key
  MANAGEMENT_TOKEN: 'csxxxxxxxxxx',      // Your Management Token
  ENVIRONMENT: 'development',            // Your environment name
  REGION: 'us',                          // Your region (us, eu, azure-na)
  CONTENT_TYPE_UID: 'blog_post',         // Your blog_post content type UID
  
  // Localization settings (for blog posts)
  ENABLE_LOCALIZATION: true,             // Set to false to only create base locale
  BASE_LOCALE: 'en-us',                  // Your base locale
  LOCALES: ['hi-in']                     // Additional locales to create
};
```

### Step 2: Run the Scripts

```bash
# Seed 20 companies
node scripts/seed-companies.js

# Seed 20 jobs
node scripts/seed-jobs.js

# Seed 20 blog posts
node scripts/seed-blogs.js
```

## 📊 What Happens?

The scripts will:
1. ✅ Create each entry
2. 📤 Publish each entry automatically
3. 📈 Show progress for each entry
4. ✨ Display final success/failure counts
5. 🌍 Create localized versions (blog posts only, if enabled)

**Example Output (Companies/Jobs):**
```
🚀 Starting to seed companies...

[1/20] Creating: TechCorp Inc...
✅ Created successfully (UID: bltabc123)
📤 Published successfully

[2/20] Creating: DataSystems LLC...
✅ Created successfully (UID: bltdef456)
📤 Published successfully

...

==================================================
🎉 Seeding complete!
✅ Success: 20
❌ Failed: 0
==================================================
```

**Example Output (Blog Posts with Localization):**
```
🚀 Starting to seed blog posts...

🌍 Localization enabled for: en-us, hi-in

[1/20] Creating: 10 Essential Tips for Landing Your Dream Tech Job...
  ✅ Created in en-us (UID: bltabc123)
  🌍 Created in hi-in
  📤 Published in en-us, hi-in

[2/20] Creating: The Rise of AI in Modern Software Development...
  ✅ Created in en-us (UID: bltdef456)
  🌍 Created in hi-in
  📤 Published in en-us, hi-in

...

==================================================
🎉 Seeding complete!
✅ Base entries created: 20
❌ Failed: 0
🌍 Localized versions created: 20
==================================================
```

## ⚠️ Important Notes

1. **Field Names Must Match**: The JSON field names must match your content type structure exactly
2. **Rate Limiting**: Scripts include 500ms delay between requests to avoid rate limits
3. **Region**: If you're not in US region, update the `REGION` config
4. **Never Commit Tokens**: Don't commit your Management Token to git!
5. **Localization** (Blog Posts):
   - Set `ENABLE_LOCALIZATION: false` to only create entries in base locale
   - Ensure your Contentstack stack has the locales configured before running
   - Locales must match your Contentstack locale codes exactly (e.g., 'en-us', 'hi-in')
   - **Non-localizable fields**: `featured_image` and `published_date` are shared across all locales (they won't be duplicated in localized versions)
   - **Enum/Dropdown fields**: `category` values must remain in English (as defined in content type) across all locales

## 🐛 Troubleshooting

### Error: "Failed to create entry: 401"
- Your Management Token is invalid or missing
- Make sure you copied the token correctly

### Error: "Failed to create entry: 422"
- Field names don't match your content type
- Check your content type structure in Contentstack
- Update the JSON structure in the script

### Error: "Failed to publish entry"
- Check if the environment name is correct
- Ensure your Management Token has publish permissions

### Error: "is not a valid enum value for [field]"
- This happens when trying to use translated values for dropdown/enum fields
- Enum fields (like `category`) must use the exact predefined values from the content type
- The script keeps enum values in English across all locales
- Check that your content type's enum values match what's in the script

## 🎯 Using with Postman (Alternative)

If you prefer Postman, see the parent README for individual API request examples.

## 📝 Customizing Data

Edit the `companies`, `jobs`, or `blogPosts` arrays in the scripts to customize the entries:

**For Companies:**
```javascript
const companies = [
  {
    title: "Your Company",
    name: "Your Company",
    description: "Your description",
    // ... more fields
  },
  // Add more companies
];
```

**For Blog Posts:**
```javascript
const blogPosts = [
  {
    title: "Your Blog Post Title",
    slug: "your-blog-post-slug",
    excerpt: "A short excerpt",
    content: "<h2>Your content</h2><p>With HTML formatting</p>",
    author: "Author Name",
    category: "Career Tips", // or Industry News, Company Updates, General
    published_date: new Date().toISOString(),
    reading_time: 5
  },
  // Add more blog posts
];
```

## 🌍 Localization (Blog Posts)

The blog seeding script supports creating localized versions of each blog post automatically!

### How it Works

1. **Base Entry**: Creates the entry in your base locale (default: `en-us`)
2. **Localized Versions**: Automatically creates versions in additional locales
3. **Publishing**: Publishes all locales together in a single API call (required by Contentstack)
4. **Smart Translation**:
   - Uses pre-defined translations for specific blog posts (in `localizedContent`)
   - Falls back to locale prefixes for posts without explicit translations
   - Translates author names automatically
   - Keeps category values in English (required for enum/dropdown fields)
5. **Non-localizable Fields**: 
   - `featured_image` and `published_date` are marked as non-localizable in the content type
   - These fields remain the same across all locales (not duplicated in translations)
   - Only localizable fields (`title`, `slug`, `excerpt`, `content`, `author`, `reading_time`) are translated
6. **Enum/Dropdown Fields**:
   - `category` is a dropdown with predefined values, so it uses the original English enum values even in localized versions
   - Enum values cannot be translated - they must match the exact values defined in the content type schema

### Customizing Translations

Edit the `localizedContent` object in `seed-blogs.js` to add full translations:

```javascript
const localizedContent = {
  'hi-in': {
    'Your Blog Title': {
      title: 'आपका ब्लॉग शीर्षक',
      excerpt: 'एक संक्षिप्त सारांश',
      content: '<h2>आपकी सामग्री</h2><p>HTML फ़ॉर्मेटिंग के साथ</p>'
    }
  },
  // Add more locales as needed
  'es-es': {
    'Your Blog Title': {
      title: 'Tu Título del Blog',
      excerpt: 'Un resumen breve',
      content: '<h2>Tu contenido</h2><p>Con formato HTML</p>'
    }
  }
};
```

### Adding New Locales

1. Add the locale to your Contentstack stack
2. Update `CONFIG.LOCALES` in the script
3. (Optional) Add translations to `translations` and `localizedContent` objects
4. Run the script!

## 🔐 Security

**NEVER** expose your Management Token in:
- Client-side code
- Git repositories
- Public environments
- Browser console

Management Tokens have full write access to your Contentstack content!

