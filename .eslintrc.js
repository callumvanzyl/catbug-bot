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
        "no-console": "off",
        "no-prototype-builtins": "off",
        "no-use-before-define": [
            "error",
            { functions: false, classes: true, variables: true },
        ],
        "import/no-default-export": "error",
        "import/no-cycle": "off",
        "import/prefer-default-export": "off",
        "@typescript-eslint/explicit-function-return-type": [
            "error",
            { allowExpressions: true, allowTypedFunctionExpressions: true },
        ],
        "@typescript-eslint/no-use-before-define": [
            "error",
            { functions: false, classes: true, variables: true, typedefs: true },
        ],
        "unicorn/no-process-exit" : "off",
        "unicorn/no-useless-undefined": "off",
        "unicorn/prevent-abbreviations": "off"
    },
}


