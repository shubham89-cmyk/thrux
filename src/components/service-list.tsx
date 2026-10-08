import Link from "next/link";
import { services } from "@/content/services";
import { Arrow, Plus } from "./icons";
export function ServiceList({ expanded = false }: { expanded?: boolean }) {
  return <div className="service-list">{services.map(service => <details className="service-row" key={service.id} open={expanded || undefined} id={service.id}>
    <summary><span className="service-number mono">/{service.number}</span><h3>{service.title}</h3><span className="service-preview">{service.eyebrow}</span><Plus /></summary>
    <div className="service-details"><p>{service.description}</p><ul>{service.items.map(item => <li key={item}>{item}</li>)}</ul><Link href={`/contact?service=${service.id}`} className="text-link">Let&apos;s make it happen <Arrow /></Link></div>
  </details>)}</div>;
}
