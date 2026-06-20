import { FlatCompat } from "@eslint/eslintrc";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  {
    ignores: [".next/**", "node_modules/**", "public/sw.js"],
  },
  ...nextVitals,
  ...nextTypescript,
  ...compat.extends("plugin:@tanstack/eslint-plugin-query/recommended"),
  prettier,
];

export default config;
