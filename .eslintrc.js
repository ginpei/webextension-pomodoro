module.exports = {
  root: true,
  env: {
    browser: true
  },
  extends: 'airbnb-base',
  globals: {
    "browser": false,
  },
  rules: {
    "class-methods-use-this": [
      "off",
    ],
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
    "no-underscore-dangle": [
      "error",
      {
        "allowAfterThis": true,
      },
    ],
  },
}
