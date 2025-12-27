import eslintPluginVue from 'eslint-plugin-vue'

export default [
  {
    ignores: ['node_modules/', '.nuxt/', 'dist/', '.output/'],
  },
  {
    files: ['**/*.vue', '**/*.ts', '**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
    plugins: {
      vue: eslintPluginVue,
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',
    },
  },
]
