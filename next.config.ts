import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Spend It All is currently fully prerenderable. Exporting static assets keeps
  // the development preview lightweight and avoids requiring a Worker runtime.
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
