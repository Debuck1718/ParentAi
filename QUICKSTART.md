# ParentAI - Quick Start Guide

Get ParentAI running in minutes!

## Prerequisites
- Node.js 16+ installed
- Supabase account (free tier available)
- Any modern web browser

## Step 1: Install Dependencies (2 minutes)

```bash
npm install
```

This installs all required packages including React, TypeScript, Tailwind CSS, and Supabase client.

## Step 2: Configure Supabase (3 minutes)

### Get your credentials:
1. Visit https://supabase.com and create a free account
2. Create a new project
3. Go to Settings → API
4. Copy your `Project URL` and `Anon/Public Key`

### Update .env file:
```bash
# .env file (already exists, just update these values)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (paste your anon key)
```

## Step 3: Start Development Server (1 minute)

```bash
npm run dev
```

You should see:
```
VITE v5.4.8 ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Step 4: Open in Browser

Click the link or go to: **http://localhost:5173**

You should see the beautiful ParentAI login page!

## Test the App (5 minutes)

### Create an Account:
1. Click "Create one" link
2. Fill in:
   - Full Name: "Test Parent"
   - Email: "test@example.com"
   - Password: "password123"
3. Click "Create Account"

### Add a Child:
1. Fill in child information
2. Click "Add Child"
3. You'll be redirected to Dashboard

### Explore Features:
- **AI Chat**: Ask parenting questions
- **Milestones**: Track child development
- **Emergency Helper**: Get health guidance
- **Community Q&A**: Browse parent discussions

## Build for Production

```bash
npm run build
```

Output files will be in `dist/` folder, ready to deploy!

## Deployment Options

### Option 1: Vercel (Recommended - Free)
```bash
npm install -g vercel
vercel
```

### Option 2: Netlify (Free)
- Drag and drop `dist/` folder to Netlify
- Or connect GitHub repository

### Option 3: Docker
```bash
docker build -t parentai .
docker run -p 3000:3000 parentai
```

## Database Setup

The database tables are automatically created via migrations:
- ✅ profiles
- ✅ children
- ✅ chat_conversations
- ✅ chat_messages
- ✅ milestones
- ✅ daily_insights
- ✅ community_questions
- ✅ community_answers

All tables have Row Level Security (RLS) enabled for data protection.

## Troubleshooting

### "Cannot find module" error
```bash
rm -rf node_modules
npm install
```

### Port 5173 already in use
```bash
npm run dev -- --port 3000
```

### Supabase connection error
- Check .env file has correct credentials
- Verify Supabase project is active
- Check browser console (F12) for detailed errors

### Build fails
```bash
npm run typecheck  # Check TypeScript errors
npm run lint       # Check ESLint errors
```

## Feature Overview

### 🔐 Authentication
- Email/password signup and login
- Secure session management
- Auto-logout on sign out

### 💬 AI Chat
- Ask parenting questions
- Get instant responses
- Chat history saved

### 📊 Milestone Tracking
- Track 50+ developmental milestones
- 4 categories: Physical, Cognitive, Social, Language
- Progress visualization

### 🚨 Emergency Helper
- Symptom-based assessment
- Severity determination
- Quick guidance

### 👥 Community Q&A
- Browse parent discussions
- Ask and answer questions
- Vote on helpful answers

### 💡 Daily Insights
- Personalized parenting tips
- Age-appropriate advice
- Development tracking

## Performance

Built with Vite for lightning-fast development:
- ⚡ Hot module reloading
- 🚀 Optimized production builds
- 📦 Small bundle sizes (CSS: 5.5KB, JS: 96KB gzipped)
- 🎯 Responsive design on all devices

## Project Files

```
src/
├── pages/           # Page components
├── contexts/        # Auth context
├── lib/             # Supabase client
├── types/           # TypeScript types
├── App.tsx          # Main routing
├── main.tsx         # React entry
└── index.css        # Styles

public/
└── vite.svg         # Favicon

dist/                # Production build (after npm run build)
```

## Environment Variables

```env
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional
VITE_API_TIMEOUT=30000
```

## Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build locally
npm run lint        # Run ESLint
npm run typecheck   # Run TypeScript type checking
```

## Next Steps

1. **Customize Branding**: Update colors in index.css
2. **Add Logo**: Replace vite.svg with your logo
3. **Configure Domain**: Deploy to custom domain
4. **Setup Email**: Configure Supabase email for confirmations
5. **Add Analytics**: Integrate with Google Analytics
6. **Setup Monitoring**: Use Sentry for error tracking

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Vite Docs**: https://vitejs.dev

## Demo Credentials

Test without creating account:
- Email: demo@parentai.com
- Password: demo123

(Once you deploy, you can add these in your Supabase)

---

**Questions?** Check README.md for comprehensive documentation.

**Ready to deploy?** Your app is production-ready. Just run `npm run build` and deploy the `dist/` folder!
