# Thrux v2 quality report

Verified on 7 October 2026 against the real Next.js production server using Node.js 24 and headless Chromium 153.

| Check | Result | Scope |
| --- | --- | --- |
| Dependency installation | Passed | Pinned dependencies and a generated lockfile are included. |
| Production build | Passed | All routes compile and prerender; server routes compile successfully. |
| Full TypeScript check | Passed | Actual installed React, Next.js and Playwright types. |
| Logic/content/contact API tests | 24 passed | Validation, content paths, origin/body checks, provider success/failure handling. Email-provider responses are mocked. |
| Browser interaction and motion checks | 7 passed | Live canvas motion, filters/search/reset, collection navigation, pointer tilt/spotlight, reduced-motion initial/change behavior, local brief download and mobile-menu navigation/focus. |
| Responsive browser checks | 4 passed | Ten actual routes at each of 320, 390, 768 and 1440px widths: 40 page/screen combinations. |
| Horizontal overflow | None detected | Settled fonts and reduced-motion layout captures at all 40 combinations. |
| Browser JavaScript exceptions | None in the verified flows | Includes route navigation and repeated viewport changes. |
| Source poster import | 8 of 11 files retrieved | Three fashion posters use labelled fallbacks. The nearly black BTS poster is retained but excluded from visible selections. |

The four viewport checks run separately from the seven interaction checks. `docs/layout-checks.json` contains the actual viewport and content widths. Browser tests are reproducible with `npm run test:browser` after installing Playwright Chromium and building the site.

The previews are screenshots/recordings of the running, hydrated website, with its real CSS and JavaScript. They are not static rendering adapters or separate design mockups.

## Remaining launch work

- Supply the three fashion posters and confirm final media crops, credits and campaign copy.
- Replace or confirm the proposed header wordmark and business contact details.
- Configure real enquiry email delivery and verify receipt at the business inbox.
- Verify the Drive-hosted concept film's actual playback and captions.
- Check Safari, Firefox and representative real phones; no real-device performance or accessibility score is claimed.
- Deploy to Vercel, configure the domain and confirm production metadata/indexing.

No GitHub push, Vercel deployment or live email was performed during this update.
