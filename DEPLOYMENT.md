# 🚀 SoundSteps Deployment Guide

This guide covers deploying SoundSteps to the web using **Railway** (recommended) and other platforms.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [x] App runs locally (`./start.sh` or `start.bat`)
- [x] Docker container works (`./docker-run.sh`)
- [x] All tests pass (`bash test_api.sh`)
- [x] Code is pushed to GitHub

---

## 🚂 Deploy to Railway (Recommended)

Railway is the easiest platform for deploying Docker applications - no configuration needed!

### Step 1: Create Railway Account

1. Go to **[railway.app](https://railway.app)**
2. Click **"Login"** → **"Login with GitHub"**
3. Authorize Railway to access your repositories

### Step 2: Create New Project

1. Click **"New Project"** (or **"Start a New Project"**)
2. Select **"Deploy from GitHub repo"**
3. Find and select `magic-maker-studio`
4. Click **"Deploy Now"**

### Step 3: Wait for Build

Railway will automatically:
- Detect your `Dockerfile`
- Build the Docker image
- Deploy the container
- Set up HTTPS

Build takes ~2-3 minutes. Watch the logs for progress.

### Step 4: Generate Public URL

1. Click on your deployed service
2. Go to **Settings** tab
3. Scroll to **Networking** section
4. Click **"Generate Domain"**
5. Your app is now live! 🎉

Example URL: `https://soundsteps-production.up.railway.app`

### Step 5: Verify Deployment

Test your live app:
```bash
# Replace with your Railway URL
curl https://your-app.up.railway.app/health
```

---

## ⚙️ Railway Configuration (Optional)

### Environment Variables

In Railway dashboard → **Variables** tab:

| Variable | Value | Description |
|----------|-------|-------------|
| `ENVIRONMENT` | `production` | Sets production mode |
| `DEBUG` | `false` | Disables debug mode |
| `PORT` | `8000` | Server port (auto-set) |

### Custom Domain

1. Go to **Settings** → **Networking**
2. Click **"Add Custom Domain"**
3. Enter your domain (e.g., `soundsteps.yourdomain.com`)
4. Add the CNAME record to your DNS provider
5. Wait for SSL certificate (automatic)

---

## 💰 Railway Pricing

| Plan | Cost | Included |
|------|------|----------|
| **Free Trial** | $0 | $5 credit, ~500 hours |
| **Hobby** | $5/month | Unlimited hours, 8GB RAM |
| **Pro** | $20/month | Team features, priority support |

> 💡 The free trial is enough for demos and hackathons!

---

## 🔄 Continuous Deployment

Railway automatically redeploys when you push to GitHub:

```bash
# Make changes locally
git add -A
git commit -m "Update feature"
git push origin main
# Railway automatically deploys! 🚀
```

---

## 🛠️ Alternative Platforms

### Render.com

1. Go to [render.com](https://render.com)
2. Click **"New"** → **"Web Service"**
3. Connect GitHub repository
4. Set:
   - **Environment:** Docker
   - **Region:** Oregon (US West)
5. Click **"Create Web Service"**

### Fly.io

```bash
# Install Fly CLI
brew install flyctl

# Login
fly auth login

# Launch (from project root)
fly launch

# Deploy
fly deploy
```

### Google Cloud Run

```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/soundsteps

# Deploy to Cloud Run
gcloud run deploy soundsteps \
  --image gcr.io/PROJECT_ID/soundsteps \
  --platform managed \
  --allow-unauthenticated
```

---

## 🔧 Troubleshooting

### Build Fails

**Check Dockerfile syntax:**
```bash
docker build -t soundsteps .
```

**Check logs in Railway:**
- Click on deployment → **View Logs**

### App Crashes on Start

**Common issues:**
- Missing environment variables
- Port not set correctly (Railway sets `PORT` automatically)
- Import errors (check Python paths)

**Fix:** Check deployment logs for specific error messages.

### 502 Bad Gateway

**Causes:**
- App not listening on correct port
- App crashed during startup
- Health check failing

**Fix:** Ensure app listens on `0.0.0.0:8000`

---

## 📊 Monitoring

### Railway Dashboard

- **Metrics:** CPU, Memory, Network usage
- **Logs:** Real-time application logs
- **Deployments:** History and rollback options

### Health Check Endpoint

```bash
curl https://your-app.up.railway.app/health
# Expected: {"status":"online","service":"Magic Maker Studio Backend",...}
```

---

## 🔐 Security Notes

For production deployments:

1. **Set CORS origins** - Update `main.py` to allow only your domain
2. **Use environment variables** - Don't hardcode secrets
3. **Enable HTTPS** - Railway provides this automatically
4. **Rate limiting** - Consider adding for API endpoints

---

## 📞 Support

- **Railway Docs:** [docs.railway.app](https://docs.railway.app)
- **Railway Discord:** [discord.gg/railway](https://discord.gg/railway)
- **Project Issues:** Open a GitHub issue

---

<div align="center">

**🎵 Happy Deploying! 🎵**

</div>
