# VisionHub - Uslu Digital

Recovered editable source for `visionhub.usludigital.com`.

## What Works Now

- Next.js app structure
- Public landing/login page and `/login` route
- Server-side VisionHub ID login verification
- Signed admin/client session tokens
- Admin company dashboard at `/companies`
- Admin-only API to create companies
- Admin-only API to create client/admin logins
- Password hashing on the server before saving logins
- Supabase schema for `companies` and `portal_users`
- Emergency environment-user fallback for login recovery

## Important Security Note

Do not commit real passwords, service role keys, or session secrets. Keep them in the hosting provider environment variables only.

## Database Setup

Run `supabase/schema.sql` in the Supabase SQL editor. It creates:

- `companies`
- `portal_users`

The app writes to those tables only from server-side API routes using `SUPABASE_SERVICE_ROLE_KEY`.

## Required Hosting Environment Variables

Add these in Vercel or your hosting provider:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
VISIONHUB_SESSION_SECRET=use-a-long-random-secret
```

For emergency login recovery, keep one admin user in `VISIONHUB_USERS_JSON` until the first database admin is created:

```json
[
  {
    "loginId": "admin",
    "role": "admin",
    "passwordSha256": "replace-with-sha256-hash"
  }
]
```

To generate a SHA-256 password hash locally:

```bash
printf 'your-password' | shasum -a 256
```

## Admin Workflow

1. Log in at `/login` as an admin.
2. Open `/companies`.
3. Create a company.
4. Create client or admin logins for that company.
5. Give the client their VisionHub ID and temporary password.

New companies and logins are saved to Supabase immediately. No redeploy is needed after the dashboard is configured.

## Local Setup

1. Copy `.env.example` to `.env.local`.
2. Add the Supabase and session secret values.
3. Run the SQL in `supabase/schema.sql`.
4. Install dependencies.
5. Run the app.

```bash
npm install
npm run dev
```

## Deployment

Push to GitHub, let the host redeploy, add the required environment variables, run the Supabase schema once, then create the first database admin login from the dashboard.
