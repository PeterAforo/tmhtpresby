import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  // ── Core Next.js rules (includes React, React Hooks, and a11y subsets) ──
  ...compat.extends("next/core-web-vitals"),

  // ── Project-level overrides ──
  {
    rules: {
      // Prefer const wherever possible
      "prefer-const": "error",

      // Disallow unused variables — prefix with _ to intentionally ignore
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // Require explicit return types on exported functions/methods
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // Allow empty catch blocks when the variable is prefixed with _
      "no-empty": ["error", { allowEmptyCatch: false }],

      // Enforce consistent type assertions
      "@typescript-eslint/consistent-type-assertions": [
        "warn",
        { assertionStyle: "as", objectLiteralTypeAssertions: "allow-as-parameter" },
      ],

      // Disallow use of `any` — use `unknown` instead where needed
      "@typescript-eslint/no-explicit-any": "warn",

      // Next.js Image component should be used instead of <img>
      "@next/next/no-img-element": "warn",

      // Disallow synchronous methods that have async equivalents
      "no-sync": "off",

      // Consistent import ordering is handled by Prettier; keep rule off
      "sort-imports": "off",
    },
  },

  // ── Ignore patterns ──
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "public/**",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
    ],
  },
];

export default eslintConfig;
