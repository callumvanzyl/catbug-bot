module.exports = {
    plugins: [
        "@typescript-eslint",
        "eslint-comments",
        "jest",
        "promise",
        "unicorn",
    ],
    extends: [
        "airbnb-typescript/base",
        "plugin:@typescript-eslint/recommended",
        "plugin:eslint-comments/recommended",
        "plugin:jest/recommended",
        "plugin:promise/recommended",
        "plugin:unicorn/recommended",
        "prettier",
        "prettier/@typescript-eslint",
    ],
    env: {
        node: true,
        browser: true,
        jest: true,
    },
    parserOptions: {
        ecmaVersion: 2019,
        project: "./tsconfig.json"
    },
    rules: {
        "no-prototype-builtins": "off",
        "import/prefer-default-export": "off",
        "import/no-default-export": "error",
        "no-use-before-define": [
            "error",
            { functions: false, classes: true, variables: true },
        ],
        "@typescript-eslint/explicit-function-return-type": [
            "error",
            { allowExpressions: true, allowTypedFunctionExpressions: true },
        ],
        "@typescript-eslint/no-use-before-define": [
            "error",
            { functions: false, classes: true, variables: true, typedefs: true },
        ],
        "unicorn/no-useless-undefined": "off",
        "unicorn/prevent-abbreviations": "off",
        "no-console": "off",
        "unicorn/no-process-exit" : "off"
    },
}


