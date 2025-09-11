# 📧 Newsletter System Setup Guide

## Overview
The Shakara Festival website now includes a complete newsletter subscription system with:
- ✅ Duplicate subscription prevention
- ✅ Unsubscribe functionality
- ✅ Email validation and storage
- ✅ Professional email templates

## Environment Variables Required

Add these to your `.env.local` file:

```bash
# Existing required variables
RESEND_API_KEY=your_resend_api_key_here
NEXT_PUBLIC_SANITY_PROJECT_ID=9u7w33ib
NEXT_PUBLIC_SANITY_DATASET=production

# Base URL for unsubscribe links 
# IMPORTANT: Should always be production domain, even in development
# because email recipients click links from their email clients
NEXT_PUBLIC_BASE_URL=https://shakarafestival.com
```

## Important: Why Unsubscribe Links Always Use Production Domain

Even during development, unsubscribe links should point to your production domain because:

1. **Email recipients are real people** with real email addresses
2. **Email clients can't access localhost** - they need a public URL
3. **Testing is more realistic** - you test the actual user experience
4. **No deployment surprises** - links work the same way in all environments

This means:
- ✅ Development emails → `https://shakarafestival.com/unsubscribe?token=...`  
- ✅ Production emails → `https://shakarafestival.com/unsubscribe?token=...`
- ❌ Never use `http://localhost:3000/unsubscribe` in emails

## How It Works

### 1. Subscription Process
1. User submits email + firstName (+ optional interests)
2. System checks if email is already subscribed
3. If new: creates subscriber record and sends welcome email
4. If already subscribed: returns friendly error message
5. If previously unsubscribed: reactivates subscription

### 2. Email Features
- Professional HTML template with festival branding
- Personalized with user's first name
- Lists user's selected interests
- Includes unsubscribe link at bottom
- Festival-themed colors and styling

### 3. Unsubscribe Process
1. User clicks unsubscribe link in email
2. Redirects to `/unsubscribe?token=secure_token`
3. Shows confirmation page with user details
4. User confirms unsubscription
5. Updates subscriber status to inactive

## File Structure

```
src/
├── lib/
│   └── subscribers.ts          # Subscriber management utilities
├── app/
│   ├── api/
│   │   ├── newsletter/
│   │   │   └── route.ts       # Newsletter subscription API
│   │   └── unsubscribe/
│   │       └── route.ts       # Unsubscribe API
│   └── unsubscribe/
│       └── page.tsx           # Unsubscribe confirmation page
├── components/
│   └── sections/
│       └── NewsLetterSignup.tsx # Newsletter form component
└── data/
    └── subscribers.json        # Subscriber data storage (auto-created)
```

## API Endpoints

### POST /api/newsletter
Subscribe to newsletter
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "interests": ["Lineup Announcements", "Ticket Sales"] // optional
}
```

**Responses:**
- `200`: Successfully subscribed
- `409`: Already subscribed
- `400`: Missing required fields
- `500`: Server error

### GET /api/unsubscribe?token=xxx
Validate unsubscribe token
```json
{
  "success": true,
  "subscriber": {
    "firstName": "John",
    "email": "user@example.com"
  }
}
```

### POST /api/unsubscribe
Process unsubscription
```json
{
  "token": "secure_unsubscribe_token"
}
```

## Subscriber Data Structure

Each subscriber record contains:
```typescript
{
  id: string;              // Unique identifier
  email: string;           // Email address (lowercase)
  firstName: string;       // User's first name
  interests?: string[];    // Optional interests array
  subscribedAt: string;    // ISO date string
  unsubscribedAt?: string; // ISO date if unsubscribed
  isActive: boolean;       // Subscription status
  unsubscribeToken: string; // Secure token for unsubscribe
}
```

## Error Handling

### Newsletter Signup
- **Duplicate subscription**: Shows yellow-bordered toast with "already subscribed" message
- **Server errors**: Shows red-bordered toast with error details
- **Success**: Shows green-bordered success toast

### Unsubscribe Process
- **Invalid token**: Shows error page
- **Already unsubscribed**: Shows appropriate message
- **Success**: Shows confirmation with re-subscribe option

## Security Features

- **Secure tokens**: 32-byte random hex strings for unsubscribe links
- **Email validation**: Zod schema validation on frontend and backend
- **Token expiration**: Tokens become invalid after unsubscription
- **Case-insensitive emails**: Stored in lowercase to prevent duplicates

## Database Migration

Currently uses JSON file storage (`data/subscribers.json`). To upgrade to a database:

### Option 1: Prisma + PostgreSQL
```bash
npm install prisma @prisma/client
npx prisma init
```

### Option 2: MongoDB + Mongoose
```bash
npm install mongoose
```

### Option 3: Supabase
```bash
npm install @supabase/supabase-js
```

## Testing

### Test Subscription
1. Fill out any newsletter form on the site
2. Check email for welcome message with unsubscribe link
3. Try subscribing again with same email (should show error)

### Test Unsubscribe
1. Click unsubscribe link in email
2. Confirm unsubscription on page
3. Try subscribing again (should reactivate)

## Analytics

The system tracks:
- Total subscribers
- Active vs unsubscribed counts
- Recent subscription activity
- Subscription interests

Access via `getSubscriberStats()` function in `lib/subscribers.ts`.

## Production Deployment

1. Set `NEXT_PUBLIC_BASE_URL` to your production domain
2. Ensure `RESEND_API_KEY` is configured
3. The `data/` directory will be created automatically
4. Consider implementing database backup for `subscribers.json`

## Future Enhancements

- [ ] Admin dashboard for subscriber management
- [ ] Email campaign system
- [ ] Subscription preferences (email frequency)
- [ ] Integration with email marketing platforms
- [ ] A/B testing for email templates
- [ ] Subscriber segmentation by interests