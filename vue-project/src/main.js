import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 引入 Element Plus 样式（按需导入已由插件处理，但全局样式仍需引入）
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
