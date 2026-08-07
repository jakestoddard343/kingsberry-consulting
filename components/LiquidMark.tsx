"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { brandMarkSvg } from "@/lib/brand-mark";
import BrandMark from "./BrandMark";
import * as THREE from "three";

/**
 * The brand mark in liquid metal.
 *
 * The mark is rasterised to a canvas texture, then a fragment shader warps the
 * sample coordinates with animated fbm noise and shades the result off the
 * gradient of a blurred copy's alpha — which gives a surface normal, and
 * therefore fake chrome, without any geometry.
 *
 * The blurred copy is what makes this work: flat artwork has constant alpha
 * across its interior, so differencing the sharp version alone would shade only
 * the outline.
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uTex;
  uniform sampler2D uBlur;
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uHover;
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform vec3  uColorC;

  varying vec2 vUv;

  // Ashima-style simplex noise, 2D.
  vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                            + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                            dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float total = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      total += snoise(p) * amp;
      p *= 2.02;
      amp *= 0.5;
    }
    return total;
  }

  // Warped sample coordinate, shared by the mask and the height field.
  vec2 warpUv(vec2 uv, float t) {
    vec2 warp = vec2(
      fbm(uv * 2.6 + vec2(0.0, t * 0.16)),
      fbm(uv * 2.6 + vec2(4.7, -t * 0.13))
    );

    // Pull the surface toward the cursor so it reads as a viscous liquid.
    vec2 toMouse = uv - uMouse;
    float pull = exp(-dot(toMouse, toMouse) * 9.0) * uHover;

    return uv + warp * (0.026 + pull * 0.05) - toMouse * pull * 0.13;
  }

  // Coverage: the crisp glyph, used only as the alpha mask.
  float mask(vec2 uv, float t) {
    vec2 suv = warpUv(uv, t);
    if (suv.x < 0.0 || suv.x > 1.0 || suv.y < 0.0 || suv.y > 1.0) return 0.0;
    return texture2D(uTex, suv).a;
  }

  // Height: the blurred glyph plus rolling noise. A glyph's raw alpha is flat
  // across its interior, so differencing it yields a normal only at the edges —
  // the blurred copy gives the body a slope, and the fbm term keeps it moving.
  float height(vec2 uv, float t) {
    vec2 suv = warpUv(uv, t);
    if (suv.x < 0.0 || suv.x > 1.0 || suv.y < 0.0 || suv.y > 1.0) return 0.0;
    float base = texture2D(uBlur, suv).a;
    // Low frequency on purpose: the mark renders around 200px, so finer noise
    // lands below a pixel and the normals turn to speckle.
    float ripple = fbm(uv * 1.7 + vec2(t * 0.2, -t * 0.15)) * 0.5 + 0.5;
    return base * 0.82 + ripple * base * 0.34;
  }

  void main() {
    float t = uTime;
    float a = mask(vUv, t);

    if (a < 0.004) discard;

    // Finite differences on the height field give us a usable normal.
    float e = 4.0 / 512.0;
    float dx = height(vUv + vec2(e, 0.0), t) - height(vUv - vec2(e, 0.0), t);
    float dy = height(vUv + vec2(0.0, e), t) - height(vUv - vec2(0.0, e), t);
    vec3 n = normalize(vec3(-dx * 11.0, -dy * 11.0, 0.6));

    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 lightA  = normalize(vec3(-0.55, 0.72, 0.62));
    vec3 lightB  = normalize(vec3(0.68, -0.42, 0.55));

    float fres = pow(1.0 - max(dot(n, viewDir), 0.0), 2.4);
    float diffA = max(dot(n, lightA), 0.0);
    float diffB = max(dot(n, lightB), 0.0);
    float specA = pow(max(dot(reflect(-lightA, n), viewDir), 0.0), 42.0);
    float specB = pow(max(dot(reflect(-lightB, n), viewDir), 0.0), 26.0);

    // Chromatic banding across the normal reads as anisotropic metal.
    float band = sin(n.y * 3.2 + n.x * 1.9 + t * 0.45) * 0.5 + 0.5;

    vec3 col = mix(uColorA, uColorB, band);
    col = mix(col, uColorC, fres * 0.85);
    col += diffA * 0.42 * uColorB;
    col += diffB * 0.22 * uColorC;
    col += vec3(specA) * 1.25;
    col += uColorC * specB * 0.7;

    // Keep the interior from going muddy.
    col = pow(col, vec3(0.92));

    gl_FragColor = vec4(col, a);
  }
`;

/**
 * Rasterises the brand mark to canvas textures. Async because the SVG has to
 * decode first, so the caller gets null on the first frames and the mesh holds
 * off rendering until both textures exist.
 */
function useMarkTextures(size = 512) {
  const [tex, setTex] = useState<{
    sharp: THREE.CanvasTexture;
    blur: THREE.CanvasTexture;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();

    img.onload = () => {
      if (cancelled) return;
      const make = (blurPx: number) => {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        if (blurPx) ctx.filter = `blur(${blurPx}px)`;
        // Inset so the blurred copy has room to bleed without clipping.
        const pad = size * 0.1;
        ctx.drawImage(img, pad, pad, size - pad * 2, size - pad * 2);
        const t = new THREE.CanvasTexture(canvas);
        t.minFilter = THREE.LinearFilter;
        t.magFilter = THREE.LinearFilter;
        t.flipY = true;
        return t;
      };
      setTex({ sharp: make(0), blur: make(26) });
    };

    img.src =
      "data:image/svg+xml;charset=utf-8," +
      encodeURIComponent(brandMarkSvg("#ffffff", size));

    return () => {
      cancelled = true;
      img.onload = null;
    };
  }, [size]);

  return tex;
}

function Mark() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const hover = useRef(0);
  const target = useRef(0);
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));

  const loaded = useMarkTextures();
  const texture = loaded?.sharp ?? null;
  const blurred = loaded?.blur ?? null;

  const uniforms = useMemo(
    () => ({
      uTex: { value: texture },
      uBlur: { value: blurred },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      // Amethyst chrome, ramped off the brand purple: deep base, lavender
      // highlight, pale lilac on the fresnel rim.
      uColorA: { value: new THREE.Color("#4a0f8a") },
      uColorB: { value: new THREE.Color("#d3a4ff") },
      uColorC: { value: new THREE.Color("#f2ddff") },
    }),
    [texture, blurred],
  );

  useEffect(
    () => () => {
      texture?.dispose();
      blurred?.dispose();
    },
    [texture, blurred],
  );


  useFrame((state, delta) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.uTime.value += delta;

    // Map pointer (-1..1) into the plane's 0..1 UV space.
    mouse.current.set(
      state.pointer.x * 0.5 + 0.5,
      state.pointer.y * 0.5 + 0.5,
    );
    (u.uMouse.value as THREE.Vector2).lerp(mouse.current, 0.09);

    target.current = state.pointer.length() > 0.001 ? 1 : 0;
    hover.current += (target.current - hover.current) * 0.05;
    u.uHover.value = hover.current;
  });

  if (!texture || !blurred) return null;

  const scale = Math.min(viewport.width, viewport.height) * 0.92;

  return (
    <mesh scale={[scale, scale, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export default function LiquidMark({ className = "" }: { className?: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setReady(true);
  }, []);

  return (
    <div className={className}>
      {ready ? (
        <Canvas
          orthographic
          camera={{ position: [0, 0, 1], zoom: 1 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
          style={{ background: "transparent" }}
        >
          <Mark />
        </Canvas>
      ) : (
        <div
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center text-[#c77dff]"
        >
          <BrandMark className="h-full w-full" />
        </div>
      )}
    </div>
  );
}
