import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig(({ mode }) => {
  return {
    build: {
      copyPublicDir: false,
      lib: {
        entry: './src/index.js',
        fileName: 'json-resume',
        formats: ['es'],
        name: 'jsonresumeWebComponent',
      },
      rollupOptions: {
        external: ['lit', '@lit/task', /^node:.*/],
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
