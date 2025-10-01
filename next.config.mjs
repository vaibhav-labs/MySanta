/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  // Suppress static generation warnings for API routes
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  // Enable HTTPS in development
  ...(process.env.NODE_ENV === 'development' && {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=0',
            },
          ],
        },
      ]
    },
  }),
};

export default nextConfig;