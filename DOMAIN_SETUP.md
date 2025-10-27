# Custom Domain Setup for devichand.com

## What Has Been Configured

✅ **Code Changes Done:**
- Created `CNAME` file with content: `devichand.com`
- Updated `_config.yml` URL to `https://devichand.com`
- Changes have been pushed to GitHub (commit: b20362e)

## DNS Configuration Required

To complete the setup, you need to update your DNS records for devichand.com:

### Option 1: Using CNAME (Recommended for apex domains via GitHub Pages)

This method requires a DNS provider that supports ALIAS/ANAME records for apex domains (devichand.com without www).

1. **Go to your DNS provider** (currently Hostinger at IP 46.202.161.142)

2. **For apex domain (devichand.com):**
   - Create an **ALIAS** or **ANAME** record:
   - Record Type: `ALIAS` or `ANAME`
   - Host: `@` or `devichand.com`
   - Points to: `devichand579.github.io`
   
   OR if your DNS provider doesn't support ALIAS/ANAME:
   
   - Create **A Records** pointing to GitHub's IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```

3. **For www subdomain (www.devichand.com):**
   - Create **CNAME** record:
   - Host: `www`
   - Points to: `devichand579.github.io`

### Option 2: GitHub Pages DNS

GitHub Pages provides the following IP addresses for A records:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

## Verify Configuration

After updating DNS:

1. **Check GitHub Pages Settings:**
   - Go to: https://github.com/devichand579/devichand579.github.io/settings/pages
   - Under "Custom domain", you should see `devichand.com`
   - GitHub should verify the DNS and show "DNS check successful"

2. **Wait for DNS Propagation:**
   - DNS changes can take 24-48 hours to fully propagate
   - Check status: https://dnschecker.org/

3. **Test the Domain:**
   ```bash
   curl -I https://devichand.com
   ```
   Should return HTTP 200 status

## Current Status

- ✅ Code configuration complete
- ✅ Deployment triggered via GitHub Actions
- ⏳ Waiting for DNS configuration update
- ⏳ Waiting for GitHub Pages to verify domain

## Troubleshooting

If devichand.com doesn't work after DNS update:

1. Verify CNAME file exists in gh-pages branch:
   ```bash
   git checkout gh-pages
   cat CNAME
   ```

2. Check GitHub Pages settings at: https://github.com/devichand579/devichand579.github.io/settings/pages

3. Verify DNS with: `dig devichand.com`

4. Test both domains:
   - https://devichand.com
   - https://devichand579.github.io (should still work)

## Deployment Process

The GitHub Actions workflow will:
1. Build your Jekyll site
2. Include the CNAME file in the deployment
3. Deploy to the `gh-pages` branch
4. GitHub will automatically serve from devichand.com once DNS is configured

