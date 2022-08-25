import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia';
import { router } from './plugin/router';
import { createVuesticEssential} from 'vuestic-ui'
import 'vuestic-ui/css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { addAllIcons } from './font-awesome';

const app = createApp(App)
// Pinia
const pinia = createPinia()
app.use(pinia)
// vue-router
app.use(router)
// vuestic
app.use(createVuesticEssential({}))

app.component('font-awesome-icon', FontAwesomeIcon)
addAllIcons()

app.mount('#app')
