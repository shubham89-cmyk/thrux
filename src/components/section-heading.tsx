import Link from "next/link";
import { ArrowRight } from "./icons";
export function SectionHeading({ label, title, href, linkLabel }: { label: string; title: string; href?: string; linkLabel?: string }) {
  return <div className="section-heading"><div><span className="eyebrow">{label}</span><h2>{title}</h2></div>{href && <Link href={href} className="text-link">{linkLabel} <ArrowRight /></Link>}</div>;
}
