import 'vuetify/styles'
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as vuetifyComponents from 'vuetify/components'
import * as vuetifyDirectives from 'vuetify/directives'
import { createPinia } from 'pinia'
import '@mdi/font/css/materialdesignicons.css'
import App from './App.vue'
import router from '@router/index.js'

createApp(App)
  .use(
    createVuetify({
      components: vuetifyComponents,
      directives: vuetifyDirectives
    })
  )
  .use(createPinia())
  .use(router)
  .mount('#app')
