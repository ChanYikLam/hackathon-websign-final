import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { addIcon } from '@iconify/vue'
import App from './App.vue'
import router from './router'
import './styles/index.scss'

// 离线预加载所有图标数据，彻底消除 Iconify 在线 API 依赖
import { iconRegistry } from './utils/icons'
Object.entries(iconRegistry).forEach(([name, data]) => {
  addIcon(name, data)
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
