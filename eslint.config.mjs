import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import sortClassMembers from "eslint-plugin-sort-class-members";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: "./tsconfig.json", // Specify your tsconfig.json path
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      import: importPlugin,
      "sort-class-members": sortClassMembers,
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
        },
      ],
      "sort-class-members/sort-class-members": [
        "error",
        {
          order: [
            "[static-methods]",
            "constructor",
            "[methods]",
          ],
          accessorPairPositioning: "getThenSet",
        },
      ],
      "eqeqeq": ["error", "always"],
      "no-implicit-coercion": ["error", { "boolean": true }]
    },
  },
];
