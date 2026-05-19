import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,

  {
    ignores: ["build/**", "node_modules/**"]
  },

  {
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  }
];