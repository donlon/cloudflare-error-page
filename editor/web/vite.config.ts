import { defineConfig } from 'vite';
import { minify as htmlMinify } from 'html-minifier-terser';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const baseUrl = mode === 'production' ? '' : '/editor/';
  return {
    plugins: [
      react(),
      {
        name: 'html-minifier',
        transformIndexHtml: {
          order: 'post',
          handler(html) {
            return htmlMinify(html, {
              collapseWhitespace: true,
              removeComments: true,
              minifyCSS: true,
              minifyJS: true,
            });
          },
        },
      },
    ],
    appType: 'mpa',
    base: baseUrl,
    build: {
      minify: true,
      sourcemap: true,
    },
    server: {
      port: 3000,
      proxy: {
        '/s/': {
          target: 'http://localhost:5000',
        },
      },
    },
  };
});
