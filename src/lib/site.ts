/** The single source of truth for business details. No invented contact details. */
export const site = {
  name: "Thrux",
  fullName: "THRUX Media Studios",
  description: "Branding, campaigns and digital storytelling. A creative studio for brands that are not here to blend in.",
  ready: process.env.NEXT_PUBLIC_SITE_READY === "true",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, ""),
};

export function siteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
  try { return new URL(value); } catch { return new URL("http://localhost:3000"); }
}

export const navigation = [
  { href: "/work", label: "Work" },
  { href: "/expertise", label: "Expertise" },
  { href: "/studio", label: "The studio" },
];
