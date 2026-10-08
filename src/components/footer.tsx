import Image from "next/image";
import Link from "next/link";
import { Arrow, Spark } from "./icons";
import { site } from "@/lib/site";
import generated from "@/content/media.generated.json";

const brandSrc = (generated as Record<string, { src: string }>)["brand-reference"]?.src;

export function Footer() {
  return <footer className="site-footer">
    <div className="footer-intro">
      <span className="eyebrow"><span className="status-dot" /> OPEN FOR GOOD CONVERSATIONS</span>
      <Link href="/contact" className="footer-cta magnetic-link">LET&apos;S MAKE<br /><span>SOME NOISE.</span><Arrow /></Link>
    </div>
    <div className="footer-meta">
      <p>Independent minds.<br />Shared ambition.</p>
      <nav aria-label="Footer navigation">
        <Link href="/work">Work</Link><Link href="/expertise">Expertise</Link>
        <Link href="/studio">The studio</Link><Link href="/contact">Contact</Link>
      </nav>
      <div className="footer-socials">
        {site.instagram && <a href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram <Arrow /></a>}
        {site.linkedin && <a href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <Arrow /></a>}
        {site.email && <a href={`mailto:${site.email}`}>{site.email} <Arrow /></a>}
        {!site.instagram && !site.linkedin && !site.email && <Link href="/contact">Start something good <Arrow /></Link>}
      </div>
    </div>
    <div className="footer-logo">
      {brandSrc && <div className="footer-logo-mark"><Image src={brandSrc} alt="Thrux logo reference" fill sizes="180px" /></div>}
      <div className="footer-wordmark" aria-hidden="true">THRUX<Spark /></div>
    </div>
    <div className="footer-bottom">
      <span>&copy; {new Date().getFullYear()} THRUX Media Studios</span>
      <span>Made to stand apart.</span>
      <Link href="/privacy">Privacy</Link>
    </div>
    {!site.ready && <div className="preview-note"><span className="status-dot" /> DESIGN PREVIEW <span>Portfolio credits, service copy and contact details await client sign-off.</span></div>}
  </footer>;
}
