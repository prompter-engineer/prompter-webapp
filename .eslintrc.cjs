module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ['ted', 'ted/react', 'ted/typescript', './.eslintrc-auto-import.json'],
  parserOptions: {
    project: './tsconfig.json'
  },
  // TODO: The following rules have been updated to latest `eslint-config-ted` version.
  rules: {
    'react/jsx-no-undef': 'off',
    /**
     * Let TypeScript handle type-related constraints
     */
    'react/prop-types': 'off',
    /**
     * In JSX, if it's a single line, use up to three attributes. 
     * For more than three, or in multiline cases, only one attribute per line.
     */
    'react/jsx-max-props-per-line': ['error', {
      maximum: {
        single: 3,
        multi: 1
      }
    }],
    /**
     * When multiple lines are present, ensure that the first attribute also starts on a new line
     */
    'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
    /**
     * Enforce alignment of the closing bracket of JSX multiline elements with their opening tag
     */
    'react/jsx-closing-bracket-location': ['error', 'tag-aligned'],
    /**
     * Encase multi-line JSX in parentheses and ensure it's formatted with line breaks.
     */
    'react/jsx-wrap-multilines': ['error', {
      declaration: 'parens-new-line',
      assignment: 'parens-new-line',
      return: 'parens-new-line',
      arrow: 'parens-new-line',
      condition: 'parens-new-line',
      logical: 'parens-new-line',
      prop: 'parens-new-line'
    }],
    '@typescript-eslint/prefer-nullish-coalescing': ['error', {
      ignoreConditionalTests: true
    }]
  }
}
