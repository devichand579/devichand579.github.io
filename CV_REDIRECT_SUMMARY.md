# CV Redirect Configuration

## What Was Changed

**File:** `_pages/cv.md`

**What it does now:**
- When someone clicks on "CV" in the navigation menu
- They are immediately redirected to your Google Drive PDF
- The redirect happens automatically (0 seconds delay)

## The Implementation

I used a **three-layer redirect** to ensure it works across all browsers and scenarios:

1. **HTML Meta Refresh** (instant redirect)
   ```html
   <meta http-equiv="refresh" content="0; url=https://drive.google.com/file/d/16QMoy_wZWyZ5Ly2Ov5C4fSu1abjrS-Wp/view?usp=sharing">
   ```

2. **JavaScript Redirect** (backup)
   ```javascript
   window.location.href = "https://drive.google.com/file/d/16QMoy_wZWyZ5Ly2Ov5C4fSu1abjrS-Wp/view?usp=sharing";
   ```

3. **Manual Link** (fallback for older browsers)
   ```html
   <a href="...">Click here if you are not redirected.</a>
   ```

## Deployment Status

✅ **Committed:** Changes committed to main branch  
✅ **Pushed:** Pushed to GitHub  
⏳ **Deploying:** GitHub Actions is building and deploying (3-5 minutes)

## Where to Test

Once deployment completes (in ~5 minutes):

- **Local:** https://devichand579.github.io/cv/
- **Custom Domain:** https://devichand.com/cv/
- **Direct:** Click "cv" in the top navigation menu

All will redirect to your Google Drive PDF!

## How It Works

```
User clicks "CV" 
  ↓
Site tries to load /cv/ page
  ↓
Jekyll generates the redirect HTML
  ↓
Browser receives redirect instructions
  ↓
Immediately goes to Google Drive
  ↓
PDF opens in browser! 📄
```

## Update Process

To change the CV link in the future:

1. Edit `_pages/cv.md`
2. Replace the Google Drive URL
3. Commit and push to main
4. Site auto-updates in 3-5 minutes!

