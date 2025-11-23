import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

const app = createApp(App)

const pinia = createPinia()

const messages = {
    en: { message: { hello: 'Hello' } },
    vi: { message: { hello: 'Xin chào' } }
}
const i18n = createI18n({
    locale: 'vi', // default
    fallbackLocale: 'en',
    messages
})

app.use(ElementPlus)
app.use(router)
app.use(i18n)
app.use(pinia)

app.mount('#app')
