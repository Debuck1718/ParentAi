# ParentAI - AI Co-Pilot for Modern Parenting

ParentAI is a comprehensive web application designed to support parents with intelligent guidance, milestone tracking, emergency assistance, and community support for child development.

## Features

### 1. **Authentication System**
- Secure email/password authentication via Supabase
- User profile management
- Session persistence
- Protected routes with role-based access

### 2. **AI Chat Assistant**
- Real-time AI-powered parenting guidance
- Conversation history tracking
- Context-aware responses based on child information
- Database-backed message persistence

### 3. **Milestone Tracker**
- Track developmental milestones across 4 categories:
  - **Physical**: Motor skills and physical development
  - **Cognitive**: Learning and thinking abilities
  - **Social**: Interaction and emotional development
  - **Language**: Communication and language skills
- Visual progress tracking
- Historical milestone records

### 4. **Emergency Helper**
- Symptom-based assessment tool
- Severity level determination
- Quick recommendations
- Integration with emergency services guidance

### 5. **Community Q&A**
- Ask questions and get answers from parents
- Browse helpful parent discussions
- Vote on helpful answers
- Category-based organization

### 6. **Daily Insights**
- Personalized parenting tips and advice
- Child development insights
- Age-appropriate recommendations
- Read tracking for saved content

## Tech Stack

- **Frontend**: React 18.3 + TypeScript
- **Styling**: Tailwind CSS + Custom CSS animations
- **Routing**: React Router v6
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Build Tool**: Vite

## Database Architecture

### Tables (with Row Level Security enabled)

1. **profiles** - User account information and preferences
2. **children** - Child profile data
3. **chat_conversations** - AI chat session management
4. **chat_messages** - Individual chat messages
5. **milestones** - Developmental milestone tracking
6. **daily_insights** - Personalized parenting insights
7. **community_questions** - Community Q&A questions
8. **community_answers** - Community Q&A answers

All tables include:
- UUID primary keys
- Timestamp tracking (created_at, updated_at)
- Row Level Security policies
- Proper foreign key relationships
- Performance indexes

## Project Structure

```
src/
├── pages/
│   ├── Auth.tsx           # Authentication page
│   ├── Dashboard.tsx      # Main dashboard
│   ├── Onboarding.tsx     # Child profile setup
│   ├── Chat.tsx           # AI chat interface
│   ├── Milestones.tsx     # Milestone tracking
│   ├── Emergency.tsx      # Emergency helper
│   └── Community.tsx      # Community Q&A
├── contexts/
│   └── AuthContext.tsx    # Auth state management
├── lib/
│   └── supabase.ts        # Supabase client
├── types/
│   └── index.ts           # TypeScript interfaces
├── App.tsx                # Main app with routing
├── main.tsx               # React entry point
└── index.css              # Global styles
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account with project

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd project
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
# Create .env file with your Supabase credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

4. Start development server
```bash
npm run dev
```

5. Open browser to http://localhost:5173

### Build for Production
```bash
npm run build
```

## Design Features

### Modern UI/UX
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Responsive design for all devices
- Intuitive navigation
- Loading states and error handling
- Accessible color contrasts
- Professional typography

### Animations
- Fade-in effects on page load
- Slide animations for content
- Hover transitions on interactive elements
- Pulse effects for loading states
- Smooth scroll behavior

### Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop enhancement
- Flexible grid layouts
- Touch-friendly interface

## Color System

- **Primary**: Blue (#3B82F6 - #1E40AF)
- **Secondary**: Green (#10B981 - #059669)
- **Accent**: Amber/Yellow (#F59E0B)
- **Danger**: Red (#EF4444)
- **Neutral**: Gray scale

## Authentication Flow

1. User signs up with email and full name
2. Secure password storage via Supabase
3. Email verification (optional)
4. User profile created in `profiles` table
5. Session token stored in browser
6. Protected routes check authentication
7. Sign out clears session

## Data Security

- **Row Level Security (RLS)**: All tables protected
- **User Isolation**: Each user can only access their data
- **Encrypted Passwords**: Handled by Supabase Auth
- **No Sensitive Data Logging**: Clean error handling
- **HTTPS**: All communications encrypted
- **Rate Limiting**: Supabase-managed

## API Integration

### Supabase Queries

All database operations follow best practices:
- Use `maybeSingle()` for optional queries
- Use `single()` for required single records
- Proper error handling on all queries
- Batch queries where possible
- Indexed columns for performance

## Testing

### Test Account
```
Email: test@example.com
Password: password123
```

### Manual Testing Checklist
- [ ] Sign up with new account
- [ ] Sign in with existing account
- [ ] Create child profile
- [ ] Send chat message
- [ ] Mark milestones as achieved
- [ ] Ask community question
- [ ] View daily insights
- [ ] Emergency symptom assessment
- [ ] Sign out functionality

## Performance Optimization

- Code splitting with Vite
- Lazy loading of routes
- Optimized CSS bundles (32KB gzipped)
- Optimized JS bundles (96KB gzipped)
- Image optimization
- Database query optimization with indexes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Docker
```bash
docker build -t parentai .
docker run -p 3000:3000 parentai
```

### Environment Setup for Production
```
VITE_SUPABASE_URL=<production-url>
VITE_SUPABASE_ANON_KEY=<production-key>
```

## Troubleshooting

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Authentication Issues
- Check .env file has correct Supabase credentials
- Verify email confirmation if enabled
- Check RLS policies in Supabase console

### Database Issues
- Check table RLS policies
- Verify foreign key relationships
- Review Supabase logs for detailed errors

## Future Enhancements

- [ ] Push notifications for milestones
- [ ] Video/voice chat for consultations
- [ ] Integration with pediatrician recommendations
- [ ] ML-powered insight personalization
- [ ] Multi-child household optimization
- [ ] Offline mode support
- [ ] Export reports (PDF, CSV)
- [ ] Social sharing features
- [ ] Advanced analytics dashboard
- [ ] Integration with health devices

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Create feature branch from main
2. Make changes with clear commit messages
3. Test thoroughly before submitting PR
4. Update documentation as needed

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Check the documentation
- Review existing issues
- Create new issue with details
- Contact support team

## Credits

Built with ❤️ for parents worldwide.

---

**Version**: 1.0.0
**Last Updated**: November 2024
**Status**: Production Ready
