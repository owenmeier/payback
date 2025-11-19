# PayBack Backend - Pre-Deployment Verification

## Files Created ✅
- [x] backend/.gitignore
- [x] backend/Procfile
- [x] backend/railway.json
- [x] backend/package.json (updated)

## Quick Verification

### 1. Check build works
```bash
cd backend
npm run build
```
Expected: No errors, `dist/` folder created

### 2. Check start works (locally)
```bash
npm start
```
Expected: "🚀 Server running on http://localhost:5000"

### 3. Test health endpoint
```bash
curl http://localhost:5000/api/health
```
Expected: `{"success":true,"message":"API is running"}`

### 4. Check environment variables
```bash
cat .env
```
Expected: All variables present (don't commit this file!)

## Deployment Checklist

- [ ] Build successful
- [ ] Start command works
- [ ] Health endpoint responds
- [ ] `.env` not committed
- [ ] All files committed to git
- [ ] Pushed to GitHub
- [ ] Ready to deploy!

## Deployment Options

### Option 1: Railway (Recommended)
- Free $5/month credit
- Faster deployment
- Better developer experience
- See: DEPLOYMENT_GUIDE.md

### Option 2: Render
- Completely free (no card)
- Slower cold starts
- Good backup option

## Environment Variables Needed

When deploying, you'll need:
```
NODE_ENV=production
PORT=5000
OPENAI_API_KEY=<your_key>
SESSION_SECRET=<random_secret>
FRONTEND_URL=<your_vercel_url>
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads/temp
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=10
```

Generate session secret:
```bash
openssl rand -base64 32
```
