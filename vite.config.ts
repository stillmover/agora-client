import path from 'node:path'
import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import {analyzer} from 'vite-bundle-analyzer'
import tailwindcss from '@tailwindcss/vite'
import {tanstackRouter} from '@tanstack/router-plugin/vite'
import {VitePWA} from 'vite-plugin-pwa'
import reactScan from "@react-scan/vite-plugin-react-scan";

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), '')
    const isDev = mode === 'development'

    const host = env.VITE_HOST || 'localhost'
    const port = Number(env.VITE_PORT || 5173)
    const previewPort = Number(env.VITE_PREVIEW_PORT || 4173)
    const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:8000'

    return {
        mode,

        plugins: [
            tanstackRouter({
                target: 'react',
                autoCodeSplitting: true,
            }),

            react({
                babel: {
                    plugins: ['babel-plugin-react-compiler'],
                },
            }),

            tailwindcss(),

            VitePWA({
                disable: isDev,
                registerType: 'autoUpdate',
                includeAssets: ['icon.svg', 'offline.html'],

                manifest: {
                    name: 'Reddit Client',
                    short_name: 'Reddit',
                    description: 'A modern Reddit client built with React and TypeScript',
                    theme_color: '#ff4500',
                    background_color: '#ffffff',
                    display: 'standalone',
                    orientation: 'portrait-primary',
                    scope: '/',
                    start_url: '/',

                    icons: [
                        {src: '/icon-72x72.png', sizes: '72x72', type: 'image/png', purpose: 'any maskable'},
                        {src: '/icon-96x96.png', sizes: '96x96', type: 'image/png', purpose: 'any maskable'},
                        {src: '/icon-128x128.png', sizes: '128x128', type: 'image/png', purpose: 'any maskable'},
                        {src: '/icon-144x144.png', sizes: '144x144', type: 'image/png', purpose: 'any maskable'},
                        {src: '/icon-152x152.png', sizes: '152x152', type: 'image/png', purpose: 'any maskable'},
                        {src: '/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable'},
                        {src: '/icon-384x384.png', sizes: '384x384', type: 'image/png', purpose: 'any maskable'},
                        {src: '/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable'},
                    ],

                    shortcuts: [
                        {
                            name: 'Home',
                            short_name: 'Home',
                            description: 'Go to home feed',
                            url: '/',
                            icons: [{src: '/icon-96x96.png', sizes: '96x96'}],
                        },
                        {
                            name: 'Popular',
                            short_name: 'Popular',
                            description: 'View popular communities',
                            url: '/popular',
                            icons: [{src: '/icon-96x96.png', sizes: '96x96'}],
                        },
                    ],

                    share_target: {
                        action: '/submit',
                        method: 'GET',
                        params: {
                            title: 'title',
                            text: 'text',
                            url: 'url',
                        },
                    },
                },

                workbox: {
                    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                    runtimeCaching: [
                        {
                            urlPattern: /\.(?:jpg|jpeg|png|gif|svg|webp|ico)$/i,
                            handler: 'CacheFirst',
                            options: {
                                cacheName: 'images-cache',
                                expiration: {
                                    maxEntries: 100,
                                    maxAgeSeconds: 30 * 24 * 60 * 60,
                                },
                                cacheableResponse: {
                                    statuses: [0, 200],
                                },
                            },
                        },
                        {
                            urlPattern: /\.(?:woff2?|ttf|eot|otf)$/i,
                            handler: 'CacheFirst',
                            options: {
                                cacheName: 'fonts-cache',
                                expiration: {
                                    maxEntries: 50,
                                    maxAgeSeconds: 365 * 24 * 60 * 60,
                                },
                                cacheableResponse: {
                                    statuses: [0, 200],
                                },
                            },
                        },
                        {
                            urlPattern: /\/api\/.*/i,
                            handler: 'NetworkFirst',
                            options: {
                                cacheName: 'api-cache',
                                expiration: {
                                    maxEntries: 50,
                                    maxAgeSeconds: 5 * 60,
                                },
                                networkTimeoutSeconds: 10,
                                cacheableResponse: {
                                    statuses: [0, 200],
                                },
                            },
                        },
                        {
                            urlPattern: /\/graphql/i,
                            handler: 'NetworkFirst',
                            options: {
                                cacheName: 'graphql-cache',
                                expiration: {
                                    maxEntries: 100,
                                    maxAgeSeconds: 2 * 60,
                                },
                                networkTimeoutSeconds: 10,
                                cacheableResponse: {
                                    statuses: [0, 200],
                                },
                            },
                        },
                    ],
                },
            }),
            ...(isDev ? [reactScan(), analyzer()] : []),
        ].filter(Boolean),

        build: {
            chunkSizeWarningLimit: 1000,
            minify: 'esbuild',
            target: 'esnext',
            sourcemap: isDev,
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            if (id.includes('react')) return 'react'
                            if (id.includes('@tanstack')) return 'tanstack'
                            return 'vendor'
                        }
                    },
                    entryFileNames: 'assets/[name]-[hash].js',
                    chunkFileNames: 'assets/[name]-[hash].js',
                    assetFileNames: 'assets/[name]-[hash].[ext]',
                },
            },
        },

        define: {
            __APP_ENV__: JSON.stringify(mode),
        },

        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },

        server: {
            host,
            port,
            open: false,
            historyApiFallback: true,
            proxy: {
                '/api': {
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
    }
})
