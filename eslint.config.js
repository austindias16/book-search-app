import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import { reactRefresh } from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite(),
    ],
    languageOptions: {
      ecmaVersion: 2024,
      globals: globals.browser,
    },
  },
  // Constants guard: user-visible text, URLs and default exports belong in src/constants.
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/constants/**', 'src/test-utils/**', '**/*.test.*'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'JSXText[value=/\\S/]',
          message: 'Put user-visible text in @/constants/strings.',
        },
        {
          selector: 'JSXAttribute[name.name=/^(aria-label|placeholder|title|alt)$/] > Literal',
          message: 'Use STRINGS for accessible/user-visible attributes.',
        },
        {
          selector: 'Literal[value=/^https?:\\/\\//]',
          message: 'URLs belong in @/constants/api.',
        },
        {
          selector: 'ExportDefaultDeclaration',
          message: 'Use named exports.',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/*'],
              message: 'Import features through their barrel (@/features/x).',
            },
            {
              group: ['**/test-utils/**'],
              message: 'App code must not import test utils.',
            },
          ],
        },
      ],
    },
  },
])
