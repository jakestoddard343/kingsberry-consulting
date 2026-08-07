"use client";

import { Suspense, useEffect, useState } from "react";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

/**
 * The hero's animated field.
 *
 * ShaderGradient owns its own R3F canvas, so this stays isolated from the rest
 * of the page. It is mounted only after first paint and only on capable,
 * non-reduced-motion clients — the CSS gradient underneath is the real
 * background, and this layers on top of it when it can.
 */
export default function ShaderBackdrop() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Skip the WebGL cost on small screens, where it is mostly cropped anyway.
    if (window.innerWidth < 768) return;

    // Confirm a WebGL context is actually obtainable before mounting three.
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) return;
    } catch {
      return;
    }

    const id = window.requestIdleCallback
      ? window.requestIdleCallback(() => setEnabled(true), { timeout: 1200 })
      : window.setTimeout(() => setEnabled(true), 400);

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id as number);
      else window.clearTimeout(id as number);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Always-present base so the hero never renders as flat black. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 18% 8%, rgba(79,107,255,0.34) 0%, transparent 55%)," +
            "radial-gradient(90% 80% at 84% 22%, rgba(168,85,247,0.26) 0%, transparent 58%)," +
            "radial-gradient(120% 100% at 50% 100%, rgba(34,211,238,0.16) 0%, transparent 60%)," +
            "#04060d",
        }}
      />

      {enabled && (
        <div className="absolute inset-0 opacity-70 transition-opacity duration-1000">
          <Suspense fallback={null}>
            <ShaderGradientCanvas
              lazyLoad
              fov={40}
              pixelDensity={1}
              pointerEvents="none"
              style={{ position: "absolute", inset: 0 }}
            >
              <ShaderGradient
                control="props"
                type="waterPlane"
                animate="on"
                uTime={0}
                uSpeed={0.16}
                uStrength={1.6}
                uDensity={1.4}
                uFrequency={5.5}
                uAmplitude={0}
                positionX={0}
                positionY={0}
                positionZ={0}
                rotationX={50}
                rotationY={0}
                rotationZ={-60}
                color1="#0b1030"
                color2="#4f6bff"
                color3="#a855f7"
                reflection={0.1}
                cAzimuthAngle={180}
                cPolarAngle={80}
                cDistance={2.9}
                cameraZoom={9.1}
                lightType="3d"
                brightness={1.15}
                envPreset="city"
                // The page already carries a film-grain overlay; a second one
                // from the shader reads as compression noise.
                grain="off"
                toggleAxis={false}
                zoomOut={false}
                hoverState=""
              />
            </ShaderGradientCanvas>
          </Suspense>
        </div>
      )}

      {/* Vignette + bottom fade so text stays legible and the section blends out. */}
      <div className="absolute inset-0 bg-[radial-gradient(100%_70%_at_50%_45%,transparent_35%,rgba(4,6,13,0.55)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent via-[#04060d]/75 to-[#04060d]" />
    </div>
  );
}
