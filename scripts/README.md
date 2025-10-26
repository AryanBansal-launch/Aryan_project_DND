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

### Step 2: Run the Scripts

```bash
# Seed 20 companies
node scripts/seed-companies.js

# Seed 20 jobs
node scripts/seed-jobs.js
```

## 📊 What Happens?

The scripts will:
1. ✅ Create each entry
2. 📤 Publish each entry automatically
3. 📈 Show progress for each entry
4. ✨ Display final success/failure counts

**Example Output:**
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

## ⚠️ Important Notes

1. **Field Names Must Match**: The JSON field names must match your content type structure exactly
2. **Rate Limiting**: Scripts include 500ms delay between requests to avoid rate limits
3. **Region**: If you're not in US region, update the `REGION` config
4. **Never Commit Tokens**: Don't commit your Management Token to git!

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

## 🎯 Using with Postman (Alternative)

If you prefer Postman, see the parent README for individual API request examples.

## 📝 Customizing Data

Edit the `companies` or `jobs` arrays in the scripts to customize the entries:

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

## 🔐 Security

**NEVER** expose your Management Token in:
- Client-side code
- Git repositories
- Public environments
- Browser console

Management Tokens have full write access to your Contentstack content!

