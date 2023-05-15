import {createApp} from 'vue'
import plugin from '@/plugin'
import "./style.less"
import App from './App.vue'
import '@/channel'
// import './samples/node-api'

createApp(App)
    .use(plugin)
    .mount('#app')
    .$nextTick(() => {
        postMessage({payload: 'removeLoading'}, '*')
    })
