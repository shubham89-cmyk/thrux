/**
 * Selected brand / collaboration marks for the home rail.
 * Drop approved logo files into public/media/brands/{key}.(webp|jpg|png)
 * or add Drive IDs in media-sources.json (folder TMS - Work Profile) and run media:sync.
 * Labels are visual credits only — no invented campaign results.
 */
export type Brand = {
  key: string;
  name: string;
  note: string;
  /** Optional local media key registered in media.generated.json */
  mediaKey?: string;
  initial: string;
};

export const brands: Brand[] = [
  { key: "brand-thrux", name: "THRUX", note: "Studio mark", mediaKey: "brand-reference", initial: "TX" },
  { key: "brand-fashion", name: "Fashion Campaign", note: "Culture & image", mediaKey: "commercial-02", initial: "FC" },
  { key: "brand-adds", name: "Commercial Film", note: "ADDS archive", mediaKey: "commercial-01", initial: "AD" },
  { key: "brand-cafe", name: "Hospitality", note: "Cafe stories", mediaKey: "hospitality-02", initial: "CA" },
  { key: "brand-bts", name: "Production", note: "Behind the frame", mediaKey: "bts-01", initial: "BT" },
  { key: "brand-ident", name: "Studio Ident", note: "Concept film", mediaKey: "studio-ident", initial: "SI" },
];
