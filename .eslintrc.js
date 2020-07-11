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
      ts: "never",
    }],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "no-param-reassign": 0,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".ts"],
      },
    },
  },
};
