import './index.css'

import { createApp } from 'vue'
import {createRouter,createWebHashHistory} from 'vue-router'
import App from './App.vue'
import {routes} from './routes.js'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})


let app = createApp(App);
app.use(router);
app.mount('#app')
