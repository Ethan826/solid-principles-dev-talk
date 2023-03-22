// eslint-disable-next-line no-undef
module.exports = {
  env: {
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
    "plugin:import/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "simple-import-sort"],
  rules: {
    "@typescript-eslint/consistent-type-imports": 2,
    "import/first": 2,
    "import/named": 0,
    "import/newline-after-import": 2,
    "import/no-duplicates": 2,
    "import/no-unresolved": 0,
    "linebreak-style": ["error", "unix"],
    "no-warning-comments": 1,
    "simple-import-sort/exports": 2,
    "simple-import-sort/imports": 2,
    curly: ["error", "multi-line", "consistent"],
    quotes: ["error", "double", { avoidEscape: true }],
    semi: ["error", "always"],
  },
};
