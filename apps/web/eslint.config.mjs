import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tsParser from "@typescript-eslint/parser";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    ".open-next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
    "patch-handler.js",
  ]),
  {
    rules: {
      // TypeScript strict rules
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": ["warn", {
        prefer: "type-imports",
      }],

      // React best practices
      "react/self-closing-comp": "warn",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-key": "error",
      "react/no-unescaped-entities": "off",

      // General code quality
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-duplicate-imports": "warn",
      "prefer-const": "warn",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["warn", "multi-line"],
      "no-nested-ternary": "warn",

      // Import ordering
      "import/order": "off", // Managed by Prettier or manually
      "react-compiler/react-compiler": "off",
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "react-hooks/capitalized-calls": "off",
      "react-hooks/immutability": "off",
      "react-hooks/preserve-manual-memoization": "off",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
    },
  },
]);

export default eslintConfig;
