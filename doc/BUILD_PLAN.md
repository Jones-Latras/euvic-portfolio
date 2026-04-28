# 🏗️ Architectural Portfolio — Master Build Plan
**Project:** Architectural Drafting Design Student Portfolio  
**Stack:** Next.js 14+ · TypeScript · Tailwind CSS · Supabase · Vercel  
**Version:** 1.0 | Generated: April 28, 2026

---

> ## 🤖 AI Agent Instructions
> This is the living master checklist for this project. After completing **any step**, update its status:
> - `[ ]` → `[x]` when **done**
> - `[ ]` → `[~]` when **in progress**
> - `[ ]` → `[!]` when **blocked**
>
> After completing an **entire phase**, update the phase header status badge from `🔲 PENDING` → `🔄 IN PROGRESS` → `✅ COMPLETE`.
> Always commit the updated `BUILD_PLAN.md` alongside any code changes.

---

## Progress Overview

| Phase | Title | Status | Est. Time |
|-------|-------|--------|-----------|
| 0 | Environment & Tooling Setup | 🔲 PENDING | 1–2 hrs |
| 1 | Supabase Backend Foundation | 🔲 PENDING | 2–3 hrs |
| 2 | Next.js Project Scaffold | 🔄 IN PROGRESS | 1–2 hrs |
| 3 | Public Pages — Core UI | 🔄 IN PROGRESS | 6–8 hrs |
| 4 | Admin Panel — Auth & Shell | 🔄 IN PROGRESS | 3–4 hrs |
| 5 | Admin Panel — Content Management | 🔲 PENDING | 5–6 hrs |
| 6 | API Routes & Email Integration | 🔄 IN PROGRESS | 2–3 hrs |
| 7 | Filtering, SEO & Performance | 🔲 PENDING | 3–4 hrs |
| 8 | QA, Accessibility & Lighthouse | 🔲 PENDING | 2–3 hrs |
| 9 | Deployment & Launch | 🔲 PENDING | 1–2 hrs |

---

---

# PHASE 0 — Environment & Tooling Setup
**Status:** 🔲 PENDING  
**Goal:** Bootstrap all accounts, tools, and local dev environment before writing a single line of application code.

## 0.1 Accounts & Services
- [ ] Create a **Supabase** account at supabase.com — start a new project, name it `arch-portfolio`
- [ ] Save the **Project URL** and **Anon Key** from Project Settings → API
- [ ] Save the **Service Role Key** (server-only — never expose to client)
- [ ] Create a **Vercel** account at vercel.com and connect GitHub
- [ ] Create a **Resend** account at resend.com — verify a sending domain or use the sandbox
- [ ] Save the **Resend API Key**
- [ ] Create a **GitHub** repository named `arch-portfolio` (private)

## 0.2 Local Development Setup
- [ ] Install Node.js ≥ 18.17 (`node -v` to verify)
- [ ] Install pnpm: `npm install -g pnpm`
- [ ] Install Supabase CLI: `brew install supabase/tap/supabase` (or npm equivalent)
- [ ] Install Vercel CLI: `pnpm add -g vercel`

