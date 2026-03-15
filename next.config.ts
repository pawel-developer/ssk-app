import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nwmmsmloyeaneezwnzvo.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "lookaside.fbsbx.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
