module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: "@typescript-eslint/parser"
  },
  settings: {
    react: {
      version: "detect"
    },
  },
  plugins: [
    'react'
  ],
  rules: {
    semi: [2, "always"]
  }
}
