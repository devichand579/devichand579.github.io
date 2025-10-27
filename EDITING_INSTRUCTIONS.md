# ⚠️ WHERE TO EDIT YOUR CODE

## ✅ ALWAYS EDIT: **MAIN BRANCH**

```
┌─────────────────────────────────────────┐
│  MAIN BRANCH                             │
│  ✓ Edit files here                      │
│  ✓ Make changes here                    │
│  ✓ Commit and push here                 │
└─────────────────────────────────────────┘
           ⬇️
┌─────────────────────────────────────────┐
│  GitHub Actions (Automatic)            │
│  Builds and deploys automatically      │
└─────────────────────────────────────────┘
           ⬇️
┌─────────────────────────────────────────┐
│  GH-PAGES BRANCH                       │
│  ✗ DO NOT EDIT                         │
│  ✗ Automatically generated             │
└─────────────────────────────────────────┘
```

## How to Make Changes

### Option 1: Edit Locally

1. Make sure you're on main branch:
   ```bash
   git checkout main
   ```

2. Edit any files:
   ```bash
   # Edit _pages/about.md
   # Edit _data/cv.yml
   # Edit _config.yml
   # etc.
   ```

3. Commit and push:
   ```bash
   git add .
   git commit -m "Update about page"
   git push origin main
   ```

4. **That's it!** GitHub Actions will automatically:
   - Build the site
   - Deploy to gh-pages
   - Update your live website

### Option 2: Edit on GitHub.com

1. Go to: https://github.com/devichand579/devichand579.github.io
2. Make sure you're on the **main branch** (dropdown shows "main")
3. Navigate to any file
4. Click the edit (pencil) icon
5. Make changes
6. Click "Commit changes"
7. GitHub Actions will automatically build and deploy

## ✅ Current Status

**Main Branch (Latest):**
- ✅ Has all your source code
- ✅ Has CNAME file
- ✅ Has updated _config.yml with devichand.com

**GH-Pages Branch (Latest Deployment):**
- ✅ Has CNAME file (devichand.com)
- ✅ Has built HTML files
- ✅ Ready to serve at devichand579.github.io

## What NOT to Do

❌ **Never edit the gh-pages branch directly**
- Your changes will be overwritten
- It's a deployment target, not source code

❌ **Never run `git checkout gh-pages` to make edits**
- Use main branch for all edits

## Complete Workflow

```
1. You: Edit files on MAIN branch
   └─> _pages/about.md
   └─> _posts/new-post.md
   └─> _config.yml
   
2. You: Push to GitHub
   git push origin main
   
3. GitHub Actions: Automatically runs
   └─> Installs dependencies
   └─> Runs: bundle exec jekyll build
   └─> Generates _site/ folder
   └─> Deploys to gh-pages branch
   
4. GitHub Pages: Serves the site
   └─> https://devichand579.github.io (works now!)
   └─> https://devichand.com (works after DNS update!)
```

## Quick Reference

**To update your site:**
```bash
cd /path/to/devichand579.github.io

# Make your changes
git checkout main  # Make sure you're on main
nano _pages/about.md  # Edit any file

# Commit and push
git add .
git commit -m "Description of changes"
git push origin main

# Done! Wait 3-5 minutes for deployment
```

**To check deployment status:**
- Visit: https://github.com/devichand579/devichand579.github.io/actions
- Look for green checkmark ✅ when complete

**Your live sites:**
- https://devichand579.github.io (works now!)
- https://devichand.com (will work after DNS update)

