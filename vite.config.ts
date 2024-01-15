import path from 'path'
import { type ConfigEnv, type UserConfigExport } from 'vite'
import react from '@vitejs/plugin-react'
import AutoImport from 'unplugin-auto-import/vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfigExport => {
  return {
    server: {
      host: '0.0.0.0'
    },
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
          svgoConfig: {
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false
                  }
                }
              }
            ],
            floatPrecision: 2
          }
        }
      }),
      AutoImport({
        imports: [
          'react',
          'react-i18next',
          'react-router-dom'
        ],
        dts: true,
        eslintrc: {
          enabled: true // Default `false`
        }
      }),
      // 在 index.html 中插入 GA
      createHtmlPlugin({
        inject: {
          data: {
            injectGA:
            ['prod'].includes(mode)
              ? `
          <!-- Google tag (gtag.js) -->
          <!-- Global site tag (gtag.js) - Google Analytics -->
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-4DLD0YWP0X" ></script>
          <script>
            window.dataLayer = window.dataLayer || [];
            function gtag() {dataLayer.push(arguments);}
            gtag("js", new Date());
            gtag("config", "G-4DLD0YWP0X");
          </script>
          `
              : ''
          }
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    build: {
      sourcemap: true, // Source map generation must be turned on
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name].[hash].js',
          entryFileNames: 'static/js/[name].[hash].js',
          assetFileNames: 'static/[ext]/[name].[hash].[ext]',
          manualChunks: {
            'react-vender': ['react', 'react-dom'],
            'react-router-vendor': ['react-router-dom'],
            'sentry-vender': ['@sentry/react'],
            ajv: ['ajv']
          }
        }
      }
    }
  }
}
