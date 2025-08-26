// eslint.config.ts
import js from "@eslint/js"
import globals from "globals"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import prettier from "eslint-plugin-prettier"

// (optional) tailwind plugin if you installed it earlier
// import tailwindcss from "eslint-plugin-tailwindcss"

export default tseslint.config(
  { ignores: ["dist"] },

  {
    // Base TS/JS rules
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      sourceType: "module"
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier
      // , tailwindcss
    },
    settings: {
      react: { version: "detect" }
      // tailwindcss: { callees: ["cn"], config: "tailwind.config.ts" }
    },
    rules: {
      // React + Hooks
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "react/jsx-uses-react": "off",             // using new JSX runtime
      "react/react-in-jsx-scope": "off",         // using new JSX runtime
      "react/jsx-boolean-value": ["warn", "never"],
      "react/self-closing-comp": "warn",
      "@typescript-eslint/no-explicit-any": "off",

      // JSX formatting-ish rules (ESLint side)
      "react/jsx-indent": ["warn", 2],
      "react/jsx-indent-props": ["warn", 2],
      "react/jsx-closing-bracket-location": ["warn", "line-aligned"],
      "react/jsx-first-prop-new-line": ["warn", "multiline"],
      "react/jsx-max-props-per-line": ["warn", { maximum: 1, when: "multiline" }],
      "react/jsx-curly-newline": ["warn", { multiline: "consistent", singleline: "consistent" }],
      "react/jsx-tag-spacing": ["warn", { beforeSelfClosing: "always", closingSlash: "never", beforeClosing: "never" }],

      // TypeScript rule from your original config
      "@typescript-eslint/no-unused-vars": "off",

      // Let Prettier be the final arbiter of format (avoids rule conflicts)
      "prettier/prettier": "warn"
      // Tailwind helpers if you want:
      // "tailwindcss/classnames-order": "warn",
      // "tailwindcss/no-contradicting-classname": "warn",
    },
  }
)
