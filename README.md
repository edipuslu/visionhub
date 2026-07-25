# VisionHub - Uslu Digital

Recovered editable source for `visionhub.usludigital.com`.

## What Was Recovered

- Next.js app structure
- Public landing/login page
- Admin company route at `/companies`
- Client route at `/client`
- Supabase client wiring
- Shared session helpers
- Visual styling reconstructed from the deployed Vercel build

## Important Security Note

The deployed browser bundle exposed private fallback login data. Those values are intentionally not committed here. Rotate any old passwords before redeploying.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Add your Supabase project URL and anon key.
3. Install dependencies.
4. Run the app.

```bash
npm install
npm run dev
```

## Deployment

Create a GitHub repository, push this project, then import that repository into Vercel. In Vercel, add the same Supabase environment variables.
