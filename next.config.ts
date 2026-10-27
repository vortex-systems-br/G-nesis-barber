import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async headers() {
    // Só em produção: em dev, "immutable" fazia o browser guardar frames antigos
    if (process.env.NODE_ENV !== "production") return [];

    return [
      {
        source: "/frames-v2/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;