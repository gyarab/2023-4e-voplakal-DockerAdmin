import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import autoprefixer from 'autoprefixer'

export default defineConfig(({ mode }) => {
  // Load .env
  const env = loadEnv(mode, process.cwd(), '')
  process.env = { ...process.env, ...env }

  return {
    plugins: [vue()],
    build: {
      outDir: "../backend/vue_build",
      // assetsDir: "./assets",
      // rollupOptions: {
      //     output: {
      //         entryFileNames: "assets/[name].js",
      //         chunkFileNames: "assets/[name].js",
      //         assetFileNames: "assets/[name].[ext]",
      //     },
      // },
  },
    base: './',
    css: {
      postcss: {
        plugins: [
          autoprefixer({}) // add options if needed
        ],
      }
    },
    resolve: {
      alias: [
        // webpack path resolve to vitejs
        {
          find: /^~(.*)$/,
          replacement: '$1',
        },
        {
          find: '@/',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
        {
          find: '@',
          replacement: path.resolve(__dirname, '/src'),
        },
      ],
      extensions: [
        '.mjs',
        '.js',
        '.ts',
        '.jsx',
        '.tsx',
        '.json',
        '.vue',
        '.scss',
      ],
    },
    server: {
      port: 3000,
      proxy: {
        "/api": { target: "http://localhost:3030" },
    },
    },
    define: {
      // vitejs does not support process.env so we have to redefine it
      'process.env': process.env,
    },
  }
})
