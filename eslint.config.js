import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "lib/**",
      "temp/**",
      "tests/fixtures/**",
      "*.cjs",
    ],
  },
  {
    files: ["**/*.ts"],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts"],
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./",
        },
      },
    },
    rules: {
      "import/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          "newlines-between": "always",
          groups: ["builtin", "external", "parent", "sibling", "index"],
          pathGroupsExcludedImportTypes: ["builtin"],
        },
      ],
    },
  }
);
