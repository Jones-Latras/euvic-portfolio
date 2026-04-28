# Admin Guide

This guide is for maintaining the architectural portfolio after deployment.

## Log In

1. Open `/login` on the live site.
2. Enter the admin email and password configured in Supabase Auth.
3. After login, open `/admin`.

If login fails, reset the password from the Supabase dashboard under Authentication > Users.

## Add A Project

1. Go to `/admin/projects`.
2. Select `New Project`.
3. Fill in the title, short description, category, tags, year, and full Markdown description.
4. Add technical specs as key-value rows.
5. Upload project images. Choose one image as the cover.
6. Upload a PDF drawing set if one is available.
7. Select `Save as Draft` to keep it private or `Publish` to show it publicly.

Published projects appear in `/projects`. Featured projects appear on the homepage when selected in Settings.

## Edit Or Delete A Project

1. Go to `/admin/projects`.
2. Use `Edit` to update content, images, publication status, or featured status.
3. Use `Delete` only when the project should be removed permanently.

Deleting a project also removes its associated uploaded files when storage is configured.

## Update About Content

1. Go to `/admin/about`.
2. Update the bio using Markdown.
3. Upload a profile photo and CV PDF.
4. Add, edit, or remove education entries.
5. Add, edit, or remove skills.
6. Select `Save All Changes`.

## Check Messages

1. Go to `/admin/messages`.
2. Expand a row to read the full message.
3. Mark messages read or unread as needed.
4. Delete messages that no longer need to be kept.

Contact form submissions are also sent to the configured `CONTACT_FORM_TO_EMAIL` address when Resend is configured.

## Update Site Settings

1. Go to `/admin/settings`.
2. Update the student name, tagline, email, and social links.
3. Upload the homepage hero image.
4. Select up to three featured projects.
5. Update SEO title, description, and Open Graph image.
6. Save changes.

## Launch Checklist

Before sharing the site publicly:

1. Confirm all real portfolio content is published.
2. Confirm the CV download works.
3. Submit the contact form and confirm the email arrives.
4. Open `/`, `/projects`, `/about`, and `/contact` on mobile and desktop.
5. Confirm unpublished drafts do not appear publicly.
