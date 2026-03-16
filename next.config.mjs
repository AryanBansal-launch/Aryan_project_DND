/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        dns: false,
        http: false,
        https: false,
        net: false,
        tls: false,
        dgram: false,
        fs: false,
      };
    }
    return config;
  },
  images: {
    // Configure allowed hostnames for Next.js Image Optimization
    remotePatterns: [
      ...(process.env.NEXT_PUBLIC_CONTENTSTACK_IMAGE_HOSTNAME
        ? [{ hostname: process.env.NEXT_PUBLIC_CONTENTSTACK_IMAGE_HOSTNAME }]
        : [
            { hostname: "images.contentstack.io" },
            { hostname: "*-images.contentstack.com" },
          ]),
      // Allow Google user profile images
      { 
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
