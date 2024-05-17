import type { StorybookConfig } from '@storybook/web-components-vite'
import path from 'path'

export const references = {
  "title": "jsonresume-theme-microdata",
  "url": "https://6632f42ef9bacea464588c02-tkarrbykzd.chromatic.com/",
  expanded: false,
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@chromatic-com/storybook',
    'storybook-addon-render-modes'
  ],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  refs: [references],
  async viteFinal(config, options) {
    // Ensures that the cache directory is inside the project directory
    config.cacheDir = path.join(__dirname, '../node_modules/.vite-storybook')
    config.resolve = {
      ...config.resolve,
      alias: {
        '@': path.resolve(__dirname, '../src/'),
      },
    }
    config.define = {
      ...config.define,
      'process.env': process.env,
    }
    return config
  },
}
export default config
