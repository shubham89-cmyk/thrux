"use client";

import { useRef, type ReactNode, type PointerEvent as ReactPointerEvent } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";

export function Magnetic({ children, className = "", strength = 0.35 }: { children: ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || prefersReducedMotion() || !hasFinePointer() || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (event.clientY - (rect.top + rect.height / 2)) * strength;
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const leave = () => {
    if (ref.current) ref.current.style.transform = "translate3d(0,0,0)";
  };

  return (
    <div className={`magnetic-wrap ${className}`} ref={ref} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </div>
  );
}
