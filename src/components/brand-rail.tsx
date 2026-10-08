import Image from "next/image";
import { brands } from "@/content/brands";
import generated from "@/content/media.generated.json";

type MediaEntry = { src: string; sourceId: string; importedAt: string };
const media = generated as Record<string, MediaEntry>;

function BrandChip({ name, note, mediaKey, initial }: { name: string; note: string; mediaKey?: string; initial: string }) {
  const src = mediaKey ? media[mediaKey]?.src : undefined;
  return <div className="brand-chip">
    <div className="brand-chip-mark">
      {src
        ? <Image src={src} alt="" fill sizes="48px" className="campaign-image" />
        : <span className="brand-initial" aria-hidden="true">{initial}</span>}
    </div>
    <div><strong>{name}</strong><span>{note}</span></div>
  </div>;
}

export function BrandRail() {
  const loop = [...brands, ...brands];
  return <section className="brand-rail" aria-label="Selected brands">
    <div className="brand-rail-head">
      <span className="eyebrow">SELECTED BRANDS / COLLABORATIONS</span>
      <p>Marks from the supplied studio archive. Drop approved client logos into public/media/brands to replace these tiles.</p>
    </div>
    <div className="brand-rail-viewport" style={{ overflow: "hidden" }}>
      <div className="brand-track">
        {loop.map((brand, index) => <BrandChip key={`${brand.key}-${index}`} name={brand.name} note={brand.note} mediaKey={brand.mediaKey} initial={brand.initial} />)}
      </div>
    </div>
  </section>;
}
