import eslint from "@eslint/js";
import globals from "globals";
import eslintVue from "eslint-plugin-vue";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default defineConfig([
  eslint.configs.recommended,
  globalIgnores(["generated/**"]), // Ignore generated sources
  {
    files: ["src/**/*.js", "src/**/*.vue"],
    languageOptions: {
      ecmaVersion: 2016,
      sourceType: "commonjs",
      globals: { ...globals.browser, ...globals.commonjs },
    },
  },
  eslintVue.configs["flat/essential"],
  eslintPluginPrettierRecommended,
]);
