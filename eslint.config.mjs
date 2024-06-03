import globals from 'globals';
import js from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';

export default [
  js.configs.recommended,
  {
    ignores: ['**/dist/', '**/node_modules/', '**/vite.config.js']
  },
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
      sourceType: 'module'
    },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/semi': ['error', 'never'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/linebreak-style': ['warn', 'unix'],
      'no-console': 'off',
      'no-unused-vars': 'warn',
      'no-unreachable': 'warn',
      'prefer-const': 'warn',
      'no-undef': 'warn',
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
        'error', 'always'
      ],
      'arrow-spacing': [
        'error', { 'before': true, 'after': true }
      ]
    },
  }
];