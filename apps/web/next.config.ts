import type { NextConfig } from "next";

const apiOrigin = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/learn", destination: "/diseases", permanent: true },
      { source: "/learn/:path*", destination: "/diseases/primers/:path*", permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${apiOrigin}/:path*`,
      },
    ];
  },
};

export default nextConfig;
