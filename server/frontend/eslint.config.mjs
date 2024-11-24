import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
    { files: ["**/*.{js,mjs,cjs,jsx}"] },
    {
        languageOptions: {
            globals: {
                ...globals.browser, // Use globals.browser to define browser-specific globals like fetch
                ...globals.node,    // Add node globals if needed
            },
            ecmaVersion: 2021,
            sourceType: 'module',
        }
    },
    pluginJs.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
        }
    },
];

export default eslintConfig;