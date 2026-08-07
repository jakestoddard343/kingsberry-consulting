"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Pins a section and advances a step index from scroll position.
 *
 * Pacing is deliberate. At the original 34% of viewport height per step, a
 * five-step section was ~1500px — about four trackpad flicks — and a normal
 * scroll blew through the whole sequence, skipping steps outright. STEP_VH
 * gives each step enough distance to register, and TAIL_VH holds the finished
 * state on screen before the pin releases, so the last step is not gone the
 * instant it arrives.
 */
const STEP_VH = 50;
const TAIL_VH = 45;

type Options = {
  /** Scroll distance per step, as a percentage of viewport height. */
  stepVh?: number;
  /** Hold after the last step, so the finished state registers. */
  tailVh?: number;
};

export function usePinnedSteps(count: number, options: Options = {}) {
  const { stepVh = STEP_VH, tailVh = TAIL_VH } = options;
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(-1);
  const [progress, setProgress] = useState(0);
  // True once ScrollTrigger owns `active`, so timer fallbacks stand down.
  const [scrubbed, setScrubbed] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!sectionRef.current || !pinRef.current) return;

    const mm = gsap.matchMedia();

    // Pinning at narrow widths fights mobile browser chrome, so phones fall
    // back to whatever the caller does when `scrubbed` is false.
    mm.add("(min-width: 768px)", () => {
      gsap.registerPlugin(ScrollTrigger);
      setScrubbed(true);

      const total = count * stepVh + tailVh;

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${total}%`,
        pin: pinRef.current,
        pinSpacing: true,
        scrub: true,
        onUpdate: (self) => {
          // Steps consume the first count*STEP_VH of the pin; the remaining
          // tail leaves the completed state up without advancing anything.
          const stepped = Math.min(1, (self.progress * total) / (count * stepVh));
          setProgress(stepped);
          setActive(Math.min(count - 1, Math.floor(stepped * count)));
        },
      });

      return () => {
        st.kill();
        setScrubbed(false);
      };
    });

    return () => mm.revert();
  }, [count, stepVh, tailVh]);

  // ScrollTrigger captures the pinned element's height when the pin is created,
  // and writes it back as an inline height. That measurement happens on the
  // first render — while `scrubbed` is still false and callers are showing
  // their non-scrubbed fallback, which is a different height. Without this
  // refresh the section keeps the fallback's height forever, which on a
  // single-screen layout means it silently stops fitting the screen.
  useEffect(() => {
    if (!scrubbed) return;
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [scrubbed]);

  return { sectionRef, pinRef, active, setActive, progress, setProgress, scrubbed };
}
