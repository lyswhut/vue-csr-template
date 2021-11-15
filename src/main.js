import { createApp } from 'vue'
import { sync } from 'vuex-router-sync'

// Components
import mountComponents from './components'

// Plugins
import initPlugins from './plugins'

import App from './App'
import router from './route'
import store from './store'

sync(store, router)

const app = createApp(App)

app.use(router)
  .use(store)
  // .use(i18n)
initPlugins(app)
mountComponents(app)
app.mount('#root')
