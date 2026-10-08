"use client";
import { useEffect, useRef, useState } from "react";
import { Close, Play } from "./icons";
/** Google content is loaded only after a deliberate click, never on initial page load. */
export function FilmButton({ id = "1OHz3GKJpu4sRtlZhiJRoR7agtKplCE-j", label = "Play studio ident", className = "" }: { id?: string; label?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) { dialog.current?.showModal(); document.body.style.overflow = "hidden"; }
    else { dialog.current?.close(); document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  return <>
    <button ref={trigger} onClick={() => setOpen(true)} className={`film-trigger ${className}`}><span className="play-circle"><Play /></span><span>{label}<small>THE THRUX CONCEPT FILM</small></span></button>
    <dialog ref={dialog} className="film-dialog" aria-label="Thrux concept film" onCancel={() => setOpen(false)} onClose={() => { setOpen(false); trigger.current?.focus(); }} onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <div className="film-dialog-content"><div className="film-dialog-top"><span className="eyebrow">THRUX / CONCEPT FILM</span><button className="icon-button" aria-label="Close film" onClick={() => setOpen(false)}><Close /></button></div>
        {open && <iframe src={`https://drive.google.com/file/d/${encodeURIComponent(id)}/preview`} title="Thrux brand concept video hosted on Google Drive" allow="autoplay; fullscreen" allowFullScreen referrerPolicy="no-referrer" />}
        <p>Hosted on Google Drive. Playback depends on the file&apos;s sharing permissions. <a href={`https://drive.google.com/file/d/${encodeURIComponent(id)}/view`} target="_blank" rel="noopener noreferrer">Open original film <span aria-hidden="true">&nearr;</span></a></p>
      </div>
    </dialog>
  </>;
}
