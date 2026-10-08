"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Arrow, Close } from "./icons";
import { navigation } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 20);
    handle(); window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);
  useEffect(() => {
    const node = dialog.current;
    if (open) { node?.showModal(); document.body.style.overflow = "hidden"; }
    else { node?.close(); document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 801px)");
    const handle = () => { if (mq.matches) setOpen(false); };
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);
  return <>
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <Link href="/" className="wordmark" aria-label="Thrux home">THRUX<span className="brand-dot" /><span className="wordmark-caption">MEDIA STUDIOS</span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navigation.map(item => <Link key={item.href} href={item.href} aria-current={pathname.startsWith(item.href) ? "page" : undefined}>{item.label}</Link>)}
      </nav>
      <Link className="button button-small header-cta" href="/contact">Let&apos;s talk <Arrow /></Link>
      <button ref={trigger} className="menu-toggle" aria-label="Open navigation" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(true)}><span /><span /></button>
    </header>
    <dialog ref={dialog} className="mobile-dialog" id="mobile-navigation" aria-label="Navigation" onCancel={() => setOpen(false)} onClose={() => { setOpen(false); trigger.current?.focus(); }} onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <div className="mobile-dialog-inner">
        <div className="mobile-dialog-top"><span className="eyebrow">THRUX / MENU</span><button className="icon-button" onClick={() => setOpen(false)} aria-label="Close navigation"><Close /></button></div>
        <nav aria-label="Mobile navigation">
          {[{ href: "/", label: "Home" }, ...navigation, { href: "/contact", label: "Let's talk" }].map((item, index) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}><span className="mono">0{index + 1}</span>{item.label}<Arrow /></Link>)}
        </nav>
        <p>Good things start with a conversation.</p>
      </div>
    </dialog>
  </>;
}
