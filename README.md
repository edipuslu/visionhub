# VisionHub - Uslu Digital

Recovered editable source for `visionhub.usludigital.com`.

## What Was Recovered

- Next.js app structure
- Public landing/login page
- Admin company route at `/companies`
- Client route at `/client`
- Server-side VisionHub ID login verification
- Shared session helpers
- Visual styling reconstructed from the deployed Vercel build

## Important Security Note

The deployed browser bundle exposed private fallback login data. Those values are intentionally not committed here. Rotate any old passwords before redeploying.

## Login Configuration

Login is handled by `POST /api/login`. It checks the server-only `VISIONHUB_USERS_JSON` environment variable, so passwords are not bundled into the browser.

Use this shape in your host environment variables:

```json
[
  {
    "loginId": "vento01",
    "role": "client",
    "company": "Vento",
    "passwordSha256": "replace-with-sha256-hash"
  },
  {
    "loginId": "admin",
    "role": "admin",
    "passwordSha256": "replace-with-sha256-hash"
  }
]
```

`passwordSha256` is preferred. A plain `password` field is also supported for migration, but do not use it long term.

To generate a SHA-256 password hash locally:

```bash
printf 'your-password' | shasum -a 256
```

## Setup

1. Copy `.env.example` to `.env.local`.
2. Add `VISIONHUB_USERS_JSON` with your real login IDs and password hashes.
3. Add Supabase environment variables only if later pages need Supabase data.
4. Install dependencies.
5. Run the app.

```bash
npm install
npm run dev
```

## Deployment

In Vercel or your hosting provider, add `VISIONHUB_USERS_JSON` as a server-only environment variable, redeploy the site, then test each VisionHub ID at `/login` or `/` depending on the deployed route alias.
