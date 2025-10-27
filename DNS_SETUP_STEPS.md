# Step-by-Step DNS Setup for devichand.com

## Current Situation in Your DNS Panel

You currently have:
- ✅ MX record: @ → smtp.google.com (Keep this for email!)
- ⚠️ CNAME record: www → connect.hostinger.com (OLD - needs to be changed!)

You're trying to add a new www CNAME, but it's conflicting with the existing one.

## Step-by-Step Instructions

### Step 1: Delete OLD CNAME Record

**DO THIS FIRST:**

1. Find the existing CNAME record in your table:
   ```
   Type: CNAME
   Name: www
   Content: connect.hostinger.com
   ```

2. Click the red **"Delete"** button next to it
3. Confirm deletion

**Why?** You can't have two CNAME records with the same name. We need to remove the old one pointing to Hostinger.

### Step 2: Add NEW www CNAME (for GitHub Pages)

After deleting the old one:

1. **Type:** CNAME (already selected)
2. **Name:** `www`
3. **Target:** `devichand579.github.io` ← Fill this in!
4. **TTL:** 14400 (or leave default)
5. Click **"Add Record"**

### Step 3: Add A Records for Apex Domain (devichand.com)

You need to add FOUR A records for the root domain:

**Add A Record #1:**
1. Change Type dropdown to **"A"**
2. **Name:** `@` (or leave blank)
3. **Target:** `185.199.108.153` ← Fill this in!
4. **TTL:** 14400
5. Click **"Add Record"**

**Add A Record #2:**
1. **Type:** A
2. **Name:** `@` (or leave blank)
3. **Target:** `185.199.109.153` ← Fill this in!
4. **TTL:** 14400
5. Click **"Add Record"**

**Add A Record #3:**
1. **Type:** A
2. **Name:** `@` (or leave blank)
3. **Target:** `185.199.110.153` ← Fill this in!
4. **TTL:** 14400
5. Click **"Add Record"**

**Add A Record #4:**
1. **Type:** A
2. **Name:** `@` (or leave blank)
3. **Target:** `185.199.111.153` ← Fill this in!
4. **TTL:** 14400
5. Click **"Add Record"**

## Final DNS Setup Summary

After completing all steps, you should have:

| Type | Name | Target/Content | Purpose |
|------|------|---------------|---------|
| MX | @ | smtp.google.com | Email (keep this) |
| A | @ | 185.199.108.153 | GitHub Pages |
| A | @ | 185.199.109.153 | GitHub Pages |
| A | @ | 185.199.110.153 | GitHub Pages |
| A | @ | 185.199.111.153 | GitHub Pages |
| CNAME | www | devichand579.github.io | GitHub Pages |

## Quick Checklist

- [ ] Delete old CNAME: www → connect.hostinger.com
- [ ] Add new CNAME: www → devichand579.github.io
- [ ] Add A record: @ → 185.199.108.153
- [ ] Add A record: @ → 185.199.109.153
- [ ] Add A record: @ → 185.199.110.153
- [ ] Add A record: @ → 185.199.111.153
- [ ] Keep the MX record (for email)

## After DNS Update

1. **Wait 15-30 minutes** for DNS to propagate
2. **Check DNS:** Run `dig devichand.com` (should show GitHub IPs)
3. **Go back to GitHub Pages settings**
4. **Click "Check again"** button
5. The red error should go away and turn green! ✅

## Why You Need All 4 A Records

GitHub requires 4 A records for redundancy. All 4 need to point to different GitHub Pages IPs. This ensures:
- High availability
- Load balancing
- Geographic distribution

