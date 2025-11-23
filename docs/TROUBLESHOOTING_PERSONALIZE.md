# Troubleshooting Contentstack Personalize SDK

## Issue: No Active Variants Found

### ✅ Your Setup Looks Good!

Based on your Contentstack configuration:
- ✅ Attributes are defined: `time_on_site`, `has_clicked_apply_now`
- ✅ Audience rules are correct: `time_on_site > 30` AND `has_clicked_apply_now = false`
- ✅ Variant exists: "Test_banner" linked to "users_not_applied_30s" audience
- ✅ Experience is active

### ⚠️ Missing Step: Link Content to Variant

The most common issue is that **content entries are not linked to variants**. Here's how to fix it:

#### Step 1: Link Banner Entry to Variant

1. Go to your Experience: **"Personalized Banner - 30s No Apply"**
2. Click on the **"Test_banner"** variant
3. In the variant configuration, look for **"Content"** or **"Assign Content"** section
4. Click **"Assign Content"** or **"Link Content"**
5. Select your **"Personalized Banner"** entry (the one you created)
6. Save the variant

#### Step 2: Verify Content Assignment

After linking, you should see:
- The banner entry listed under the variant
- Content fields visible in the variant (banner_title, banner_message, etc.)

#### Step 3: Publish the Experience

Make sure the experience is **published/active** after linking content.

### Alternative: Check Variant Content Configuration

If you don't see a "Link Content" option, the variant might need content configured differently:

1. In the variant configuration, look for a **"Content"** tab or section
2. You might need to:
   - Select the content type: `personalized_banner`
   - Select the specific entry
   - Or configure content fields directly in the variant

## Issue: No Active Variants Found (Original)

### Symptoms
- ✅ SDK initializes successfully
- ✅ Experiences are found (e.g., 3 experiences)
- ❌ All experiences have `activeVariantShortUid: null`
- ❌ No personalized content is returned

### Root Cause
The user attributes being sent don't match the audience rules configured in Contentstack Personalize.

### Solution Steps

#### 1. Check What Attributes Are Being Sent

Look in the browser console for:
```
✅ Contentstack Personalize: User attributes set
```

This will show you exactly what attributes are being sent, for example:
- `time_on_site: 45 (number)`
- `has_clicked_apply_now: false (boolean)`
- `user_segment: "users_not_applied_30s" (string)`

#### 2. Verify Audience Rules in Contentstack

In your Contentstack Personalize dashboard:

1. **Go to your Experience**
2. **Check the Audience rules** - They should match the attributes being sent:
   - Attribute name must match exactly (case-sensitive)
   - Attribute type must match (string, number, boolean)
   - Attribute values must match the conditions

3. **Common Issues:**
   - **Attribute name mismatch**: Code sends `time_on_site` but audience expects `timeOnSite`
   - **Type mismatch**: Code sends number but audience expects string
   - **Value mismatch**: Code sends `"users_not_applied_30s"` but audience expects different value

#### 3. Set Up Default Variant

If no audience matches, you can set a default variant:

1. In your Experience, go to **Variants**
2. Set one variant as the **Default Variant**
3. This variant will be used when no audience rules match

#### 4. Test with Matching Attributes

To test, temporarily set attributes that match your audience:

```javascript
// In browser console, after SDK is initialized:
await Personalize.setAttributes({
  time_on_site: 45,
  has_clicked_apply_now: false,
  user_segment: "users_not_applied_30s"
});
```

Then check if variants become active.

### Example Audience Rules

If your code sends:
```javascript
{
  time_on_site: 45,
  has_clicked_apply_now: false,
  user_segment: "users_not_applied_30s"
}
```

Your audience rules in Contentstack should be:
- **Attribute**: `time_on_site`
- **Condition**: `>= 30` (number)
- **AND**
- **Attribute**: `has_clicked_apply_now`
- **Condition**: `== false` (boolean)
- **AND**
- **Attribute**: `user_segment`
- **Condition**: `== "users_not_applied_30s"` (string)

### Debugging Checklist

- [ ] Check console logs for attributes being sent
- [ ] Verify attribute names match exactly (case-sensitive)
- [ ] Verify attribute types match (string/number/boolean)
- [ ] Verify attribute values match audience conditions
- [ ] Check if default variant is set
- [ ] Verify experience is published/active
- [ ] Check if content is linked to variant
- [ ] Test with attributes that definitely match an audience

### Quick Fix

If you want to test quickly, create a simple audience rule:

1. **Attribute**: `user_segment`
2. **Condition**: `exists` (or `!= null`)

This will match any user with a `user_segment` attribute, allowing you to test the flow.

### Still Not Working?

1. **Check Contentstack Personalize documentation** for attribute requirements
2. **Verify SDK version** - Make sure you're using a compatible version
3. **Check Contentstack support** - They can help verify your setup

