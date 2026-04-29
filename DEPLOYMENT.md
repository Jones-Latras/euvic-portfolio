# Vercel Deployment

## Vercel Project Settings

- Framework Preset: `Next.js`
- Build Command: `npm run build`
- Install Command: `npm install`
- Output Directory: leave empty
- Node.js Version: `22.x` or Vercel default

## Required Environment Variables

Add these in Vercel under Project Settings > Environment Variables for Production, Preview, and Development as needed.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

## Contact Form Email

The contact form stores messages in Supabase when the service role key is configured. Email delivery is optional and uses Resend.

```env
RESEND_API_KEY=
RESEND_FROM_EMAIL=Portfolio <onboarding@resend.dev>
CONTACT_FORM_TO_EMAIL=
```

For production, replace `RESEND_FROM_EMAIL` with an address from a verified Resend domain, for example `Portfolio <noreply@yourdomain.com>`.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/sql/schema.sql` in the Supabase SQL editor.
3. Run `supabase/sql/save_site_settings.sql` if site settings saving has not been installed yet.
4. Create an admin user in Supabase Authentication.
5. Confirm the storage buckets from `schema.sql` exist and are public.

## Predeploy Checks

Run these locally before pushing a deployment branch:

```bash
npm run lint
npm run build
```

After deployment, open `/login`, sign in with the Supabase admin user, and confirm `/admin`, `/projects`, `/about`, and `/contact` load correctly.
