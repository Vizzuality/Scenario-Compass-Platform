import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_API_CREDENTIALS: z.string().regex(/;/, {
      message: "NEXT_PUBLIC_API_CREDENTIALS must be in the format 'username;password'",
    }),
    NEXT_PUBLIC_API_APP_NAME: z.string(),
    NEXT_PUBLIC_API_BASE_URL: z.url(),
    NEXT_PUBLIC_FEATURE_FLAG_HIDE_LEARN_BY_TOPIC_PAGE: z.stringbool().default(false),
  },
  runtimeEnv: {
    NEXT_PUBLIC_API_CREDENTIALS: process.env.NEXT_PUBLIC_API_CREDENTIALS,
    NEXT_PUBLIC_API_APP_NAME: process.env.NEXT_PUBLIC_API_APP_NAME,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_FEATURE_FLAG_HIDE_LEARN_BY_TOPIC_PAGE:
      process.env.NEXT_PUBLIC_FEATURE_FLAG_HIDE_LEARN_BY_TOPIC_PAGE,
  },
});
