module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:sonarjs/recommended',
    'eslint:recommended',
  ],
  plugins: [
    '@typescript-eslint',
    'import',
    'jest',
    'prettier',
    'extra-rules',
    'sonarjs',
  ],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: 'next' },
    ],
    'prettier/prettier': 'error',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        pathGroups: [
          {
            pattern: 'src/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: './**',
            group: 'parent',
            position: 'after',
          },
          {
            pattern: '../**',
            group: 'parent',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    // Carrying over significant rules from the JS project
    'max-params': ['error', { max: 3 }],
    'max-statements': ['error', { max: 50 }],
    'max-lines': [
      'error',
      { max: 500, skipComments: true, skipBlankLines: true },
    ],
    complexity: ['error', { max: 10 }],
    'extra-rules/no-commented-out-code': 'error',
    'object-curly-spacing': [2, 'always'],
    quotes: [2, 'single', 'avoid-escape'],
    'prefer-rest-params': 'warn',
    semi: [2, 'always'],
    'space-before-function-paren': [
      2,
      {
        anonymous: 'always',
        named: 'never',
      },
    ],
    'keyword-spacing': [2, { before: true, after: true }],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
      },
    ],
    'no-underscore-dangle': [0],
    'space-infix-ops': 2,
    'spaced-comment': [2, 'always'],
    'arrow-spacing': 2,
    'no-console': 0,
    'no-param-reassign': 0,
    'no-shadow': 0,
    'no-plusplus': 0,
    'no-unused-expressions': 0,
    indent: [
      2,
      2,
      {
        SwitchCase: 1,
      },
    ],
  },
  ignorePatterns: ['**/*.js', '**/*.d.ts', '**/*.tclient.ts', 'www'],
  env: {
    browser: false,
    es6: true,
    node: true,
    jest: true,
  },
  globals: {},
};
