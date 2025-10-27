# GitHub Pages Deployment Flow Explained

## The Two Branches

### 📝 **MAIN branch** (Source Code)
- **Location**: Your code repository (`devichand579.github.io`)
- **Contains**: Jekyll source files (`_config.yml`, `_pages/`, `_posts/`, etc.)
- **Purpose**: Where you make edits
- **Current status**: Latest commits include CNAME and config changes

### 🌐 **GH-PAGES branch** (Deployed Website)
- **Location**: Same repository, but different branch
- **Contains**: Built HTML files (static website)
- **Purpose**: What visitors see when they visit your website
- **Current status**: Still deploying... (GitHub Actions is building it)

## The Flow (Step by Step)

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. YOU PUSH TO MAIN BRANCH                                      │
│    git push origin main                                          │
│    ⬇️                                                             │
└─────────────────────────────────────────────────────────────────┘
                              ⬇️
┌─────────────────────────────────────────────────────────────────┐
│ 2. GITHUB ACTIONS TRIGGERS                                      │
│    .github/workflows/deploy.yml activates                       │
│    ⬇️                                                             │
│    Steps:                                                       │
│    - Install Ruby, Python, dependencies                        │
│    - Run: bundle exec jekyll build                              │
│    - Build static HTML files → _site/ folder                    │
│    - Run: purgecss (remove unused CSS)                         │
└─────────────────────────────────────────────────────────────────┘
                              ⬇️
┌─────────────────────────────────────────────────────────────────┐
│ 3. DEPLOY TO GH-PAGES BRANCH                                    │
│    - Takes _site/ folder contents                               │
│    - Copies CNAME file to gh-pages                              │
│    - Pushes to origin/gh-pages branch                           │
│    - Creates new commit: "Deploying to gh-pages..."             │
└─────────────────────────────────────────────────────────────────┘
                              ⬇️
┌─────────────────────────────────────────────────────────────────┐
│ 4. GITHUB PAGES SERVES THE SITE                                 │
│    - GitHub automatically serves content from gh-pages branch   │
│    - CNAME file tells GitHub: "serve this at devichand.com"     │
│    - Site becomes available at:                                 │
│      • devichand579.github.io (works immediately)              │
│      • devichand.com (once DNS is updated)                     │
└─────────────────────────────────────────────────────────────────┘
```

## What Happened Just Now

1. ✅ **You edited** `_config.yml` and created `CNAME` file
2. ✅ **I committed** these changes to `main` branch
3. ✅ **I pushed** to GitHub (triggered deployment)
4. ⏳ **GitHub Actions** is currently building your site
5. ⏳ **Deployment** to gh-pages branch is in progress
6. ⏳ **Once complete**, gh-pages will have the CNAME file

## Timeline

- **Main branch**: Has your latest code (including CNAME)
- **GH-pages branch**: Has old deployment from commit e4ab681
- **Status**: New deployment (b20362e, 8ae931f) is currently being built

Check progress at: https://github.com/devichand579/devichand579.github.io/actions

## Key Points

### What's in MAIN branch?
- Your Jekyll source code
- All your `.md`, `.yml`, `.liquid` files
- Development files
- **You edit THIS branch**

### What's in GH-PAGES branch?
- Built HTML files (generated from main branch)
- Static assets (CSS, JS, images)
- The CNAME file (tells GitHub your domain)
- **Visitors see THIS branch**

### How Do They Connect?

```
MAIN BRANCH (source code)
         ↓
    GitHub Actions
    (builds the site)
         ↓
GH-PAGES BRANCH (deployed site)
         ↓
    GitHub Pages
    (serves it online)
         ↓
    Visitors see it!
```

## Current Deployment Status

**Your latest commits on main:**
- `8ae931f` - Create DOMAIN_SETUP.md (most recent)
- `b20362e` - Configure custom domain devichand.com
- `e4ab681` - Update cv.md

**Latest deployment on gh-pages:**
- `1a48f9c` - Deploying from commit e4ab681 (old!)

**What's happening now:**
- GitHub Actions is building your site with commits b20362e and 8ae931f
- It's taking ~4-5 minutes to complete
- Once done, gh-pages will be updated with the CNAME file

## To See Your Site Update:

1. Wait for GitHub Actions to finish (~5 minutes from push)
2. Visit: https://devichand579.github.io (should update automatically)
3. Visit: https://devichand.com (will work once you update DNS)

