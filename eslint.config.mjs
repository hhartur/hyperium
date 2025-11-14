import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 👇 bloco de ignores
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "lib/generated/**",
    ],
  },

  // 👇 ADICIONE SUAS RULES AQUI
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { "varsIgnorePattern": "^_" }
      ],
      "react/no-unescaped-entities": "off"
    },
  },
];

export default eslintConfig;
