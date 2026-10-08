import Link from "next/link";
import { ArrowRight, Spark } from "@/components/icons";
export default function NotFound() {
  return <section className="section not-found"><span className="eyebrow">404 / A LITTLE OFF SCRIPT</span><Spark /><h1>Wrong turn.<br />Right studio.</h1><p>This page has moved, or it never made the final cut.</p><Link href="/" className="button button-acid">Back to the good stuff <ArrowRight /></Link></section>;
}
