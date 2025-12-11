/// <reference types="vite/types/importMeta.d.ts" />

import { defineConfig, loadEnv } from 'vite';
import { minify as htmlMinify } from 'html-minifier-terser';
import process from 'node:process';


export default defineConfig(({ mode }) => {
  const baseUrl = mode === 'production' ? '' : '/editor/';
  return {
    appType: 'mpa',
    base: baseUrl,
    build: {
      minify: true,
      sourcemap: true,
    },
    server: {
      port: 3000,
      proxy: {
        '/s': {
          target: 'http://localhost:5000',
        },
      },
    },

    plugins: [
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
  };
});
