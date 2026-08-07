import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // three.js and its R3F wrappers ship untranspiled ESM that Next needs to compile.
  transpilePackages: ["three", "@react-three/fiber", "@shadergradient/react"],
};

export default nextConfig;
