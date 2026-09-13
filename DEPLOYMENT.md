# OKIO E-Commerce — Production Deployment Guide

This project is 100% pre-configured and ready to go live across all major hosting platforms.

---

## 🚀 Option 1: Deploy to Vercel (Recommended — 2 Minutes)

Vercel provides edge CDN delivery, instant SSL, and clean routing out of the box with the included [`vercel.json`](vercel.json).

### Method A: Via Vercel CLI (Instant)
Run in terminal:
```bash
npm install -g vercel
vercel
```
Follow prompts to connect your account and deploy. To deploy directly to production:
```bash
vercel --prod
```

### Method B: Via GitHub & Vercel Dashboard
1. Push this directory to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Production release: OKIO E-Commerce"
   git branch -M main
   git remote add origin https://github.com/<your-username>/okio-brand-website.git
   git push -u origin main
   ```
2. Log in to [Vercel Dashboard](https://vercel.com).
3. Click **"Add New Project"** → Import your repository.
4. Framework Preset: **Other** (Root Directory: `./`).
5. Click **Deploy**. Vercel automatically detects `vercel.json` and configures security headers, caching, and clean URLs.

---

## ⚡ Option 2: Deploy to Netlify (1-Click)

The project includes a ready-to-go [`netlify.toml`](netlify.toml).

### Method A: Via Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=.
```

### Method B: Via Netlify Web
1. Drag and drop this folder into the [Netlify Drop](https://app.netlify.com/drop) window.
2. Or connect your Git repository in Netlify. Build command: *(leave empty)*, Publish directory: `.`.

---

## 🌩️ Option 3: Deploy to Cloudflare Pages

Cloudflare Pages provides global Edge networks with 0ms cold starts.
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages**.
2. Click **Create Application** → **Pages** → **Connect to Git**.
3. Select your repository.
4. Build command: *(None)*.
5. Build output directory: `.`.
6. Deploy! The included [`_headers`](_headers) and [`_redirects`](_redirects) files are automatically applied.

---

## 🐙 Option 4: Deploy to GitHub Pages

1. Push code to your GitHub repo's `main` branch.
2. Go to **Settings** → **Pages**.
3. Under **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: `main` / `root`
4. Click **Save**. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

---

## 🐳 Option 5: Deploy with Docker (AWS, Google Cloud Run, DigitalOcean, VPS)

The project includes an optimized [`Dockerfile`](Dockerfile) and [`nginx.conf`](nginx.conf) running Alpine Nginx with Gzip compression and custom security headers.

### Build and Run Locally
```bash
docker build -t okio-brand-website .
docker run -d -p 80:80 --name okio okio-brand-website
```
Open `http://localhost` in your browser.

### Deploy to Google Cloud Run
```bash
gcloud builds submit --tag gcr.io/<PROJECT-ID>/okio-brand-website
gcloud run deploy okio --image gcr.io/<PROJECT-ID>/okio-brand-website --platform managed --allow-unauthenticated
```

---

## 📋 Production Go-Live Checklist

- [x] **10 HTML Pages Tested & Validated** (`index.html`, `shop.html`, `product.html`, `why-okio.html`, `about.html`, `cart.html`, `checkout.html`, `order-confirmation.html`, `faq.html`, `contact.html`).
- [x] **Branded 404 Page** (`404.html`) configured for all routes.
- [x] **Search Engine Optimization**:
  - `robots.txt` allowing public indexation and linking sitemap.
  - `sitemap.xml` with canonical URLs and priorities.
  - Open Graph / Twitter Card tags.
  - Schema.org JSON-LD Structured Data for Google rich snippets.
- [x] **PWA Manifest** (`manifest.json`) with theme color `#070707`.
- [x] **Security & Caching**:
  - Content-Type-Options: `nosniff`
  - Frame-Options: `SAMEORIGIN`
  - Long-term immutable caching for `/assets/`
  - Stale-while-revalidate for CSS/JS
- [x] **E-Commerce & State**:
  - Cart state persists across page refreshes via `localStorage`.
  - Free Shipping threshold configured (₹999).
  - Indian payment methods (UPI QR & handles, Cards, Net Banking, COD).
  - Commercial analytics event pipeline (`window.OKIO_ANALYTICS`).
- [ ] **Connect Custom Domain**:
  - Add DNS `A` records pointing to `76.76.21.21` (Vercel) or CNAME for your hosting provider.
  - Verify SSL certificate auto-issuance.