## 0.3 Environment Variables File
- [ ] Create `.env.local` at project root with the following keys populated:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  RESEND_API_KEY=
  CONTACT_FORM_TO_EMAIL=
  NEXT_PUBLIC_SITE_URL=http://localhost:3000
  ```
- [ ] Add `.env.local` to `.gitignore` (verify it is NOT committed)

## 0.4 VS Code / Editor Setup
- [ ] Install extensions: ESLint, Prettier, Tailwind CSS IntelliSense, Supabase
- [ ] Create `.prettierrc` with `{ "semi": false, "singleQuote": true, "tabWidth": 2 }`
- [ ] Create `.eslintrc.json` extending `next/core-web-vitals`

## ✅ Phase 0 Done When:
All accounts exist, API keys are saved locally, and `node -v` + `pnpm -v` return valid versions.

---

---

# PHASE 1 — Supabase Backend Foundation
**Status:** 🔲 PENDING  
**Goal:** Full database schema, storage buckets, RLS policies, and seed data are in place before building the frontend.

## 1.1 Database Tables
Run all SQL in the Supabase SQL Editor (Dashboard → SQL Editor → New Query).

- [ ] Create `projects` table:
  ```sql
  CREATE TABLE projects (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title        TEXT NOT NULL,
    slug         TEXT UNIQUE NOT NULL,
    short_desc   TEXT,
    description  TEXT,
    category     TEXT NOT NULL,
    tags         TEXT[],
    year         TEXT,
    tech_specs   JSONB,
    cover_image  TEXT,
    images       TEXT[],
    pdf_url      TEXT,
    is_featured  BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    view_count   INTEGER DEFAULT 0,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
  );
  ```
- [ ] Create `about` table:
  ```sql
  CREATE TABLE about (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bio        TEXT,
    photo_url  TEXT,
    cv_url     TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  INSERT INTO about (bio) VALUES ('My bio goes here.');
  ```
- [ ] Create `education` table:
  ```sql
  CREATE TABLE education (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution TEXT NOT NULL,
    program     TEXT NOT NULL,
    start_year  TEXT,
    end_year    TEXT,
    gpa         TEXT,
    sort_order  INTEGER DEFAULT 0
  );
  ```
- [ ] Create `skills` table:
  ```sql
  CREATE TABLE skills (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL,
    category   TEXT NOT NULL,
    level      INTEGER CHECK (level BETWEEN 1 AND 5),
    icon_slug  TEXT,
    sort_order INTEGER DEFAULT 0
  );
  ```
- [ ] Create `contact_messages` table:
  ```sql
  CREATE TABLE contact_messages (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    subject    TEXT,
    message    TEXT NOT NULL,
    is_read    BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```
- [ ] Create `site_settings` table:
  ```sql
  CREATE TABLE site_settings (
    key        TEXT PRIMARY KEY,
    value      TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  INSERT INTO site_settings (key, value) VALUES
    ('student_name', 'Your Name'),
    ('tagline', 'Architectural Drafting & Design'),
    ('email', 'you@email.com'),
    ('linkedin_url', ''),
    ('behance_url', ''),
    ('hero_image_url', ''),
    ('seo_title', 'Portfolio | Architectural Design'),
    ('seo_description', 'Showcasing architectural drafting and design work.'),
    ('seo_og_image', '');
  ```

## 1.2 Database Functions & Triggers
- [ ] Create `updated_at` auto-update trigger for `projects` and `about`:
  ```sql
  CREATE OR REPLACE FUNCTION update_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

  CREATE TRIGGER about_updated_at
    BEFORE UPDATE ON about
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  ```
- [ ] Create `increment_view_count` RPC function:
  ```sql
  CREATE OR REPLACE FUNCTION increment_view_count(project_slug TEXT)
  RETURNS VOID AS $$
  BEGIN
    UPDATE projects SET view_count = view_count + 1 WHERE slug = project_slug;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  ```

## 1.3 Row Level Security (RLS) Policies
- [ ] Enable RLS and apply policies for `projects`:
  ```sql
  ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Public reads published" ON projects
    FOR SELECT USING (is_published = TRUE);
  CREATE POLICY "Admin full access" ON projects
    USING (auth.role() = 'authenticated');
  ```
- [ ] Apply RLS for `contact_messages`:
  ```sql
  ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Public insert" ON contact_messages
    FOR INSERT WITH CHECK (TRUE);
  CREATE POLICY "Admin reads" ON contact_messages
    FOR SELECT USING (auth.role() = 'authenticated');
  CREATE POLICY "Admin delete" ON contact_messages
    FOR DELETE USING (auth.role() = 'authenticated');
  ```
- [ ] Apply RLS for `about`, `education`, `skills`, `site_settings` (public read, admin write):
  ```sql
  ALTER TABLE about ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Public read about" ON about FOR SELECT USING (TRUE);
  CREATE POLICY "Admin write about" ON about USING (auth.role() = 'authenticated');

  ALTER TABLE education ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Public read education" ON education FOR SELECT USING (TRUE);
  CREATE POLICY "Admin write education" ON education USING (auth.role() = 'authenticated');

  ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Public read skills" ON skills FOR SELECT USING (TRUE);
  CREATE POLICY "Admin write skills" ON skills USING (auth.role() = 'authenticated');

  ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (TRUE);
  CREATE POLICY "Admin write settings" ON site_settings USING (auth.role() = 'authenticated');
  ```

## 1.4 Supabase Storage Buckets
- [ ] Create `project-images` bucket — Public access ON
- [ ] Create `project-pdfs` bucket — Public access ON
- [ ] Create `profile` bucket — Public access ON
- [ ] Create `site-assets` bucket — Public access ON
- [ ] Set file size limits: 20MB for images, 50MB for PDFs (in bucket settings)
- [ ] Set allowed MIME types for `project-images`: `image/jpeg, image/png, image/webp`

## 1.5 Supabase Auth Setup
- [ ] Go to Authentication → Settings — confirm email auth is enabled
- [ ] Create the admin user: Authentication → Users → Invite User → enter student's email
- [ ] Disable "Enable Email Confirmations" for easier local dev (re-enable before launch)
- [ ] Generate Supabase TypeScript types locally (run after project scaffold in Phase 2):
  ```bash
  pnpm supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts
  ```

## 1.6 Seed Data
- [ ] Insert 2–3 sample projects (draft status) for development testing
- [ ] Insert 3–5 sample skills across categories
- [ ] Insert 1 sample education entry

## ✅ Phase 1 Done When:
All tables exist, RLS policies pass the Supabase Policy Editor test, all 4 storage buckets are created, and the admin user can log in via the Supabase Auth dashboard.

---

---

# PHASE 2 — Next.js Project Scaffold
**Status:** 🔄 IN PROGRESS  
**Goal:** A runnable Next.js project with all dependencies installed, proper folder structure, Supabase clients wired up, and global styling configured.

## 2.1 Create Next.js App
- [x] Run: `pnpm create next-app@latest arch-portfolio --typescript --tailwind --eslint --app --src-dir no --import-alias "@/*"` *(implemented manually in current project root because repo already exists here)*
- [x] `cd arch-portfolio` *(already in project root)*
- [ ] Initialize git: `git init && git remote add origin <your-github-repo-url>`
- [ ] Make first commit: `git add . && git commit -m "chore: init next.js project"`

## 2.2 Install All Dependencies
- [x] Install production dependencies:
  ```bash
  pnpm add @supabase/ssr @supabase/supabase-js \
    yet-another-react-lightbox \
    react-markdown remark-gfm \
    react-hook-form @hookform/resolvers zod \
    resend \
    lucide-react \
    clsx tailwind-merge \
    next-themes \
    @vercel/analytics
  ```
- [x] Install dev dependencies:
  ```bash
  pnpm add -D @types/node prettier eslint-config-prettier
  ```

## 2.3 Folder Structure
- [x] Create the complete folder skeleton:
  ```
  app/
    (public)/
      page.tsx
      projects/
        page.tsx
        [slug]/
          page.tsx
      about/
        page.tsx
      contact/
        page.tsx
    admin/
      layout.tsx
      page.tsx
      projects/
        page.tsx
        new/
          page.tsx
        [id]/
          edit/
            page.tsx
      about/
        page.tsx
      messages/
        page.tsx
      settings/
        page.tsx
    api/
      contact/
        route.ts
      increment-view/
        route.ts
    layout.tsx
    globals.css
  components/
    ui/
    projects/
    admin/
    layout/
  lib/
    supabase/
      client.ts
      server.ts
      types.ts
    utils.ts
    constants.ts
  public/
  ```
- [x] Add placeholder `page.tsx` files with `export default function Page() { return <div /> }` for every route above (prevents build errors)

## 2.4 Supabase Client Files
- [x] Create `lib/supabase/client.ts` (browser client):
  ```typescript
  import { createBrowserClient } from '@supabase/ssr'
  import type { Database } from './types'

  export function createClient() {
    return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  ```
- [x] Create `lib/supabase/server.ts` (server client with cookies):
  ```typescript
  import { createServerClient } from '@supabase/ssr'
  import { cookies } from 'next/headers'
  import type { Database } from './types'

  export async function createClient() {
    const cookieStore = await cookies()
    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {}
          },
        },
      }
    )
  }
  ```
- [!] Run the Supabase type generator and paste output into `lib/supabase/types.ts` *(blocked until Supabase project ID/credentials exist; temporary schema-aligned types are in place)*

## 2.5 Utilities & Constants
- [x] Create `lib/utils.ts`:
  ```typescript
  import { clsx, type ClassValue } from 'clsx'
  import { twMerge } from 'tailwind-merge'

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }

  export function slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  export function formatYear(year: string): string {
    return year || 'N/A'
  }
  ```
- [x] Create `lib/constants.ts` with all magic strings:
  ```typescript
  export const PROJECT_CATEGORIES = [
    { value: 'floor-plan', label: 'Floor Plans' },
    { value: 'elevation', label: 'Elevations' },
    { value: '3d-render', label: '3D Renders' },
    { value: 'site-plan', label: 'Site Plans' },
    { value: 'conceptual', label: 'Conceptual Designs' },
  ] as const

  export const PROJECT_TAGS = [
    'autocad', 'revit', 'sketchup', 'hand-drawn',
    'residential', 'commercial', 'archicad', 'adobe-suite'
  ] as const

  export const CONTACT_SUBJECTS = [
    'Job Opportunity',
    'Academic Inquiry',
    'Freelance Project',
    'Other',
  ] as const

  export const STORAGE_BUCKETS = {
    projectImages: 'project-images',
    projectPdfs: 'project-pdfs',
    profile: 'profile',
    siteAssets: 'site-assets',
  } as const

  export const GRID_ISR_SECONDS = {
    homepage: 3600,      // 1 hour
    gallery: 1800,       // 30 min
    projectDetail: 1800, // 30 min
    about: 3600,         // 1 hour
  } as const
  ```

## 2.6 Tailwind & Global Styles
- [x] Update `tailwind.config.ts` to include custom font family placeholders and dark mode:
  ```typescript
  import type { Config } from 'tailwindcss'
  const config: Config = {
    darkMode: 'class',
    content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
    theme: {
      extend: {
        fontFamily: {
          sans: ['var(--font-dm-sans)', 'sans-serif'],
          mono: ['var(--font-dm-mono)', 'monospace'],
        },
        colors: {
          accent: {
            DEFAULT: '#1a2332',
            light: '#2d3f55',
          },
        },
      },
    },
    plugins: [],
  }
  export default config
  ```
- [x] Update `app/globals.css` with CSS variables for light/dark mode and base resets
- [x] Configure root `app/layout.tsx` with Google Fonts (DM Sans + DM Mono), ThemeProvider, Analytics wrapper, and global metadata defaults

## 2.7 Verify Scaffold
- [!] Run `pnpm dev` — confirm app starts on `localhost:3000` with no TypeScript errors *(pnpm unavailable locally; npm scripts are configured)*
- [x] Run `pnpm build` — confirm clean build with zero errors *(verified with `npm run build`)*
- [ ] Commit: `git commit -m "chore: project scaffold, deps, supabase clients"`

## ✅ Phase 2 Done When:
`pnpm dev` runs cleanly, Supabase clients are typed, constants file exists, `pnpm build` succeeds.

---

---

# PHASE 3 — Public Pages — Core UI
**Status:** 🔄 IN PROGRESS  
**Goal:** All five public-facing pages are fully built, styled, responsive, and pulling data from Supabase.

## 3.1 Shared Layout Components

### 3.1.1 Header / Navigation (`components/layout/Header.tsx`)
- [x] Logo / student name (links to `/`)
- [x] Nav links: Projects · About · Contact
- [ ] Admin icon link (visible only when session exists)
- [x] Mobile hamburger menu — drawer on small screens, inline links on desktop
- [x] All nav links have `hover`, `focus-visible`, and `active` states (150ms transition)
- [x] Sticky header with subtle blur backdrop on scroll

### 3.1.2 Footer (`components/layout/Footer.tsx`)
- [x] Social links: LinkedIn, Behance, GitHub (from `site_settings`)
- [x] Student email display
- [x] Copyright line with dynamic year
- [x] CV download button linking to Supabase Storage

### 3.1.3 Skeleton Loaders (`components/ui/Skeleton.tsx`)
- [x] `SkeletonCard` — matches ProjectCard dimensions
- [x] `SkeletonText` — single-line and multi-line variants
- [x] Use CSS animation `animate-pulse` (Tailwind built-in)

## 3.2 Homepage (`app/(public)/page.tsx`)

### Hero Section
- [x] Full-bleed background image via `next/image` with `priority` and `fill` props
- [x] Dark overlay gradient for text contrast
- [x] Student name (H1 — largest type on page)
- [x] Tagline subtitle (H2-level weight, not size)
- [x] Two CTA buttons:
  - Primary: `View My Work` → `/projects` (solid accent)
  - Secondary: `Download CV` → Supabase Storage URL (ghost/outlined)
- [x] Both buttons have `hover`, `focus-visible`, `active`, and `disabled` states
- [x] Hero image loads from `site_settings.hero_image_url`

### Featured Projects Grid
- [x] Fetch `projects WHERE is_featured = true AND is_published = true LIMIT 3` (server component)
- [x] Reusable `<ProjectCard>` component (see 3.3)
- [x] 1-col mobile, 2-col tablet, 3-col desktop grid
- [x] "View All Projects" link below grid

### Skills Strip
- [x] Horizontal scrolling row of skill icons/labels (AutoCAD, Revit, SketchUp, ArchiCAD, Adobe Suite, Hand Drafting)
- [x] Use Lucide icons where available, or SVG badges
- [ ] Subtle fade-in animation on scroll (CSS `@keyframes` or Intersection Observer)

### Testimonials (Optional)
- [ ] Render quotes if any exist in `site_settings` (keys: `quote_1_text`, `quote_1_author`)
- [x] Skip section entirely if no quotes configured

### ISR Revalidation
- [x] Add `export const revalidate = 3600` at top of file

## 3.3 ProjectCard Component (`components/projects/ProjectCard.tsx`)
- [x] Cover image with `next/image` — `object-cover` fill, lazy loading
- [x] Category badge (pill, styled by category)
- [x] Project title (2-line clamp)
- [x] Year label
- [x] Short description (2-line clamp)
- [x] Entire card is a link to `/projects/[slug]`
- [x] Card has `hover` state: subtle lift shadow + image scale (150ms ease)
- [x] Focus-visible outline on the card link
- [x] Skeleton variant exported as `ProjectCard.Skeleton`

## 3.4 Projects Gallery (`app/(public)/projects/page.tsx`)

### Filter Bar
- [x] Category tabs: All + each `PROJECT_CATEGORIES` constant
- [x] Tag filter pills (multi-select): each `PROJECT_TAGS` constant
- [x] Sort dropdown: Newest · Oldest · A–Z
- [x] Filter state reads from and writes to `?category=&tag=&sort=` URL params (use `useSearchParams`)
- [x] "Reset Filters" button — appears only when a filter is active
- [x] Mobile: filter pills wrap gracefully (no horizontal overflow)

### Project Grid
- [x] Fetch projects filtered by `searchParams` (server component passes params to query)
- [x] 1-col mobile, 2-col tablet, 3-col desktop
- [x] Empty state: centered message "No projects found" + Reset button
- [ ] Pagination: simple Prev/Next buttons with `?page=` param (12 projects per page)
- [x] All images lazy-loaded

### ISR Revalidation
- [x] Add `export const revalidate = 1800`

## 3.5 Project Detail Page (`app/(public)/projects/[slug]/page.tsx`)

### Header Section
- [x] Project title (H1)
- [x] Category badge
- [x] Year / semester label
- [x] Software tags (pills)

### Hero Image
- [x] Full-width `next/image` with `priority` (above fold)
- [x] Aspect ratio: 16/9 or natural image ratio (use `sizes` prop for responsive)

### Image Lightbox Gallery
- [x] Thumbnail grid of additional `images[]`
- [x] On thumbnail click: open `yet-another-react-lightbox`
- [x] Lightbox: keyboard navigation (? ? arrows, Escape to close)
- [x] Accessible: focus trap inside lightbox when open

### Project Description
- [x] Render `description` (Markdown) via `react-markdown` + `remark-gfm`
- [x] Style: prose typography, 60-75 char line width, 1.5x line height
- [ ] Heading hierarchy starts at H3 (H1/H2 are used for page layout)

### Technical Specs Table
- [x] Render `tech_specs` JSONB as key-value table
- [x] Use monospace font for spec values
- [x] Table is horizontally scrollable on mobile

### PDF Download
- [x] Render "Download Drawing Set" button only if `pdf_url` is set
- [x] Opens `pdf_url` in new tab
- [x] Icon: `lucide-react` Download icon

### Navigation
- [ ] Previous project arrow (link to previous slug by created_at)
- [ ] Next project arrow (link to next slug by created_at)
- [x] "? Back to Gallery" text link at top

### View Count
- [x] On page mount (client component island), call `/api/increment-view` with slug
- [x] No visible count displayed to visitors (admin-only stat)

### Metadata
- [x] Dynamic `generateMetadata()` function: unique title, description from `short_desc`, OG image from `cover_image`
- [x] `generateStaticParams()` to pre-generate all published project slugs at build time

### ISR Revalidation
- [x] Add `export const revalidate = 1800`

## 3.6 About Page (`app/(public)/about/page.tsx`)
- [x] Fetch from `about`, `education`, `skills` tables (server component)
- [x] Profile photo: `next/image` circular crop, 200x200px display
- [x] Bio text: rendered Markdown (same prose styles as project description)
- [x] Education Timeline: chronological list - institution, program, years, optional GPA
- [x] Skills Matrix: grouped by category, each skill shows name + proficiency bar (1-5 level -> 20%-100% fill)
- [x] CV Download button prominently placed (links to `about.cv_url`)
- [x] ISR: `export const revalidate = 3600`

## 3.7 Contact Page (`app/(public)/contact/page.tsx`)
- [x] `react-hook-form` + `zod` schema validation (client component)
- [x] Fields: Name (required), Email (required, email format), Subject (select dropdown), Message (required, min 10 chars)
- [x] Honeypot field: hidden `<input name="website" tabIndex={-1} />` - reject on server if filled
- [x] Submit button: shows spinner inline while submitting, disabled during request
- [x] Success state: success toast + form reset
- [x] Error state: error toast with retry option
- [x] Fallback: student email and LinkedIn link displayed below form
- [x] Form submits to `/api/contact` route

## ✅ Phase 3 Done When:
All 5 public pages render correctly on mobile and desktop, data loads from Supabase, filters update URL params, lightbox works with keyboard nav, and `pnpm build` succeeds.

---

---

# PHASE 4 — Admin Panel — Auth & Shell
**Status:** 🔄 IN PROGRESS  
**Goal:** Admin area is fully protected, session management works, and the admin layout shell is in place.

## 4.1 Login Page (`app/login/page.tsx`)
- [x] Email + password form
- [x] Submit: call `supabase.auth.signInWithPassword()`
- [x] On success: redirect to `/admin`
- [x] On error: display inline error message
- [x] "Forgot password" link (calls `supabase.auth.resetPasswordForEmail()`)
- [x] Page is publicly accessible (no auth guard)
- [x] Loading state on submit button

## 4.2 Admin Auth Guard (`app/admin/layout.tsx`)
- [x] Server component: check session using server Supabase client
- [x] If no session: `redirect('/login')` *(enforced when Supabase env vars are configured)*
- [x] If session: render admin layout + children
- [x] This is the ONLY place the auth check is needed (all `/admin/*` routes inherit it)

## 4.3 Admin Layout Shell (`components/layout/AdminSidebar.tsx`)
- [x] Sidebar navigation links:
  - Dashboard `/admin`
  - Projects `/admin/projects`
  - About Page `/admin/about`
  - Messages `/admin/messages` (with unread count badge)
  - Settings `/admin/settings`
- [x] Logout button at bottom: calls `supabase.auth.signOut()` → redirects to `/login`
- [x] Mobile: sidebar collapses into a top hamburger menu drawer
- [x] Active route is visually highlighted

## 4.4 Admin Dashboard Overview (`app/admin/page.tsx`)
- [x] Stat cards: Total Projects, Published, Drafts, Total Messages, Unread Messages, Total View Count
- [x] "Quick Add Project" button → `/admin/projects/new`
- [x] Recent messages table (last 5, link to `/admin/messages`)
- [x] All data fetched server-side with `cache: 'no-store'`

## ✅ Phase 4 Done When:
Visiting `/admin` without a session redirects to `/login`. After login, the admin dashboard renders with stats. Logout clears the session.

---

---

# PHASE 5 — Admin Panel — Content Management
**Status:** 🔲 PENDING  
**Goal:** The student can create, edit, delete, and publish projects entirely through the admin UI without touching code.

## 5.1 Projects List (`app/admin/projects/page.tsx`)
- [ ] Table with columns: Cover Thumbnail, Title, Category, Status (Published/Draft), View Count, Created Date, Actions
- [ ] Actions: Edit (→ `/admin/projects/[id]/edit`), Delete (confirm dialog), Toggle Published
- [ ] "New Project" button at top right
- [ ] Sort by Created Date descending (newest first)
- [ ] Delete: calls Supabase delete + also deletes associated Storage files
- [ ] Status toggle: instant optimistic update + Supabase patch

## 5.2 Project Form (Shared `components/admin/ProjectForm.tsx`)
Used by both Create and Edit pages — accept optional initial data prop.

### Basic Fields
- [ ] Title: text input (required)
- [ ] Slug: text input, auto-populated from title via `slugify()`, user can override; validate uniqueness on blur
- [ ] Short Description: textarea, max 160 chars with live char counter
- [ ] Category: select from `PROJECT_CATEGORIES` constants (required)
- [ ] Tags: multi-select checkboxes from `PROJECT_TAGS` constants
- [ ] Year / Semester: text input (e.g., "2025" or "2nd Year - Sem 2")

### Content Fields
- [ ] Full Description: Markdown editor — use a `<textarea>` with split preview pane (show rendered markdown side-by-side on desktop, toggle on mobile)
- [ ] Technical Specs: dynamic key-value pair builder — "Add Spec" button adds a row with key input + value input; existing rows can be deleted

### Toggles
- [ ] Featured: checkbox toggle (`is_featured`)
- [ ] Published: checkbox toggle (`is_published`)

### Image Upload (`components/admin/ImageUploader.tsx`)
- [ ] Drag-and-drop zone using native HTML drag events (no library needed for MVP)
- [ ] Also supports click-to-browse file picker
- [ ] Accepted types: JPG, PNG, WEBP — max 20MB per file
- [ ] On drop: upload each file to `project-images/{project_id}/` in Supabase Storage
- [ ] Show upload progress per file (percentage bar)
- [ ] After upload: display thumbnail grid of all uploaded images
- [ ] Cover Image Selector: radio-button overlay on each thumbnail to set as cover
- [ ] Delete button on each thumbnail: removes from Storage + updates `images[]` array

### PDF Upload
- [ ] Single file input for PDF — max 50MB
- [ ] Upload to `project-pdfs/{project_id}/` in Supabase Storage
- [ ] Show filename + "Remove" button if already uploaded

### Form Actions
- [ ] "Save as Draft" button: saves with `is_published = false`
- [ ] "Publish" button: saves with `is_published = true`
- [ ] Both buttons: disable during save, show inline spinner
- [ ] Success: toast notification + redirect to `/admin/projects`
- [ ] Validation: `react-hook-form` + `zod` schema covers all required fields

## 5.3 Create Project Page (`app/admin/projects/new/page.tsx`)
- [ ] Generates a new UUID for project ID before rendering (needed for Storage path)
- [ ] Renders `<ProjectForm />` with no initial data
- [ ] On submit: `INSERT INTO projects` with all form data

## 5.4 Edit Project Page (`app/admin/projects/[id]/edit/page.tsx`)
- [ ] Fetch project by ID server-side
- [ ] Renders `<ProjectForm />` pre-populated with existing data
- [ ] On submit: `UPDATE projects WHERE id = ?`

## 5.5 About Page Editor (`app/admin/about/page.tsx`)
- [ ] Bio: Markdown textarea + preview (same pattern as project description)
- [ ] Profile Photo: single image uploader → `profile/photo` in Supabase Storage
- [ ] CV PDF: single file uploader → `profile/cv.pdf` in Supabase Storage
- [ ] Education Timeline manager: list of entries with Add/Edit/Delete; each entry: institution, program, start_year, end_year, gpa, sort_order
- [ ] Skills manager: list of skills with Add/Edit/Delete; each: name, category select, level (1–5 select), sort_order
- [ ] Single "Save All Changes" button — upserts `about` row, bulk-replaces `education` and `skills`

## 5.6 Messages Inbox (`app/admin/messages/page.tsx`)
- [ ] Table: From, Subject, Date, Status (Read/Unread), Actions
- [ ] Click row or "View" action: expand or navigate to full message detail
- [ ] Mark as Read / Unread toggle
- [ ] Delete message (with confirmation)
- [ ] Unread messages visually distinct (bold row, colored dot indicator)
- [ ] Count badge in sidebar reflects unread count

## 5.7 Site Settings (`app/admin/settings/page.tsx`)
- [ ] Form fields for all `site_settings` keys: student name, tagline, email, LinkedIn URL, Behance URL
- [ ] Hero Image: single image uploader → `site-assets/hero.jpg`
- [ ] Featured Projects Picker: select up to 3 published projects (checkbox list) → sets `is_featured`
- [ ] SEO: default meta title, description, OG image upload
- [ ] Save button: upserts all settings rows in a single transaction

## ✅ Phase 5 Done When:
Student can: log in, create a project with images and specs, publish it, see it appear on the public gallery, edit it, and delete it — entirely through the UI with no code changes.

---

---

# PHASE 6 — API Routes & Email Integration
**Status:** 🔄 IN PROGRESS  
**Goal:** Contact form sends real emails, view counts increment reliably, and all API routes are secure.

## 6.1 Contact Form API Route (`app/api/contact/route.ts`)
- [x] Accept POST requests with body: `{ name, email, subject, message, website }` (website = honeypot)
- [x] Validate with Zod server-side (same schema as client)
- [x] Reject if `website` field is filled (honeypot hit - return 200 silently to not alert bots)
- [x] Rate limiting: track submissions by IP using a simple in-memory map (or Upstash Redis if available); reject with 429 if > 3 in 1 hour
- [x] Insert to `contact_messages` table via server Supabase client (service role)
- [x] Send email notification via Resend SDK:
  ```typescript
  import { Resend } from 'resend'
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'Portfolio <noreply@yourdomain.com>',
    to: process.env.CONTACT_FORM_TO_EMAIL!,
    subject: `New inquiry: ${subject}`,
    text: `From: ${name} (${email})\n\n${message}`,
  })
  ```
- [x] Return `{ success: true }` on success, `{ error: string }` on failure
- [x] Never expose internal error details to client

## 6.2 View Count API Route (`app/api/increment-view/route.ts`)
- [x] Accept POST with body: `{ slug: string }`
- [x] Call `supabase.rpc('increment_view_count', { project_slug: slug })` using service role key
- [x] Return `{ success: true }` always (fire-and-forget, don't block page render)
- [x] No auth required (public endpoint)

## 6.3 Client-Side View Increment (`components/projects/ViewTracker.tsx`)
- [x] `'use client'` component
- [x] `useEffect` with empty dep array: call `fetch('/api/increment-view', { method: 'POST', body: JSON.stringify({ slug }) })` once on mount
- [x] No retry logic - fire and forget
- [x] Import and render this in `app/(public)/projects/[slug]/page.tsx` as a client island

## ✅ Phase 6 Done When:
Submitting the contact form inserts a row in Supabase AND sends an email to the student. View counts increment on each project detail page visit.

---

---

# PHASE 7 — Filtering, SEO & Performance
**Status:** 🔲 PENDING  
**Goal:** Filters work with shareable URLs, every page has proper SEO metadata, and all performance targets are met.

## 7.1 URL-Based Filtering
- [ ] Gallery page reads `searchParams.category`, `searchParams.tag`, `searchParams.sort`, `searchParams.page`
- [ ] Supabase query built dynamically:
  ```typescript
  let query = supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)

  if (category) query = query.eq('category', category)
  if (tag) query = query.contains('tags', [tag])
  if (sort === 'oldest') query = query.order('created_at', { ascending: true })
  else if (sort === 'az') query = query.order('title', { ascending: true })
  else query = query.order('created_at', { ascending: false }) // newest default

  const { data } = await query.range(offset, offset + 11)
  ```
- [ ] Filter tab clicks use `router.push()` with updated search params (no full page reload)
- [ ] URL is shareable and bookmarkable — copy URL → paste in new tab → same filtered view

## 7.2 SEO Metadata
- [ ] Root `app/layout.tsx`: default `metadata` object with site title template, description, OG image
- [ ] Homepage: override metadata with `export const metadata` — pull from `site_settings`
- [ ] Gallery page: static metadata "Portfolio Projects | [Name]"
- [ ] Project detail: `generateMetadata()` returning title, description (`short_desc`), and OG image (`cover_image`)
  - OG image should be absolute URL (prefix with `NEXT_PUBLIC_SITE_URL`)
- [ ] About page: static metadata
- [ ] Contact page: static metadata
- [ ] All admin routes: `robots: { index: false }` to prevent indexing
- [ ] Add `<link rel="canonical">` on all public pages

## 7.3 Image Optimization
- [ ] All `<Image>` components use correct `sizes` prop for their grid slot (e.g., `"(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"`)
- [ ] Hero image: `priority={true}`, `quality={85}`
- [ ] Gallery thumbnails: `quality={75}`, lazy loading (no `priority`)
- [ ] Configure `next.config.js` to allow Supabase Storage hostname:
  ```javascript
  images: {
    remotePatterns: [{ hostname: '*.supabase.co' }]
  }
  ```

## 7.4 ISR & Caching
- [ ] Confirm `revalidate` export is set on all ISR pages (Phase 3 items)
- [ ] Admin pages: `export const dynamic = 'force-dynamic'` to prevent caching
- [ ] After admin saves changes, trigger `revalidatePath()` on relevant public routes

## 7.5 Performance Audit (Pre-Lighthouse)
- [ ] Run `pnpm build && pnpm start` and audit with Chrome DevTools Network tab
- [ ] Confirm no layout shift on hero image (set explicit width/height or use `fill` with a sized container)
- [ ] Confirm no render-blocking scripts
- [ ] Add `@vercel/analytics` `<Analytics />` component to root layout

## ✅ Phase 7 Done When:
Filtering updates URL params, all public pages have unique meta tags visible in browser devtools, `pnpm build` produces zero warnings about missing image `sizes` props.

---

---

# PHASE 8 — QA, Accessibility & Lighthouse
**Status:** 🔲 PENDING  
**Goal:** Meet all non-functional requirements: Lighthouse ≥ 90, WCAG 2.1 AA, cross-browser, mobile-first.

## 8.1 Visual Hierarchy Review
- [ ] Each screen uses only 3–4 distinct font sizes
- [ ] One clear primary CTA per screen (others are ghost/outlined)
- [ ] Related elements are visually grouped (proximity rule)
- [ ] Body text line length ≤ 75 characters (max-w applied to prose containers)
- [ ] Body text line height ≥ 1.5 (Tailwind: `leading-relaxed` or `leading-loose`)

## 8.2 Interactive States Audit
- [ ] Every button: `hover`, `focus-visible`, `active`, `disabled` states defined in Tailwind or CSS
- [ ] No `outline: none` without a custom visible focus ring replacement
- [ ] Submit buttons disable + show spinner immediately on click
- [ ] All transitions use `duration-150` or `duration-200` (no instant flashes)
- [ ] Skeleton loaders shown for project card grids (not spinners)

## 8.3 Responsive Design Check (Mobile-First)
- [ ] Test at 375px width: no horizontal scroll, all content readable
- [ ] Test at 768px (tablet): grid shifts to 2-col
- [ ] Test at 1280px (desktop): full 3-col grid, sidebar nav visible
- [ ] All click targets ≥ 44×44px (verify filter pills and icon buttons)
- [ ] Admin sidebar collapses on mobile into hamburger drawer

## 8.4 Dark Mode (if next-themes enabled)
- [ ] Background uses `#111827` (not pure black)
- [ ] Text uses `#e5e7eb` off-white (not pure white)
- [ ] Card elevation shown by lighter surface color, not shadows
- [ ] Accent colors are slightly de-saturated vs light mode
- [ ] Theme toggle button exists and is accessible
- [ ] `prefers-color-scheme` respected on first load

## 8.5 Accessibility Checklist
- [ ] All images have descriptive `alt` attributes (project images pull from admin-provided alt text field — if not added in Phase 5, add now)
- [ ] Lightbox is keyboard navigable and has a visible close button with `aria-label`
- [ ] Contact form fields all have associated `<label>` elements
- [ ] Admin tables have proper `<th scope="col">` headers
- [ ] Color contrast: run axe DevTools or Lighthouse — all text ≥ 4.5:1 ratio
- [ ] Focus order is logical (tab through page without using mouse)
- [ ] Skip-to-content link at top of page for screen readers

## 8.6 Cross-Browser Testing
- [ ] Chrome 100+ ✓
- [ ] Firefox 100+ ✓
- [ ] Safari 15+ ✓ (especially test `next/image` and lightbox)
- [ ] Mobile Safari iOS 15+ ✓
- [ ] Chrome Android 10+ ✓

## 8.7 Lighthouse Audit
- [ ] Run Lighthouse in Chrome DevTools on production build (`pnpm start`) for:
  - `/` (Homepage)
  - `/projects` (Gallery)
  - `/projects/[slug]` (Detail)
  - `/about`
- [ ] All 4 pages must score: Performance ≥ 90, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 90
- [ ] Fix any issues until all scores pass

## 8.8 Form & Edge Case Testing
- [ ] Contact form: submit with empty fields → validation errors shown
- [ ] Contact form: submit with honeypot filled → silently rejected
- [ ] Project gallery: no published projects → empty state shown
- [ ] Project detail: invalid slug → 404 page rendered (add `notFound()` call)
- [ ] Admin: try accessing `/admin` without session → redirect to `/login`
- [ ] Admin: upload file > 20MB → error message shown
- [ ] Admin: create project with duplicate slug → auto-appends `-2` suffix

## ✅ Phase 8 Done When:
All Lighthouse scores ≥ 90 on all 4 public pages. No axe accessibility violations. All interactive states are visible. Mobile layout at 375px is pixel-perfect.

---

---

# PHASE 9 — Deployment & Launch
**Status:** 🔲 PENDING  
**Goal:** The site is live on a real domain, all environment variables are configured in production, and the student can manage content independently.

## 9.1 Vercel Deployment Setup
- [ ] Push final code to GitHub `main` branch
- [ ] Connect GitHub repo to Vercel (import project)
- [ ] Configure framework preset: Next.js (auto-detected)
- [ ] Add all environment variables to Vercel Dashboard → Settings → Environment Variables:
  ```
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
  RESEND_API_KEY
  CONTACT_FORM_TO_EMAIL
  NEXT_PUBLIC_SITE_URL  ← set to https://yourdomain.com
  ```
- [ ] Trigger first deploy — confirm build succeeds in Vercel dashboard

## 9.2 Custom Domain (Optional)
- [ ] Purchase domain (Namecheap, GoDaddy, etc.)
- [ ] Add domain in Vercel → Settings → Domains
- [ ] Update DNS records at registrar (A record or CNAME as Vercel instructs)
- [ ] Wait for SSL certificate provisioning (auto by Vercel, usually < 5 min)
- [ ] Update `NEXT_PUBLIC_SITE_URL` env var to the new domain

## 9.3 Supabase Production Checklist
- [ ] Re-enable Email Confirmations in Supabase Auth settings
- [ ] Confirm RLS policies are active on all tables (test with anon key — cannot read drafts)
- [ ] Confirm Storage bucket policies allow public read
- [ ] Set up Supabase database backups (automatic on Pro, manual export on Free)

## 9.4 Resend Production Checklist
- [ ] Verify sending domain DNS records (SPF, DKIM) in Resend dashboard
- [ ] Send a test email via contact form on production — confirm delivery to student's inbox
- [ ] Check spam folder — add sending domain to SPF if landing in spam

## 9.5 Post-Launch Content Setup
- [ ] Student logs into `/admin` on production URL
- [ ] Uploads profile photo and CV PDF
- [ ] Updates bio, education, and skills via About editor
- [ ] Creates first 3–5 real projects with cover images
- [ ] Sets featured projects via Settings
- [ ] Updates hero image via Settings
- [ ] Verifies homepage looks correct with real content

## 9.6 Admin Onboarding Guide
- [ ] Create a simple `ADMIN_GUIDE.md` (or Notion page) for the student covering:
  - How to log in
  - How to add a new project (step-by-step with screenshots)
  - How to upload images
  - How to check contact messages
  - How to update the About page
  - What to do if locked out (Supabase password reset)

## 9.7 Final Verification
- [ ] Homepage loads in < 2s on mobile (test with Chrome DevTools throttled to "Fast 3G")
- [ ] All public pages return 200 status (no 404s or 500s)
- [ ] Contact form works end-to-end on production
- [ ] CV download works
- [ ] Admin login works on production URL
- [ ] Vercel Analytics is receiving events (check dashboard after first visits)

## ✅ Phase 9 Done When:
The site is live at its permanent URL, the student has logged in and added real content, the contact form delivers emails, and the admin guide is handed off.

---

---

# Appendix — Design Rules Quick Reference

> Apply these rules at every component and page. Review against them before marking any Phase 3–5 step complete.

## Visual Hierarchy
- Max 3–4 font sizes per screen; distinguish by weight, not just size
- Exactly one prominent primary CTA per screen; all others use ghost/outlined style
- Related elements closer together; unrelated elements separated by whitespace
- Prose max-width: 60–75 characters (`max-w-prose` in Tailwind = ~65ch)
- Body text line height: min 1.5 (`leading-relaxed` in Tailwind)
- Important text: ≥ 4.5:1 contrast ratio; metadata is dimmed

## Interactive States
- Every button and link: `hover` + `focus-visible` + `active` + `disabled`
- Never `outline: none` without a visible custom focus ring
- Network buttons: immediately disable + show inline spinner on click
- All transitions: `transition-all duration-150 ease-in-out` or `duration-200`
- Content blocks: skeleton screens, not full-page spinners

## Mobile-First Responsive
- Code mobile layout first (375px base), then `md:` and `lg:`
- All clickable targets: min 44×44px
- Side-by-side → stack vertically on mobile
- Secondary nav/filters → drawer on mobile, inline on desktop
- No horizontal scroll: all containers `max-w-full`, text `break-words`

## Dark Mode
- Background: `#111827` (not #000000)
- Elevation via lighter surface color, not shadows
- Body text: `#e5e7eb` (not #ffffff)
- Accent colors: slightly de-saturated vs light mode
- Respect `prefers-color-scheme`; provide manual toggle

## Styling
- Use only Tailwind config values (no arbitrary `text-[13px]` unless critically necessary)
- Use `clsx` + `tailwind-merge` via the `cn()` utility from `lib/utils.ts`
- Group Tailwind classes: layout → spacing → typography → colors → interactive
- No global CSS side-effects; scoped where needed

## Code Duplication
- Only abstract after seeing identical code in 3 places (Rule of Three)
- Two similar functions for different business reasons = keep them separate
- Magic strings and numbers → `lib/constants.ts` immediately
- Test setup: prefer explicit duplication over generic helpers

---

*Build Plan v1.0 — Architectural Portfolio · Stack: Next.js + Supabase*  
*Update this file after every completed step and phase.*
