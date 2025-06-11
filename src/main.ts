import './assets/main.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{sky.50}',
      100: '{sky.100}',
      200: '{sky.200}',
      300: '{sky.300}',
      400: '{sky.400}',
      500: '{sky.500}',
      600: '{sky.600}',
      700: '{sky.700}',
      800: '{sky.800}',
      900: '{sky.900}',
      950: '{sky.950}',
    },
  },
})

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: '.p-dark',
      cssLayer: {
        name: 'primevue',
        order: 'theme, base, primevue',
      },
    },
  },
  ripple: true,
})

app.mount('#app')
