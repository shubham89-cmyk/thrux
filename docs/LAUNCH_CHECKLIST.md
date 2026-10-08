# Thrux launch checklist

## Required content approval

- [ ] Confirm whether the public business name is Thrux or THRUX Media Studios.
- [ ] Replace the provisional text treatment with the approved production logo.
- [ ] Confirm the three proposed service groups match actual offered services.
- [ ] Replace collection descriptions with accurate, approved campaign stories.
- [ ] Confirm project/client names, Thrux's role, collaborator credits and publication rights.
- [ ] Confirm whether any TMS-labelled material may be attributed to Thrux before adding it.
- [ ] Add verified people or client proof only if the client supplies it. Do not invent these.
- [ ] Supply actual public contact email, social URLs and optional WhatsApp number.
- [ ] Review the privacy notice, controller identity and actual retention practices.

## Media

- [ ] Run the media importer or add approved local files.
- [ ] No page still shows a design-placeholder warning.
- [ ] Check each desktop/mobile crop, image quality and meaningful alternative text.
- [ ] Verify the concept video plays and is accurately labelled.
- [ ] Add captions/transcripts before publishing any spoken video content.
- [ ] Do not commit large raw production films or confidential source material.

## Build and interaction validation

- [x] Install dependencies and include the generated lockfile. Use `npm ci` for repeat installs.
- [x] Run `npm run test` (24 logic/content/API tests).
- [x] Run `npm run typecheck` with the real dependencies installed.
- [x] Run `npm run build` successfully and check actual server output.
- [x] Test `/`, `/work`, every collection route, `/expertise`, `/studio`, `/contact`, `/privacy` on four screen widths. (A missing route still needs a final hosting check.)
- [x] Exercise work filters, combined search/filter results, empty-state reset and collection links in a hydrated browser.
- [x] Check the mobile menu, Escape handling and focus return on actual hydrated pages.
- [ ] Check the film dialog, full-screen playback, close button and keyboard focus.
- [ ] Check accordions with keyboard and pointer input.
- [x] Test reduced-motion settings, runtime preference changes and the emulated touch layout.
- [ ] Check Chrome, Safari and Firefox on representative desktop and mobile devices.
- [ ] Measure actual accessibility and performance. No Lighthouse/WCAG score has been claimed in the hand-off.

## Email, security and indexing

- [ ] Configure the three server-side email settings in the correct Vercel environment.
- [ ] Verify a real enquiry arrives at the business inbox and has the right reply-to address.
- [ ] Exercise errors and verify the site never claims a failed send succeeded.
- [ ] Confirm secrets are not in the repository/client bundle.
- [ ] Configure shared rate limiting or hosting firewall protections for production traffic.
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS URL.
- [ ] Set `NEXT_PUBLIC_SITE_READY=true` only after sign-off, then redeploy.
- [ ] Confirm final robots, sitemap, social card and canonical metadata.
- [ ] Configure the domain/HTTPS in Vercel and check the final deployment, not only the local preview.
