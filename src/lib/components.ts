import type { App } from 'vue'

import CptPicture from '@/packages/custom-components/elements/CptPicture.vue'
import CptButton from '@/packages/custom-components/elements/CptButton.vue'
import CptText from '@/packages/custom-components/elements/CptText.vue'

import * as icons from 'lucide-vue-next'

function registerComponents(app: App) {
  app.component('CptPicture', CptPicture)
  app.component('CptButton', CptButton)
  app.component('CptText', CptText)

  for (const [key, value] of Object.entries(icons)) {
    app.component(key, value)
  }
}

export { registerComponents }
