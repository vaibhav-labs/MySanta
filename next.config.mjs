/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow Google profile photos (used by NextAuth Google provider)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  logging: {
    fetches: { fullUrl: false },
  },
}

export default nextConfig
