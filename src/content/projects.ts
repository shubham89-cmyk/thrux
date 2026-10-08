export type Discipline = "All work" | "Campaigns" | "Commercial" | "Hospitality" | "Behind the scenes";
export type Project = {
  slug: string; number: string; title: string; subtitle: string; category: Exclude<Discipline, "All work">;
  label: string; media: string; gallery: string[]; tone: string; words: [string, string];
  description: string; overview: string; approach: string; details: string[]; source: string;
};

/** Editorial collection titles, not invented client names or campaign results.
 * Replace collection descriptions with client-approved briefs and production credits.
 * TMS work is deliberately excluded until the relationship and rights are confirmed.
 */
export const projects: Project[] = [
  {
    slug: "fashion-in-motion", number: "01", title: "A different kind of presence.",
    subtitle: "Fashion, through a different lens.", category: "Campaigns", label: "Fashion campaign selection",
    media: "fashion-01", gallery: ["fashion-02", "fashion-03"], tone: "fashion", words: ["IN", "FRAME"],
    description: "Fashion imagery with space for texture, character and a point of view.",
    overview: "A visual collection from the supplied fashion-campaign archive. The imagery leads: silhouettes, details, movement and the moments in between.",
    approach: "Let the visual language do the talking. This editorial presentation pairs generous full-frame imagery with quieter details, so the work has room to be seen.",
    details: ["Fashion campaign archive", "Campaign imagery", "Visual storytelling"],
    source: "Fashion Campaign",
  },
  {
    slug: "commercial-stories", number: "02", title: "More than a first impression.",
    subtitle: "Small moments. A bigger story.", category: "Commercial", label: "Commercial film selection",
    media: "commercial-02", gallery: ["commercial-01"], tone: "commercial", words: ["MAKE", "FEEL"],
    description: "A selection of commercial visuals from the studio's supplied work archive.",
    overview: "Commercial storytelling is about what stays with you. This collection brings together selected material from the supplied commercial-film folder.",
    approach: "A considered frame, an intentional cut, a detail worth noticing. The portfolio presentation puts the film language first, without inventing a campaign brief or performance claim.",
    details: ["Commercial archive", "Film-led storytelling", "Campaign visuals"], source: "ADDS",
  },
  {
    slug: "a-taste-of-place", number: "03", title: "Some places stay with you.",
    subtitle: "A taste of somewhere.", category: "Hospitality", label: "Cafe and hospitality selection",
    media: "hospitality-02", gallery: ["hospitality-01"], tone: "hospitality", words: ["STAY", "AWHILE"],
    description: "Food, atmosphere and the little things that make a place feel like itself.",
    overview: "A hospitality-focused selection from the supplied cafe archive. A place is more than its menu: it is also light, texture, people and atmosphere.",
    approach: "The presentation moves between an establishing view and a closer detail. It is a visual invitation to look again, with the final campaign story to be supplied by the client.",
    details: ["Hospitality archive", "Food and atmosphere", "Social-first visual content"], source: "cafe",
  },
  {
    slug: "inside-the-frame", number: "04", title: "The work behind the work.",
    subtitle: "Before the final frame.", category: "Behind the scenes", label: "Behind-the-scenes selection",
    media: "bts-01", gallery: [], tone: "bts", words: ["TAKE", "ONE"],
    description: "A closer look at the process, between the idea and the finished image.",
    overview: "Selected behind-the-scenes material from the supplied BTS archive. This is a window into the making, rather than an invented team biography or a list of unverified production credits.",
    approach: "Keep the process human. Show the setup, the experimentation and the moments that sit outside the final edit. Confirm contributor credits and releases before public launch.",
    details: ["Behind the scenes", "Production process", "Studio archive"], source: "BTS",
  },
];
export const disciplines: Discipline[] = ["All work", "Campaigns", "Commercial", "Hospitality", "Behind the scenes"];
export function getProject(slug: string) { return projects.find(project => project.slug === slug); }
