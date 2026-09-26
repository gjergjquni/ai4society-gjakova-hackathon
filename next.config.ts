import type { NextConfig } from "next";
import path from "path";

function resolveBackendOrigin(): string {
  const fallback = "http://127.0.0.1:8000";
  const raw = process.env.BACKEND_URL?.trim().replace(/^['"]|['"]$/g, "");
  if (!raw) return fallback;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, "");
}

const backendOrigin = resolveBackendOrigin();

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendOrigin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
