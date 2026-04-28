# Product Requirements Document (PRD)
## Architectural Drafting Design Student Portfolio

**Version:** 1.0  
**Date:** April 28, 2026  
**Status:** Draft  
**Stack:** Next.js · Supabase

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Goals](#2-product-vision--goals)
3. [Target Users & Personas](#3-target-users--personas)
4. [Problem Statement](#4-problem-statement)
5. [Scope & Boundaries](#5-scope--boundaries)
6. [MVP Feature Set](#6-mvp-feature-set)
7. [Detailed Feature Specifications](#7-detailed-feature-specifications)
8. [Database Schema (Supabase)](#8-database-schema-supabase)
9. [Technical Architecture](#9-technical-architecture)
10. [Page & Route Map](#10-page--route-map)
11. [UI/UX Design Principles](#11-uiux-design-principles)
12. [Non-Functional Requirements](#12-non-functional-requirements)
13. [Post-MVP Roadmap](#13-post-mvp-roadmap)
14. [Success Metrics](#14-success-metrics)
15. [Risks & Mitigations](#15-risks--mitigations)

---

## 1. Executive Summary

This document defines the requirements for an online portfolio platform built for an **Architectural Drafting Design student**. The platform enables the student to professionally showcase technical drawings, CAD renderings, design projects, and case studies to professors, potential employers, and clients. Built on **Next.js** for the frontend and **Supabase** for backend services (database, authentication, and file storage), the system is designed to be fast, visually impactful, and self-managed by the student without developer intervention.

---

## 2. Product Vision & Goals

### Vision
A clean, professional online portfolio that communicates the student's technical competence and creative vision in architectural drafting — serving as a living resume and showcase hub.

### Goals

| # | Goal | Priority |
|---|------|----------|
| G1 | Showcase design projects with high-quality images and technical drawings | Must Have |
| G2 | Allow visitors to contact the student directly | Must Have |
| G3 | Let the student manage all content without touching code | Must Have |
| G4 | Establish professional credibility for job applications and academic review | Must Have |
| G5 | Be fast, responsive, and accessible across all devices | Must Have |
| G6 | Enable filtering and categorization of works by type or software used | Should Have |
| G7 | Track visitor engagement and project views | Nice to Have |

---

## 3. Target Users & Personas

### 3.1 Primary User — The Student (Admin)
- **Name:** The portfolio owner (architectural drafting student)
- **Goal:** Upload and manage projects, control presentation, attract opportunities
- **Tech Level:** Moderate — comfortable with web forms, not a developer
- **Needs:** Simple CMS-like admin dashboard, drag-and-drop uploads, easy editing

### 3.2 Secondary Users — Visitors (Public)

**Persona A: Hiring Manager / Firm Recruiter**
- Browsing to assess technical drafting skill and project breadth
- Wants: Clean layout, downloadable CV, contact form, project details (software used, scale, purpose)

**Persona B: Academic Reviewer / Professor**
- Reviewing coursework quality and progression
- Wants: Project descriptions, date/semester context, technical notes

**Persona C: Potential Client (Freelance)**
- Assessing capability for small residential or commercial drafting work
- Wants: Service types, past project examples, easy contact

---

## 4. Problem Statement

Architecture and drafting students often rely on generic platforms (Behance, Google Drive folders, PDF attachments) that fail to:
- Present technical drawings at proper resolution and scale context
- Communicate the process and intent behind each project
- Project a professional, branded identity
- Provide a direct, integrated contact workflow

This portfolio solves all of the above with a purpose-built, self-hosted solution.

---

## 5. Scope & Boundaries

### In Scope (MVP)
- Public-facing portfolio website
- Supabase-backed admin panel for content management
- Project/work upload with images and metadata
- About page, skills section, contact form
- Responsive design (mobile + desktop)

### Out of Scope (MVP)
- E-commerce / paid services booking
- Multi-user / team accounts
- Blog / article publishing
- Real-time collaboration tools
- 3D model viewer (post-MVP)

---

## 6. MVP Feature Set

### Feature Priority Matrix

| Feature | Priority | Complexity | Sprint |
|---------|----------|------------|--------|
| Public homepage with hero section | P0 | Low | 1 |
| Projects gallery page | P0 | Medium | 1 |
| Single project detail page | P0 | Medium | 1 |
| About / bio page | P0 | Low | 1 |
| Contact form (email via Supabase Edge Function) | P0 | Medium | 1 |
| Admin authentication (Supabase Auth) | P0 | Low | 1 |
| Admin: create / edit / delete projects | P0 | High | 2 |
| Image upload to Supabase Storage | P0 | Medium | 2 |
| Project categories & tags | P1 | Low | 2 |
| Filter/search on gallery | P1 | Medium | 2 |
| CV/Resume download button | P1 | Low | 1 |
| SEO metadata per page | P1 | Low | 2 |
| Analytics dashboard (view counts) | P2 | Medium | 3 |

---

## 7. Detailed Feature Specifications

### 7.1 Homepage (`/`)

**Purpose:** First impression — communicate identity and showcase selected work.

**Components:**
- **Hero Section:** Full-bleed background image (a featured project render), student name, tagline (e.g., "Architectural Drafting & Design"), CTA buttons: `View My Work` → `/projects`, `Download CV`
- **Featured Projects:** Grid of 3 hand-picked projects (pinned by admin)
- **Skills Strip:** Horizontal icon row — AutoCAD, Revit, SketchUp, ArchiCAD, Adobe Suite, hand drafting
- **Testimonials / Quotes:** Optional 1–2 academic or internship quotes (admin-editable)
- **Footer:** Social links (LinkedIn, Behance, GitHub), email, copyright

**Acceptance Criteria:**
- Hero image loads in < 2s (Next.js Image optimization)
- Featured projects pull from DB where `is_featured = true`
- Page scores ≥ 90 on Lighthouse performance

---

### 7.2 Projects Gallery (`/projects`)

**Purpose:** Display all published works in a browsable, filterable grid.

**Components:**
- Category filter tabs: All · Floor Plans · Elevations · 3D Renders · Site Plans · Conceptual Designs
- Tag filter pills (multi-select): AutoCAD · Revit · SketchUp · Hand-Drawn · Residential · Commercial
- Project cards: cover image, title, category badge, year, short description (truncated 2 lines)
- Sorting: Newest · Oldest · A–Z
- Empty state: "No projects found" with reset filter button
- Pagination or infinite scroll (configurable)

**Acceptance Criteria:**
- Filters update URL query params (`?category=floor-plans&tag=autocad`) for shareability
- Grid is 1-col on mobile, 2-col on tablet, 3-col on desktop
- Images use Next.js `<Image>` with lazy loading

---

### 7.3 Project Detail Page (`/projects/[slug]`)

**Purpose:** Full showcase of a single project with all technical details.

**Components:**
- **Header:** Project title, category badge, year/semester, software tags
- **Hero Image:** Primary cover image (full-width, high-res)
- **Image Gallery:** Lightbox carousel for additional images (floor plans, elevations, details)
- **Project Description:** Rich text (Markdown rendered) — intent, process, constraints
- **Technical Specs Table:** Scale, dimensions, software used, drawing type, project phase
- **PDF Attachment:** Link to download full drawing set (if uploaded)
- **Navigation:** Previous / Next project arrows
- **Back to Gallery** link

**Acceptance Criteria:**
- Slug is auto-generated from project title on creation
- Lightbox keyboard navigation (arrow keys, Escape to close)
- PDF download link works from Supabase Storage public URL
- View count increments on each visit (Supabase RPC)

---

### 7.4 About Page (`/about`)

**Purpose:** Humanize the student and communicate background.

**Components:**
- Profile photo
- Bio text (rich text, admin-editable)
- Education timeline (school, program, year, GPA optional)
- Skills matrix: grouped by category (Drafting Software, Design Tools, Soft Skills) with proficiency indicators
- Certifications / Awards list
- Download CV button (PDF stored in Supabase Storage)

**Acceptance Criteria:**
- All content editable from admin panel
- CV PDF link pulls from `settings` table in Supabase

---

### 7.5 Contact Page (`/contact`)

**Purpose:** Enable visitors to reach the student directly.

**Components:**
- Contact form fields: Name, Email, Subject (dropdown: Job Opportunity · Academic Inquiry · Freelance Project · Other), Message
- Submit button with loading state
- Success/error toast notifications
- Student's direct email and LinkedIn displayed as fallback

**Backend Flow:**
1. Form submits to Next.js API route `/api/contact`
2. API route saves message to `contact_messages` table in Supabase
3. Supabase Edge Function (or Resend API) sends email notification to student

**Acceptance Criteria:**
- Form validates all required fields client-side and server-side
- Honeypot field to reduce spam
- Rate limiting: max 3 submissions per IP per hour

---

### 7.6 Admin Dashboard (`/admin`)

**Purpose:** Allow the student to manage all portfolio content without code.

**Access:** Protected by Supabase Auth (email + password). Single-user.

**Sections:**

#### 7.6.1 Projects Management
- Table view of all projects (title, category, status, views, created date)
- Create New Project button
- Edit / Delete actions per row
- Toggle published/draft status

#### 7.6.2 Project Create / Edit Form
- Fields: Title, Slug (auto + editable), Short Description, Full Description (Markdown editor), Category (select), Tags (multi-select), Year/Semester, Technical Specs (key-value pairs), Featured toggle, Published toggle
- Image Upload: drag-and-drop multi-image uploader → Supabase Storage (`projects/{project_id}/`)
- Cover image selector (pick from uploaded images)
- PDF upload for drawing set
- Save as Draft / Publish button

#### 7.6.3 About Page Editor
- Edit bio text (Markdown)
- Upload profile photo
- Manage education timeline entries (add/edit/delete)
- Manage skills (add/edit/delete with category and level)
- Upload CV PDF

#### 7.6.4 Site Settings
- Student name, tagline, email
- Social media links
- Hero background image
- Featured projects picker (select up to 3)
- SEO: default meta title, description, OG image

#### 7.6.5 Messages Inbox
- Table of all contact form submissions
- Mark as read / unread
- Delete message
- Click to view full message detail

**Acceptance Criteria:**
- Admin pages are 100% inaccessible without active Supabase session
- All changes reflect on public site immediately (ISR revalidation or `cache: 'no-store'`)
- Image uploads limited to 20MB per file, accepted formats: JPG, PNG, WEBP, PDF

---

## 8. Database Schema (Supabase)

### Table: `projects`
```sql
CREATE TABLE projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  short_desc  TEXT,
  description TEXT,               -- Markdown
  category    TEXT NOT NULL,      -- 'floor-plan' | 'elevation' | '3d-render' | 'site-plan' | 'conceptual'
  tags        TEXT[],             -- ['autocad', 'revit', 'residential']
  year        TEXT,               -- '2025' or '2nd Year - Sem 2'
  tech_specs  JSONB,              -- { scale: '1:100', software: 'AutoCAD 2024', ... }
  cover_image TEXT,               -- Supabase Storage URL
  images      TEXT[],             -- Array of Storage URLs
  pdf_url     TEXT,               -- Storage URL for drawing set PDF
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  view_count  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `about`
```sql
CREATE TABLE about (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bio         TEXT,               -- Markdown
  photo_url   TEXT,
  cv_url      TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `education`
```sql
CREATE TABLE education (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  program     TEXT NOT NULL,
  start_year  TEXT,
  end_year    TEXT,              -- NULL if ongoing
  gpa         TEXT,
  sort_order  INTEGER DEFAULT 0
);
```

### Table: `skills`
```sql
CREATE TABLE skills (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,     -- 'drafting-software' | 'design-tools' | 'soft-skills'
  level       INTEGER,           -- 1–5 proficiency
  icon_slug   TEXT,              -- optional icon identifier
  sort_order  INTEGER DEFAULT 0
);
```

### Table: `contact_messages`
```sql
CREATE TABLE contact_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT,
  message     TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `site_settings`
```sql
CREATE TABLE site_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
-- Keys: student_name, tagline, email, linkedin_url, behance_url,
--       hero_image_url, seo_title, seo_description, seo_og_image
```

### Row Level Security (RLS) Policies
```sql
-- Projects: public read published only; admin full access
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published" ON projects FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Admin full access" ON projects USING (auth.role() = 'authenticated');

-- Contact messages: insert only for public; full access for admin
CREATE POLICY "Public insert" ON contact_messages FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin reads" ON contact_messages FOR SELECT USING (auth.role() = 'authenticated');
```

### Supabase Storage Buckets

| Bucket | Access | Purpose |
|--------|--------|---------|
| `project-images` | Public | Project photos and renders |
| `project-pdfs` | Public | Downloadable drawing sets |
| `profile` | Public | About page photo, CV PDF |
| `site-assets` | Public | Hero image, OG image |

---

## 9. Technical Architecture

### Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend Framework | Next.js 14+ (App Router) | SSR/ISR for SEO, file-based routing, image optimization |
| Language | TypeScript | Type safety, better DX |
| Styling | Tailwind CSS | Rapid, responsive UI |
| Backend / DB | Supabase (PostgreSQL) | Integrated auth, storage, realtime, RLS |
| Auth | Supabase Auth | Email/password for single admin user |
| File Storage | Supabase Storage | Images and PDFs with CDN delivery |
| Email | Resend (via API route) | Transactional email for contact form |
| Markdown | react-markdown + remark-gfm | Render project descriptions |
| Image Lightbox | yet-another-react-lightbox | Project gallery viewer |
| Deployment | Vercel | Native Next.js hosting, ISR support |
| Analytics | Vercel Analytics + custom view counter | Page views + project-level counts |

### Data Flow

```
Visitor Browser
    │
    ▼
Next.js (Vercel Edge / SSR)
    │  ├── Static pages (ISR) ─────────────────► Supabase DB (read)
    │  ├── /api/contact ──────────────────────► Supabase DB (insert) + Resend
    │  └── /admin/* (Server Components) ──────► Supabase DB (CRUD) + Storage
    │
Supabase
    ├── PostgreSQL Database
    ├── Auth (JWT sessions)
    └── Storage (CDN-backed)
```

### Project Directory Structure

```
/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                  # Homepage
│   │   ├── projects/
│   │   │   ├── page.tsx              # Gallery
│   │   │   └── [slug]/page.tsx       # Project detail
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   ├── admin/
│   │   ├── layout.tsx                # Auth guard
│   │   ├── page.tsx                  # Dashboard overview
│   │   ├── projects/
│   │   │   ├── page.tsx              # Projects list
│   │   │   ├── new/page.tsx          # Create form
│   │   │   └── [id]/edit/page.tsx    # Edit form
│   │   ├── about/page.tsx
│   │   ├── messages/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── contact/route.ts
│   │   └── increment-view/route.ts
│   └── layout.tsx                    # Root layout + metadata
├── components/
│   ├── ui/                           # Reusable primitives
│   ├── projects/                     # ProjectCard, ProjectGallery, etc.
│   ├── admin/                        # ImageUploader, MarkdownEditor, etc.
│   └── layout/                       # Header, Footer, AdminSidebar
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser client
│   │   ├── server.ts                 # Server client (cookies)
│   │   └── types.ts                  # Generated DB types
│   └── utils.ts
└── public/
```

---

## 10. Page & Route Map

| Route | Visibility | Rendering | Description |
|-------|------------|-----------|-------------|
| `/` | Public | ISR (1hr) | Homepage |
| `/projects` | Public | ISR (30min) | Gallery with filters |
| `/projects/[slug]` | Public | ISR (30min) | Project detail |
| `/about` | Public | ISR (1hr) | About page |
| `/contact` | Public | Static | Contact form |
| `/admin` | Private | Dynamic | Dashboard |
| `/admin/projects` | Private | Dynamic | Project management |
| `/admin/projects/new` | Private | Dynamic | Create project |
| `/admin/projects/[id]/edit` | Private | Dynamic | Edit project |
| `/admin/about` | Private | Dynamic | Edit about page |
| `/admin/messages` | Private | Dynamic | View contact messages |
| `/admin/settings` | Private | Dynamic | Site-wide settings |
| `/login` | Auth | Static | Admin login |

---

## 11. UI/UX Design Principles

### Visual Language
- **Aesthetic:** Minimal, architectural — white space is content, typography is structure
- **Color Palette:** Neutral base (white/off-white backgrounds), single accent color (charcoal or deep blue), project images provide all color energy
- **Typography:** Clean sans-serif for UI (Inter or DM Sans); monospace for technical spec labels
- **Grid:** 12-column, generous gutters — mirrors drafting grid sensibility

### Key UX Decisions
- Images are the hero — no cluttered sidebars or dense text near project imagery
- Navigation is minimal: Logo · Projects · About · Contact · (Admin icon if logged in)
- Mobile-first: touch-friendly filter pills, swipeable project gallery
- Loading states: skeleton screens for project cards, not spinners
- Transitions: subtle fade-ins on scroll (no heavy animations that distract from work)

### Accessibility
- WCAG 2.1 AA compliance target
- All images have descriptive `alt` text (admin-provided)
- Keyboard navigable lightbox and forms
- Sufficient color contrast (4.5:1 minimum)

---

## 12. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Lighthouse Performance | ≥ 90 (mobile + desktop) |
| Lighthouse Accessibility | ≥ 90 |
| Core Web Vitals (LCP) | < 2.5s |
| Time to First Byte (TTFB) | < 600ms |
| Image Load (hero) | < 2s on 4G |
| Uptime | 99.9% (Vercel + Supabase SLAs) |
| File Upload Size Limit | 20MB per image, 50MB per PDF |
| Supported Browsers | Chrome 100+, Firefox 100+, Safari 15+, Edge 100+ |
| Mobile Support | iOS 15+, Android 10+ |
| SEO | All public pages have unique meta title, description, OG image |

---

## 13. Post-MVP Roadmap

### Phase 2 — Enhanced Showcase
- **3D Model Viewer:** Embed Sketchfab models or Three.js viewer for 3D projects
- **Process Journal:** Step-by-step project development timeline with dated image uploads
- **Before/After Slider:** Compare draft sketches with final renders
- **Print-Optimized View:** CSS print stylesheet for project detail pages

### Phase 3 — Engagement & Growth
- **Analytics Dashboard:** Visitor stats, top-viewed projects, referral sources (Vercel Analytics integration)
- **Password-Protected Preview:** Share draft projects with a temporary link + password
- **Social Sharing Cards:** Auto-generated OG images using Vercel OG

### Phase 4 — Professional Upgrade
- **Services / Freelance Page:** Pricing tiers, service descriptions, booking inquiry form
- **Testimonials System:** Structured testimonials with name, role, photo
- **Multi-language Support:** English + Filipino (i18n with `next-intl`)
- **Custom Domain Email:** Integrate with student's own email domain

---

## 14. Success Metrics

| Metric | Definition | Target (3 months post-launch) |
|--------|------------|-------------------------------|
| Portfolio Visits | Unique visitors / month | 200+ |
| Project Views | Average views per project | 50+ |
| Contact Form Submissions | Inquiries received | 5+ |
| Admin Content Updates | Projects added/updated by student | Weekly cadence |
| CV Downloads | Download button clicks | 30+ |
| Mobile Traffic Share | % of sessions on mobile | > 40% |
| Bounce Rate | Single-page sessions | < 60% |

---

## 15. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Student loses admin password | Medium | High | Supabase "Reset Password" email flow; document credentials securely |
| Large image files slow page load | High | High | Enforce upload size limits; use Next.js Image with `quality={80}` and WebP conversion |
| Supabase free tier storage limits | Medium | Medium | Start on free tier; upgrade to Pro ($25/mo) when storage > 500MB |
| Spam via contact form | Medium | Low | Honeypot field + rate limiting + Supabase RLS on insert |
| Student unable to manage CMS independently | Low | High | Include admin onboarding guide; keep form UX simple |
| Slug conflicts on project create | Low | Medium | Auto-append numeric suffix on conflict (e.g., `my-project-2`) |

---

## Appendix A — Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...   # Server-only, never expose to client

# Email (Resend)
RESEND_API_KEY=re_xxxx
CONTACT_FORM_TO_EMAIL=student@email.com

# App
NEXT_PUBLIC_SITE_URL=https://portfolio.yourdomain.com
```

---

## Appendix B — Recommended Third-Party Libraries

| Package | Purpose |
|---------|---------|
| `@supabase/ssr` | Supabase client with cookie-based auth for Next.js App Router |
| `@supabase/supabase-js` | Core Supabase client |
| `yet-another-react-lightbox` | Project image lightbox / gallery |
| `react-markdown` + `remark-gfm` | Markdown rendering for project descriptions |
| `react-hook-form` + `zod` | Form validation (admin forms + contact form) |
| `resend` | Transactional email via API |
| `@vercel/analytics` | Visitor analytics |
| `lucide-react` | Consistent icon set |
| `clsx` + `tailwind-merge` | Conditional Tailwind class management |
| `next-themes` | Dark mode support (post-MVP optional) |

---

*Document Owner: Portfolio Development Team*  
*Last Updated: April 28, 2026*  
*Next Review: Upon MVP completion*
