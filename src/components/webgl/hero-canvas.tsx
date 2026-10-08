"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { canRunWebGL } from "@/lib/motion";
import { CampaignMedia } from "@/components/media";

const ThruxScene = dynamic(() => import("./thrux-scene").then(m => m.ThruxScene), {
  ssr: false,
  loading: () => <div className="webgl-fallback-shell" />,
});

/** Immersive WebGL hero with graceful poster fallback. */
export function HeroCanvas() {
  const [mode, setMode] = useState<"loading" | "webgl" | "fallback">("loading");

  useEffect(() => {
    setMode(canRunWebGL() ? "webgl" : "fallback");
  }, []);

  if (mode !== "webgl") {
    return (
      <div className="hero-media hero-media-fallback" aria-hidden="true">
        <CampaignMedia mediaKey="commercial-02" alt="" tone="commercial" words={["MAKE", "FEEL"]} priority />
      </div>
    );
  }

  return (
    <div className="hero-media hero-media-webgl" aria-hidden="true">
      <ThruxScene />
      <div className="hero-media-grain" />
    </div>
  );
}
