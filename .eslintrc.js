module.exports = {
  extends: ['./configs/eslint-ts'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  globals: {
    RootState: 'readonly',
    AppDispatch: 'readonly',
  },
  rules: {
    'no-continue': 'off',
    'import/prefer-default-export': 'off',
    'react/jsx-props-no-spreading': 'off',
    'max-len': [
      'error',
      {
        code: 120,
        comments: 100,
        ignoreComments: false,
        ignoreTrailingComments: false,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'jsx-a11y/label-has-associated-control': 'off',
  },
  overrides: [
    {
      files: ['**/*.stories.*', '**/stories.*'],
      rules: {
        'no-console': 'off',
        'import/no-anonymous-default-export': 'off',
        'import/exports-last': 'off',
        'react/function-component-definition': 'off',
        'react/prop-types': 'off',
        'react/jsx-props-no-spreading': 'off',
      },
    },
  ],
};
