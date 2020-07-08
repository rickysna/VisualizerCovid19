module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    "airbnb-base",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
  ],
  rules: {
    quotes: [2, "double"],
    "import/extensions": ["error", "ignorePackages", {
      js: "never",
      mjs: "never",
      jsx: "never",
      ts: "never",
      tsx: "never",
    }],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
      },
    },
  },
};
