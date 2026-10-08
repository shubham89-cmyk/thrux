"use client";
import Image from "next/image";
import { useState } from "react";
import { Spark } from "./icons";
import generated from "@/content/media.generated.json";

type MediaEntry = { src: string; sourceId: string; importedAt: string };
const media = generated as Record<string, MediaEntry>;
export function CampaignMedia({ mediaKey, alt, tone = "fashion", words = ["IN", "FRAME"], priority = false, className = "" }: {
  mediaKey: string; alt: string; tone?: string; words?: [string, string]; priority?: boolean; className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const entry = media[mediaKey];
  const ready = Boolean(entry?.src) && !failed;
  return <div className={`campaign-media tone-${tone} ${className}`}>
    <div className="artwork-fallback" aria-hidden="true">
      <div className="poster-index">THRUX / CREATIVE EXPLORATIONS</div>
      <div className="poster-orbit orbit-one" /><div className="poster-orbit orbit-two" />
      <div className="poster-words"><span>{words[0]}</span><span>{words[1]}<Spark /></span></div>
      <span className="poster-note">A DIFFERENT POINT OF VIEW.</span><span className="poster-cross">+</span>
    </div>
    {ready && <Image src={entry.src} alt={alt} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 75vw, 65vw" preload={priority} className="campaign-image" onError={() => setFailed(true)} />}
    {!ready && <span className="media-placeholder-label">DESIGN PLACEHOLDER / MEDIA IMPORT PENDING</span>}
  </div>;
}
