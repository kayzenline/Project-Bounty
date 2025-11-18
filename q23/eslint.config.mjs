import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";


export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "error",
      "no-unused-vars": "off",
    },
    languageOptions: { globals: globals.node }
  },
  tseslint.configs.recommended,
]);
