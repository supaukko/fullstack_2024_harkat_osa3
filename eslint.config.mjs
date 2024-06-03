import globals from 'globals';
import js from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';

export default [
  js.configs.recommended,
  {
    plugins: {
      '@stylistic/js': stylisticJs
    },
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      ecmaVersion: 'latest',
      sourceType: 'commonjs'
    },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/semi': ['error', 'never'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      'no-unused-vars': 'warn',
      'no-unreachable': 'warn',
      'prefer-const': 'warn',
      'no-undef': 'warn',
    },
    ignores: ['**/dist/', '**/node_modules/'],
  }
];