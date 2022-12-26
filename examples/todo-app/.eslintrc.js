// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  plugins: ["no-loops"],
  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    "no-console": 1,
    "no-loops/no-loops": 2,
    "prettier/prettier": "error",
    "vue/multi-word-component-names": "warn",
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    // "jest/globals": true,
  },
  globals: {
    require: true,
    process: true,
    cy: true,
    assert: true,
    Buffer: true,
  },
  ignorePatterns: ["node_modules", "dist"],
};
