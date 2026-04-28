# QA Checklist

Run this checklist against a production build:

```bash
npm run build
npm run start
```

## Viewports
- 375px: no horizontal page scroll; navigation and filters remain usable.
- 768px: project grids shift to 2 columns.
- 1280px: project grids shift to 3 columns and admin sidebar is visible.

## Public Pages
- `/`: hero image is stable, CTA text has contrast in light and dark mode.
- `/projects`: filters update URL params; filtered URL pasted in a new tab keeps the same state.
- `/projects/invalid-slug`: renders the 404 page.
- `/about`: profile image, education, and skill bars render without overlap.
- `/contact`: empty submit shows validation; honeypot submissions return success silently.

## Admin Edge Cases
- `/admin` redirects to `/login` when Supabase env vars are configured and no session exists.
- Project image upload rejects files over 20MB.
- Project PDF upload rejects files over 50MB.
- Duplicate project slugs auto-append `-2`, `-3`, etc.
- Message rows can be expanded, marked read/unread, and deleted.

## Lighthouse
Run Lighthouse on:
- `/`
- `/projects`
- `/projects/[slug]`
- `/about`

Targets for each page:
- Performance >= 90
- Accessibility >= 90
- Best Practices >= 90
- SEO >= 90
