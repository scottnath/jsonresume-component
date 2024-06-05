import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig(({ mode }) => {
  let entry = {
    'json-resume': './src/index.js',
  }
  if (mode === 'dsd') {
    entry = {
      'json-resume-ui': './src/ui.js'
    }
  }
  return {
    build: {
      copyPublicDir: false,
      lib: {
        formats: ['es'],
        entry
      },
      rollupOptions: {
        external: ['lit', '@lit/task'],
      },
      target: 'esnext',
    },
    plugins: [
      viteStaticCopy({
        targets: [
          { src: './README.md', dest: '.' },
          { src: './custom-elements.json', dest: '.' },
          { src: './src/style.css', dest: '.' },
          { src: './node_modules/jsonresume-theme-microdata/dist/schema.json', dest: '.' },
          { src: './node_modules/jsonresume-theme-microdata/dist/schema.d.ts', dest: '.' },
        ],
      }),
    ],
  }
})
