import eslint from "@eslint/js";
import globals from "globals";
import eslintVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default defineConfig([
  eslint.configs.recommended,
  {
    files: ["src/**/*.js", "src/**/*.vue"],
    languageOptions: {
      ecmaVersion: 2016,
      globals: { ...globals.browser },
    },
  },
  eslintVue.configs["flat/essential"],
  eslintPluginPrettierRecommended,
]);
