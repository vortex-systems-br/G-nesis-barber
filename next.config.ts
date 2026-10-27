import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname), // raiz = pasta do projeto
  },
  async headers() {
    // Só em produção: em dev, "immutable" fazia o browser guardar frames antigos
    if (process.env.NODE_ENV !== "production") return [];

    return [
      {
        source: "/frames/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;