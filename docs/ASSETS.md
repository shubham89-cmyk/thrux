# Assets and campaign attribution

## What is actually included

The v2 ZIP includes source code, eight downloaded source posters/reference images, designed fallback compositions, source IDs, an importer and new live-browser previews. Three fashion posters remain unavailable. The nearly black `bts-02` poster is retained for reference but excluded from the visible studio and collection gallery. Full original movies are not bundled.

Builds register existing local image posters without remote downloads. Run `npm run media:sync` explicitly to fetch or refresh public source posters. Files saved to `public/media/` are referenced through `src/content/media.generated.json`. The deployed page does not depend on expiring Google thumbnail URLs after that import.

## Sources

Root supplied by the user:
https://drive.google.com/drive/folders/1wclfZB2wHZFuewPPehRwkF_Hmq5UILtP

Folders used in the source manifest:

- Fashion Campaign: `1G2fx1FjWDwmFTAGJ-fOQsxQmPSvjt7cB`
- ADDS: `1PZ-k61eXbRe4hHQziJFdB0ZSOJqHI4Tt`
- cafe: `1KViXOHrMus5AmBZNXnR2vcGikXXF74cB`
- BTS: `1I3pBNnfO6rHCmhxlBux20wtbiHcPLaAp`
- Thrux - Logo and Concept: `1wHnTCtjXz54ZGYHh7aloIQL1JcjV-POX`

The brand listing contains a JPG reference and a concept MP4. The website uses the concept video only through a deliberate click-to-load Google Drive player. Playback/accessibility depend on the original asset. It is labelled a **concept film**, not an agency showreel.

TMS - Work Profile contains additional brand-named folders, but its relationship to Thrux and the underlying credits have not been verified. No TMS client list, claims or assets have been copied into the site.

## Import and replacement

```bash
npm run media:sync
npm run media:check
```

The importer uses public viewing/download endpoints, a nine-second per-request timeout, three workers, a 12 MB per-image cap and file-signature checks. It rejects login/error HTML instead of saving it with an image extension. Unsupported or unavailable media yields a labelled fallback.

For manually prepared posters, use one of these extensions: `.webp`, `.jpg`, `.png`. Matching file keys:

| Key | Intended use |
| --- | --- |
| `fashion-01` | Fashion collection cover |
| `fashion-02`, `fashion-03` | Fashion details |
| `commercial-01` | Commercial collection detail |
| `commercial-02` | Commercial collection cover |
| `hospitality-01` | Hospitality collection detail |
| `hospitality-02` | Hospitality collection cover |
| `bts-01` | BTS cover, homepage studio panel and Studio page |
| `bts-02` | Reference only; its imported poster is nearly black |
| `brand-reference` | Supplied JPG reference; not automatically substituted for the header wordmark |
| `studio-ident` | Poster for the supplied concept film |

Example:

```text
public/media/fashion-01.webp
public/media/bts-01.jpg
```

After copying approved images in, run `node scripts/sync-media.mjs --offline` to register them. Review crops in context; change `object-position` on `.campaign-image` or extend the content model with per-image crop values as appropriate. Prefer approximately 1,600-2,000px wide posters rather than camera originals. Next.js image optimisation creates display derivatives at runtime/build delivery as applicable.

## Review each campaign before launch

Confirm the actual client/project name, the exact role of Thrux and any collaborators, whether the work was produced before rebranding, talent/client publication permission, music/voice rights and any necessary credits. Add a real brief and creative explanation. Include outcomes only with an approved, sourced metric and measurement period.

The current portfolio titles are editorial labels for collections, not claims that a named client commissioned a named project. No fake ROI, award, reach or testimonial has been added.

## Logo

The header/footer are provisional text treatments. They are not a reconstruction of the supplied JPG wordmark. Replace the header in `src/components/header.tsx`, the footer treatment in `footer.tsx`, and the favicon/social artwork only after receiving an approved production asset. Preserve the master logo and keep minimum-size/clear-space rules supplied by the client.

## Videos

Full original films are not fetched into Git. For production use, prefer a prepared, captioned, web-optimised file on the client's media host. Replace the existing Drive player component with a native `<video controls playsInline preload="none" poster="...">` and captions once those assets are available. Keep playback user initiated and account for mobile bandwidth.

## Font handling

Manrope Variable and Instrument Serif are installed through Fontsource and served with the built site, with system fallback fonts. No external font service is contacted by the page. Both families use the SIL Open Font License; copies are in `docs/FONT_LICENSES.txt`. If the client supplies a licensed display font, verify its web-use rights separately before adding it.
