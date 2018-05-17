module.exports = {
  root: true,
  env: {
    browser: true
  },
  extends: 'airbnb-base',
  rules: {
    "comma-dangle": [
      "error",
      "always-multiline",
    ],
    "space-before-function-paren": [
      "error",
      "always",
    ],
    "no-param-reassign": [
      "error",
      {
        "props": false,
      }
    ],
  },
  globals: {},
}
