"use client";

import { useRef, useState } from "react";
import {
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * A monotonically-increasing view of a scroll-driven progress value.
 *
 * Entrances built off this can never play in reverse — scrolling back up into
 * a pin doesn't undo an arrival. Widgets that have already landed with
 * checkboxes ticked or a form half-filled would otherwise fly back offscreen
 * the moment someone scrolls up to re-check something.
 */
export function usePeak(progress: MotionValue<number>) {
  const peak = useMotionValue(0);
  useMotionValueEvent(progress, "change", (v) => {
    if (v > peak.get()) peak.set(v);
  });
  return peak;
}

export type FlyInStyle = {
  opacity: MotionValue<number>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  scale: MotionValue<number>;
  rotateY: MotionValue<number>;
};

type FlyInOptions = {
  /** Window over `peak`, both in [0,1], this widget animates across. */
  from: number;
  to: number;
  /** Horizontal travel in px; sign gives the edge it arrives from. */
  x?: number;
  /** Vertical travel in px; positive rises up into place. */
  y?: number;
  /** rotateY in degrees at the start of the window. */
  rotateY?: number;
};

/**
 * A fly-in-and-settle transform set for one widget: opacity ramps in over the
 * first third of the window; position/scale overshoot past rest and settle by
 * the end, so it reads as arriving rather than easing flatly into place.
 * Returns MotionValues meant for a `motion.*` `style` prop — nothing here
 * triggers a React re-render, so this is safe to use on many widgets at once.
 */
export function useFlyIn(
  peak: MotionValue<number>,
  { from, to, x = 0, y = 70, rotateY = 0 }: FlyInOptions,
): FlyInStyle {
  const d = to - from;
  const opacity = useTransform(peak, [from, from + d * 0.35], [0, 1]);
  const posX = useTransform(peak, [from, to], [x, 0]);
  const posY = useTransform(peak, [from, from + d * 0.75, to], [y, -8, 0]);
  const scale = useTransform(peak, [from, from + d * 0.75, to], [0.88, 1.04, 1]);
  const rotY = useTransform(peak, [from, to], [rotateY, 0]);
  return { opacity, x: posX, y: posY, scale, rotateY: rotY };
}

/**
 * Flips true the first time `peak` crosses `threshold`, and stays true — a
 * one-shot cue for "this widget just landed" (e.g. playing a hover-state
 * preview once on arrival). A ref guards against `landed`'s closure going
 * stale inside the motion-value callback.
 */
export function useLandedOnce(peak: MotionValue<number>, threshold: number) {
  const [landed, setLanded] = useState(false);
  const landedRef = useRef(false);
  useMotionValueEvent(peak, "change", (v) => {
    if (v >= threshold && !landedRef.current) {
      landedRef.current = true;
      setLanded(true);
    }
  });
  return landed;
}
