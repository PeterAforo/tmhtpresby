# TMHTPresby Church Website - Deployment Guide

## Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or hosted like Supabase, Neon, Railway)
- Accounts for: Stripe, Resend, Google Cloud Console

---

## 1. Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### Required Variables

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `DATABASE_URL` | PostgreSQL connection string | Your database provider |
| `NEXTAUTH_SECRET` | Random secret for auth | Run: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your site URL | `http://localhost:3000` (dev) or production URL |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | Same as above |
| `RESEND_API_KEY` | Email sending API key | [Resend Dashboard](https://resend.com/api-keys) |
| `STRIPE_SECRET_KEY` | Stripe secret key | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_PUBLISHABLE_KEY` | Stripe public key | Same as above |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | See Stripe Webhook Setup below |

---

## 2. Database Setup

### Run Migrations

```bash
npx prisma migrate deploy
```

### Seed Demo Data (Optional)

```bash
npx tsx prisma/seed.ts
```

This creates:
- 3 staff users + 8 member users (password: `Church2026!`)
- 8 sermons with 4 series
- 8 events
- 6 blog posts
- 5 devotionals
- 6 gallery albums
- 4 discussion posts
- 1 campaign draft

---

## 3. Stripe Webhook Setup

Stripe webhooks notify your app when payments succeed or fail.

### For Local Development

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks to localhost:
   ```bash
   stripe listen --forward-to localhost:3000/api/giving/webhook
   ```
4. Copy the webhook signing secret (starts with `whsec_`) to your `.env`

### For Production

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Enter your endpoint URL: `https://yourdomain.com/api/giving/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** to your production environment variables

---

## 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth client ID**
5. Select **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy Client ID and Client Secret to your `.env`

---

## 5. Resend Email Setup

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use their test domain for development)
3. Create an API key at [resend.com/api-keys](https://resend.com/api-keys)
4. Add to your `.env`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxx
   FROM_EMAIL=noreply@yourdomain.com
   ADMIN_EMAIL=admin@yourdomain.com
   ```

---

## 6. Deploy to Vercel

### Option A: Via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add all environment variables in the Vercel dashboard
4. Deploy

### Option B: Via CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts and add environment variables when asked.

### Post-Deployment

1. Update `NEXTAUTH_URL` to your production URL
2. Add production redirect URI to Google OAuth
3. Create production Stripe webhook pointing to your domain
4. Run database migrations: `npx prisma migrate deploy`

---

## 7. Admin Access

After seeding, login with:
- **Email:** `admin@mhtpc.org`
- **Password:** `Church2026!`

Access the admin dashboard at `/admin`

---

## Troubleshooting

### Database connection issues
- Ensure `DATABASE_URL` is correct
- Check if your IP is whitelisted (for hosted databases)

### OAuth not working
- Verify redirect URIs match exactly
- Check that credentials are for the correct environment

### Emails not sending
- Verify domain in Resend dashboard
- Check `RESEND_API_KEY` is valid
- In development, check console for logged emails

### Stripe payments failing
- Ensure webhook secret matches
- Check Stripe dashboard for failed webhook deliveries
- Verify you're using test keys in development

---

## Support

For issues, contact the development team or open a GitHub issue.
