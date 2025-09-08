import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));

await jiti.import("./src/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  output: "standalone",
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
  async redirects() {
    return [
      ...(process.env.NEXT_PUBLIC_FEATURE_FLAG_HIDE_LEARN_BY_TOPIC_PAGE === "true"
        ? [
            {
              source: "/learn-by-topic",
              destination: "/",
              permanent: true,
            },
          ]
        : []),
    ];
  },
};

export default nextConfig;
