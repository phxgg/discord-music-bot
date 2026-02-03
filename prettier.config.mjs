/**
 * @see https://prettier.io/docs/configuration
 * @type {import('prettier').Config}
 */
export default {
  endOfLine: 'lf',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  importOrder: [
    '^(discord.js/(.*)$)|^(discord.js$)',
    '^(discord-player/(.*)$)|^(discord-player$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^types$',
    '^@/types/(.*)$',
    '^@/config/(.*)$',
    '^@/lib/(.*)$',
    '^@/middleware/(.*)$',
    '',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
};
