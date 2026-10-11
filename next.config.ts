/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
    ],
  },

  // Proxy /api/* through the frontend's own domain so the auth cookie is
  // first-party. Safari (and every browser on iOS) blocks the cookie when the
  // API lives on a different site such as railway.app.
  async rewrites() {
    const backend = process.env.BACKEND_URL || "https://stockvest-be-production.up.railway.app";
    return [
      {
        source: "/api/:path*",
        destination: `${backend}/api/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;