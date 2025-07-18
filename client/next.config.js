import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));

await jiti.import("./src/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  output: "standalone",
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
};

export default nextConfig;
