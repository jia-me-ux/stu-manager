import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'
import { fileURLToPath } from 'url' // 新增导入

// 获取当前文件所在目录的等效方法
const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  // 修改别名配置
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // 修正语法错误
    },
  },
})
