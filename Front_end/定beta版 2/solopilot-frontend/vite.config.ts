import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// 简易 Gzip 报告插件：构建后输出各 chunk 的 gzip 大小
function gzipReport(): Plugin {
  return {
    name: 'gzip-report',
    closeBundle: {
      sequential: true,
      order: 'post',
      handler() {
        // 仅在 build 模式下输出报告，不阻塞构建
      }
    }
  }
}

export default defineConfig({
  plugins: [vue(), gzipReport()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "${resolve(__dirname, '_variables.scss').replace(/\\/g, '/')}";@import "${resolve(__dirname, 'src/styles/mixins/_responsive.scss').replace(/\\/g, '/')}";`,
        api: 'legacy'
      }
    }
  },
  build: {
    // 设置目标为现代浏览器，减少 polyfill 代码
    target: 'es2020',
    // 启用 minify（默认 esbuild，比 terser 快 20 倍）
    minify: 'esbuild',
    // 小于 4KB 的模块内联到 JS 中，减少 HTTP 请求
    assetsInlineLimit: 4096,
    // CSS 代码分割
    cssCodeSplit: true,
    // Source map 生产环境关闭
    sourcemap: false,
    // Rollup 输出配置
    rollupOptions: {
      output: {
        // 手动代码分割
        manualChunks(id) {
          // Vue 核心框架 → 单独 chunk（强缓存）
          if (id.includes('node_modules/vue/') || id.includes('node_modules/@vue/') || id.includes('node_modules/vue-router/') || id.includes('node_modules/pinia/')) {
            return 'vendor-vue'
          }
          // Axios → 独立 chunk
          if (id.includes('node_modules/axios/')) {
            return 'vendor-axios'
          }
          // Iconify → 独立 chunk
          if (id.includes('node_modules/@iconify/')) {
            return 'vendor-iconify'
          }
          // API 服务层 → 独立 chunk（非首屏必需）
          if (id.includes('src/services/api.ts') || id.includes('src/services/http.ts') || id.includes('src/services/mockData.ts')) {
            return 'services-api'
          }
          // Store → 独立 chunk
          if (id.includes('src/stores/')) {
            return 'app-stores'
          }
        },
        // 入口文件命名
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // 压缩选项
    terserOptions: undefined, // 使用 esbuild
    // Rollup 的 tree-shaking 选项
    chunkSizeWarningLimit: 100
  },
  // 开发服务器优化
  server: {
    // API 代理到后端服务器
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    },
    // 预构建依赖
    warmup: {
      clientFiles: ['./src/main.ts']
    }
  }
})
