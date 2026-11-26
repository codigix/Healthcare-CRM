/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets a production build live beside a running `next dev` (which uses .next).
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: true,
  swcMinify: true,
  staticPageGenerationTimeout: 120,
  eslint: { ignoreDuringBuilds: true },
  // The codebase type-checks cleanly (`npm run typecheck`), so a type error now
  // fails the build instead of shipping a broken page.
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
    webpackBuildWorker: true,
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns'],
  },
};

module.exports = nextConfig;

