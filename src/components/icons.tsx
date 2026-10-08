import type { SVGProps } from "react";
type Props = SVGProps<SVGSVGElement>;
export function Arrow({ className = "", ...props }: Props) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function ArrowRight(props: Props) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function Spark(props: Props) {
  return <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" {...props}><path d="M50 0 57 31 85 15 69 43 100 50 69 57 85 85 57 69 50 100 43 69 15 85 31 57 0 50 31 43 15 15 43 31Z" fill="currentColor" /></svg>;
}
export function Play(props: Props) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><path d="m9 5 11 7-11 7V5Z" fill="currentColor" /></svg>;
}
export function Close(props: Props) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>;
}
export function Plus(props: Props) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" /></svg>;
}
