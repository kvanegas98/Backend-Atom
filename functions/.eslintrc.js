module.exports = {
  root: true,
  env: { es6: true, node: true },
  extends: ["eslint:recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  ignorePatterns: ["/lib/**/*", "/tests/**/*", "jest.config.ts"],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_" }
    ],
    "@typescript-eslint/no-explicit-any": "warn"
  }
};
