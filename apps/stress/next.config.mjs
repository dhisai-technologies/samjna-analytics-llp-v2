import path from "node:path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@packages/ui", "@packages/utils", "@packages/config"],
  output: "standalone",
  images: {
    domains: ['samjnaazure.blob.core.windows.net'],
  },
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
};

export default nextConfig;
