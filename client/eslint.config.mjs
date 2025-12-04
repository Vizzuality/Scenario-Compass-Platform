import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

/**
 * -----------------------------------------------------------------------------
 * ESLint 9 & Next.js 16 Compatibility Fix
 * -----------------------------------------------------------------------------
 * We manually import the Next.js and React plugins here.
 *
 * CONTEXT: Attempting to load "next/core-web-vitals" via FlatCompat currently
 * causes a "TypeError: Converting circular structure to JSON".
 *
 * This occurs because the legacy ESLint 8 configuration structure used by
 * Next.js contains circular references (specifically in react-hooks) that
 * fail during the serialization process required by the FlatCompat utility.
 */
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";

// Reconstruct __dirname and __filename as they are not natively available
// in ES Modules (ESM) contexts.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize FlatCompat to translate legacy .eslintrc configurations for
// external libraries that do not yet support Flat Config.
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  js.configs.recommended,

  /**
   * ---------------------------------------------------------------------------
   * Manual Configuration Block
   * ---------------------------------------------------------------------------
   * Instead of using `compat.extends("next/core-web-vitals")`, we manually
   * map the plugins and spread their rules. This bypasses the serialization
   * layer that triggers the circular dependency error.
   */
  {
    plugins: {
      react: reactPlugin,
      "react-hooks": hooksPlugin,
      "@next/next": nextPlugin,
    },
    rules: {
      // Aggregate rule sets to replicate the behavior of "next/core-web-vitals"
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...hooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },

  /**
   * ---------------------------------------------------------------------------
   * External Libraries (Legacy Support)
   * ---------------------------------------------------------------------------
   * TanStack Query's legacy configuration structure is compatible with
   * FlatCompat and does not trigger circular errors, so we can load it
   * via the compatibility layer to save verbose manual configuration.
   */
  ...compat.extends("plugin:@tanstack/eslint-plugin-query/recommended"),

  {
    ignores: [".next/*", "node_modules/*"],
  },
];
