# XyberClan Deployment Guide

Complete guide for deploying the XyberClan website to production.

## Prerequisites

- Node.js 16+ installed
- Git repository access
- Domain name (optional but recommended)
- Hosting account (Vercel or Netlify)

## Option 1: Deploy to Vercel (Recommended)

Vercel offers the best performance for React applications with automatic deployments.

### Step 1: Prepare Your Project

```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your GitHub repository: `CYBERCLAN23/XYBERCLAN-SAAS-WEBSITE`
4. Configure project:
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`
5. Click "Deploy"

### Step 3: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Navigate to "Settings" → "Domains"
3. Add your custom domain (e.g., `xyberclan.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-60 minutes)

### Step 4: Update SEO Files

After deployment, update these files with your actual domain:

**public/index.html**: Replace all instances of `https://xyberclan.com` with your domain
**public/sitemap.xml**: Update URLs
**public/robots.txt**: Update sitemap URL

Commit and push changes - Vercel will auto-deploy.

## Option 2: Deploy to Netlify

### Step 1: Build the Project

```bash
npm run build
```

### Step 2: Deploy via Netlify Dashboard

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
5. Click "Deploy site"

### Step 3: Configure Custom Domain

1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Enter your domain name
4. Follow DNS configuration instructions

### Step 4: Enable HTTPS

Netlify automatically provisions SSL certificates. Ensure "Force HTTPS" is enabled in domain settings.

## Post-Deployment Tasks

### 1. Verify Deployment

- Visit your deployed URL
- Test all pages and sections
- Check mobile responsiveness
- Verify dark/light mode toggle
- Test all navigation links

### 2. SEO Setup

#### Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property (use your domain)
3. Verify ownership:
   - **DNS verification** (recommended): Add TXT record to DNS
   - **HTML file**: Upload verification file to `public/`
4. Submit sitemap: `https://yourdomain.com/sitemap.xml`

#### Bing Webmaster Tools

1. Go to [bing.com/webmasters](https://www.bing.com/webmasters)
2. Add your site
3. Verify ownership
4. Submit sitemap

### 3. Test Social Media Previews

#### Facebook/LinkedIn

1. Go to [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/)
2. Enter your URL
3. Click "Scrape Again" to refresh
4. Verify image and text appear correctly

#### Twitter

1. Go to [cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator)
2. Enter your URL
3. Verify card preview

### 4. Set Up Analytics (Optional)

#### Google Analytics 4

1. Create account at [analytics.google.com](https://analytics.google.com)
2. Create a GA4 property
3. Get your Measurement ID (G-XXXXXXXXXX)
4. Add to `public/index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

5. Commit and push changes

### 5. Performance Monitoring

Run Lighthouse audit:

```bash
lighthouse https://yourdomain.com --view
```

Target scores:

- Performance: ≥ 85
- SEO: ≥ 90
- Accessibility: ≥ 90
- Best Practices: ≥ 90

## Continuous Deployment

Both Vercel and Netlify support automatic deployments:

1. Push changes to `main` branch
2. Platform automatically builds and deploys
3. Changes live in 1-3 minutes

## Troubleshooting

### Build Fails

- Check Node.js version (should be 16+)
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

### 404 Errors on Refresh

- Ensure SPA routing is configured (already done in `vercel.json` and `_headers`)
- For Netlify: Check `_redirects` file exists

### Images Not Loading

- Verify images are in `public/` directory
- Check image paths start with `/` (e.g., `/team/logo.jpg`)
- Clear browser cache

### SEO Not Working

- Wait 24-48 hours for search engines to crawl
- Verify `robots.txt` allows crawling
- Check sitemap is accessible: `yourdomain.com/sitemap.xml`
- Use Google Search Console to check indexing status

## Domain Configuration

### DNS Settings for Custom Domain

Add these records to your DNS provider:

**For Vercel:**

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**For Netlify:**

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site-name.netlify.app
```

## Security Checklist

- ✅ HTTPS enabled (automatic with Vercel/Netlify)
- ✅ Security headers configured (`vercel.json` / `_headers`)
- ✅ No sensitive data in repository
- ✅ Environment variables properly configured
- ✅ CORS policies set

## Maintenance

### Regular Tasks

- **Weekly**: Check Google Search Console for errors
- **Monthly**: Review analytics and traffic sources
- **Quarterly**: Run Lighthouse performance audit
- **As needed**: Update content and images

### Updating Content

1. Make changes locally
2. Test with `npm start`
3. Commit and push to GitHub
4. Automatic deployment triggers
5. Verify changes on live site

## Support

For deployment issues:

- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Netlify: [docs.netlify.com](https://docs.netlify.com)

---

**Need Help?** Contact the XyberClan team or check the main README.md for more information.
