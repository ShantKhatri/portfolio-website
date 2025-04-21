import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['prashantkhatri.com',      
      // Add your Vercel Blob domain
      'gjvntlanwutavbwg.public.blob.vercel-storage.com',
      
      // You may want to make this more flexible for different environments
      // by using a pattern that matches all Vercel Blob domains
      'public.blob.vercel-storage.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Ensure correct MIME types
  headers: async () => {
    return [
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;