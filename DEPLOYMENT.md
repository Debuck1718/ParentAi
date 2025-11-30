# ParentAI Deployment Guide

This guide will help you deploy ParentAI to get a live URL for hackathon review.

## Quick Deploy with Vercel (Recommended - 5 minutes)

Vercel is the fastest way to deploy this app.

### Prerequisites
- GitHub account
- Vercel account (free - sign up at https://vercel.com)

### Steps

#### 1. Push Code to GitHub
First, push your code to a GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit - ParentAI hackathon project"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

#### 2. Deploy to Vercel

**Option A: Using Vercel Dashboard (Easiest)**
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect it's a Vite project
4. Add environment variables:
   - `VITE_SUPABASE_URL` = `https://bvqnzrzgnimqbrvrbvgo.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cW56cnpnbmltcWJydnJidmdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNTM3ODQsImV4cCI6MjA3OTkyOTc4NH0.DvCxZFUPgHnazBOArUsMCCsr3E5CkMsEWTyjoBYALpE`
5. Click "Deploy"
6. Wait 2-3 minutes for deployment to complete
7. You'll get a live URL like: `https://your-project-name.vercel.app`

**Option B: Using Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - What's your project's name? parentai-hackathon
# - In which directory is your code located? ./
# - Want to override settings? No

# Add environment variables
vercel env add VITE_SUPABASE_URL
# Paste: https://bvqnzrzgnimqbrvrbvgo.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cW56cnpnbmltcWJydnJidmdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNTM3ODQsImV4cCI6MjA3OTkyOTc4NH0.DvCxZFUPgHnazBOArUsMCCsr3E5CkMsEWTyjoBYALpE

# Deploy again to use new env vars
vercel --prod
```

---

## Alternative: Deploy with Netlify

### Steps
1. Go to https://app.netlify.com/start
2. Connect your GitHub repository
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables in Site settings > Environment variables:
   - `VITE_SUPABASE_URL` = `https://bvqnzrzgnimqbrvrbvgo.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cW56cnpnbmltcWJydnJidmdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNTM3ODQsImV4cCI6MjA3OTkyOTc4NH0.DvCxZFUPgHnazBOArUsMCCsr3E5CkMsEWTyjoBYALpE`
5. Click "Deploy site"
6. You'll get a URL like: `https://your-site-name.netlify.app`

---

## After Deployment

### Test Your Deployed App
1. Visit your live URL
2. Sign up for a new account
3. Test key features:
   - Create a child profile
   - View child profile with all tabs
   - Try adding photos, sleep logs, feeding logs
   - Test the AI chat assistant
   - Log growth measurements
   - Add vaccine records

### Share with Hackathon Panelists
Your app is now live! Share the URL with hackathon judges.

**Demo Account (Optional):** Consider creating a demo account with sample data and sharing the credentials:
- Email: demo@parentai.app
- Password: Demo1234!

---

## Troubleshooting

### Build Fails
If build fails, check:
- All dependencies are in `package.json`
- TypeScript compiles without errors: `npm run typecheck`
- Build works locally: `npm run build`

### Environment Variables Not Working
- Make sure variable names start with `VITE_`
- Redeploy after adding environment variables
- Check they're set correctly in Vercel/Netlify dashboard

### 404 on Routes
- Vercel/Netlify should handle SPA routing automatically
- Make sure `vercel.json` is present with rewrite rules

### Database Connection Issues
- Verify Supabase URL and anon key are correct
- Check Supabase project is active
- Verify RLS policies allow access

---

## Custom Domain (Optional)
Both Vercel and Netlify support custom domains:
- Vercel: Project Settings > Domains
- Netlify: Site Settings > Domain Management

---

## Continuous Deployment
Once connected to GitHub:
- Every push to `main` branch triggers automatic deployment
- Preview deployments for pull requests
- Instant rollback if needed

---

## Need Help?
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Supabase Docs: https://supabase.com/docs

Good luck with your hackathon! 🚀
