"use client";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="section not-found"><span className="eyebrow">A BRIEF INTERMISSION</span><h1>Not quite<br />the plan.</h1><p>Something did not load correctly. Let&apos;s try that again.</p><button className="button button-acid" onClick={reset}>Try again</button></section>;
}
