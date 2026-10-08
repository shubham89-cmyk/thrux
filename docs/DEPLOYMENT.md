# Deploying Thrux

## Recommended first pass

Deploy as a private-review preview first. The implementation is intentionally useful without email credentials or client media binaries: the pages render, filters and forms are implemented, and media fallback areas are explicitly labelled. That is not the same as an approved production launch.

### 1. Install and validate locally

```bash
nvm install
nvm use
npm ci
cp .env.example .env.local
npm run test
npm run typecheck
npm run build
npm start
```

A generated lockfile is included. The v2 update passed a full production build and real-browser checks. Use `npm ci` to reproduce the pinned dependency set.

### 2. GitHub

Create a new private repository. Push the files from the directory containing `package.json`. Never upload `node_modules`, `.next` or `.env.local`. The existing `.gitignore` excludes these.

The supplied Drive IDs and folder names are present in the repository for repeatable import. Do not publish the repository publicly until the client approves that disclosure.

### 3. Vercel configuration

- Framework preset: Next.js
- Root directory: the directory containing `package.json`
- Node.js: 22.x
- Install command: `npm ci` (the lockfile is included)
- Build command: `npm run build`
- Output directory: Next.js default (`.next` managed by the framework)
- Initial `NEXT_PUBLIC_SITE_READY`: `false`

The `prebuild` step registers bundled local media in offline mode. It does not request Drive. Three fashion posters remain missing and use labelled fallbacks; supply matching prepared files before the final portfolio launch. Run `npm run media:sync` explicitly if you want to refresh the public source posters.

### 4. Live enquiries

Create or use the client's approved Resend account. Verify a domain owned by the client and configure:

```text
RESEND_API_KEY=<server-side key>
CONTACT_FROM=THRUX <website@verified-client-domain>
CONTACT_TO=<actual business inbox>
NEXT_PUBLIC_CONTACT_EMAIL=<actual public business email>
```

The angle-bracket values above are placeholders, not real addresses or supplied credentials. Add the values to the correct Vercel environment(s), then redeploy.

The site uses a plain-text Resend API request. It does not send an automatic confirmation email to the visitor and does not enrol anyone in marketing.

Test all of these manually:

1. Send a test enquiry to the configured business inbox.
2. Verify actual receipt, reply-to address and formatting. An API acceptance is not proof of inbox delivery.
3. Remove or invalidate the provider key in a preview deployment and confirm the error state is truthful.
4. Verify the local brief download is usable.
5. Confirm server logs do not contain the visitor's brief or credentials.

The endpoint includes an origin check, bounded JSON body, shared validation, a honeypot, idempotency and a best-effort in-memory rate limit. For reliable multi-instance throttling, configure the optional Upstash REST variables and/or Vercel firewall rules. The memory fallback alone is not a full anti-abuse system. If using a reverse proxy outside Vercel, ensure forwarded client-IP headers cannot be supplied by an untrusted caller.

### 5. Public launch

Replace draft copy and the provisional text wordmark. Confirm media rights and project attribution, particularly the relationship to TMS-labelled material (which is not included in the site). Supply the actual business controller/contact and approve the privacy notice. Do not use the implementation note as an unreviewed legal policy.

Set:

```text
NEXT_PUBLIC_SITE_URL=https://<your-final-domain>
NEXT_PUBLIC_SITE_READY=true
THRUX_STRICT_MEDIA=true
```

Use strict media mode only once all manifest entries exist locally. It deliberately rejects incomplete media imports. Redeploy after changing public environment values. Check robots, sitemap, Open Graph previews, contact delivery and actual browser rendering again.

## Troubleshooting

### The build reports missing images

Run `npm run media:sync` on your own computer. Public Drive links need to allow viewers to see/download the selected file. Commit the resulting `public/media/` files and `src/content/media.generated.json`. Alternatively, export approved poster images yourself, name them using the exact manifest keys and run:

```bash
node scripts/sync-media.mjs --offline
```

Set `THRUX_SKIP_MEDIA_SYNC=true` on Vercel once the site uses approved committed media.

### Vercel asks for a static output directory

You likely selected the wrong framework or root folder. This project is a Next.js application with a server contact endpoint, not a Vite site or a static HTML export. Use the Next.js preset.

### Email is not sent

Confirm all three server-only settings are present in the selected environment, the sender domain is verified, and the project was redeployed. Check provider-side delivery logs without posting API keys or visitor details publicly.

### Changes to public environment variables do not appear

`NEXT_PUBLIC_*` values are part of the client build. Redeploy after changing them.

### Preview notices are still visible

That is expected while `NEXT_PUBLIC_SITE_READY=false`. Do not remove them just to hide missing approvals: finish the content/asset review first.
