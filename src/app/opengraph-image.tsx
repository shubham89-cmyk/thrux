import { ImageResponse } from "next/og";
export const alt = "THRUX - Brands that break through.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#131510", color: "#f3f1e8", padding: "60px", fontFamily: "sans-serif" }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 25 }}><span style={{ fontWeight: 900 }}>THRUX</span><span style={{ fontSize: 16, color: "#cfed55" }}>MEDIA STUDIOS / A DIFFERENT POINT OF VIEW</span></div><div style={{ display: "flex", flexDirection: "column", marginTop: 65, fontSize: 112, fontWeight: 900, letterSpacing: -7, lineHeight: 1 }}><span>BRANDS THAT</span><span>BREAK THROUGH<span style={{ color: "#cfed55" }}>.</span></span></div><span style={{ fontSize: 22, marginTop: 42 }}>Branding. Campaigns. Digital storytelling.</span></div>, size);
}
