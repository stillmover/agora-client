import { defineConfig, loadEnv } from '@rsbuild/core';
import { reactAppPreset } from './rsbuild.preset.react';

export default defineConfig(({ envMode }) => {
  const { publicVars } = loadEnv({ prefixes: ['VITE_'] });

  const host = process.env.VITE_HOST || 'localhost';
  const port = Number(process.env.VITE_PORT || 5173);
  const previewPort = Number(process.env.VITE_PREVIEW_PORT || 4173);
  const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:5555';

  const mode = (envMode === 'production' ? 'production' : 'development') as 'development' | 'production';

  const preset = reactAppPreset({
    mode,
    analyze: Boolean(process.env.BUNDLE_ANALYZE),
  });

  return {
    mode,
    ...preset,
    source: {
      entry: { index: './src/app/index.tsx' },
      define: {
        ...publicVars,
        __APP_ENV__: JSON.stringify(mode),
      },
    },

    resolve: {
      alias: { '@': './src' },
    },

    server: {
      host,
      port,
      strictPort: true,
      historyApiFallback: true,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
        '/graphql': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },

    preview: {
      host: '0.0.0.0',
      port: previewPort,
      strictPort: true,
      cors: true,
    },

    tools: {},
  };
});
