  import path from 'node:path'
  import { defineConfig, loadEnv } from 'vite'
  import react from '@vitejs/plugin-react'
  import { analyzer } from 'vite-bundle-analyzer'
  import tailwindcss from '@tailwindcss/vite'
  import { tanstackRouter } from '@tanstack/router-plugin/vite'

  export default defineConfig(({ mode }) => {
    // Load environment variables
    const env = loadEnv(mode, process.cwd(), '')
    process.env = { ...process.env, ...env }

    // Extract environment variables with defaults
    const isDev = mode === 'development'
    const host = env.VITE_HOST || 'localhost'
    const port = parseInt(env.VITE_PORT || '5173', 10)
    const previewPort = parseInt(env.VITE_PREVIEW_PORT || '4173', 10)
    const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:8000'
    const appEnv = mode

    const plugins = [tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
      }),
    react({
        babel: {
            plugins: ['babel-plugin-react-compiler'],
        },
    }),
    tailwindcss(), isDev && analyzer()].filter(Boolean)

    return {
      build: {
        chunkSizeWarningLimit: 1000,
        minify: 'esbuild',
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom', 'react-use'],
            },
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]',
          },
        },
        sourcemap: isDev,
        target: 'esnext',
      },
      define: {
        __APP_ENV__: JSON.stringify(appEnv),
      },
      mode: appEnv,
      optimizeDeps: {
        include: ['react', 'react-dom', 'react-use'],
      },
      plugins,
      preview: {
        cors: true,
        host: '0.0.0.0',
        port: previewPort,
        strictPort: true,
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        },
      },
      server: {
        historyApiFallback: true,
        host,
        open: false,
        port,
        proxy: {
          '/api': {
            target: backendUrl,
            changeOrigin: true,
            secure: false,
          },
        },
      },
    }
  })