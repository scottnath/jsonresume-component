import type { StorybookConfig } from '@storybook/web-components-vite'
import path from 'path'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
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
