/** Shared capability checks for immersive motion. */
export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hasFinePointer() {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function canRunWebGL() {
  if (typeof window === "undefined" || prefersReducedMotion()) return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function isCompactViewport() {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 800px)").matches;
}
