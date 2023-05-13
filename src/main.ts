import {createApp} from 'vue'
import ElementUI from 'element-plus';
import 'element-plus/dist/index.css'
import store from '@/store'
import "./style.less"
import App from './App.vue'
// import './samples/node-api'

createApp(App)
    .use(ElementUI)
    .use(store)
    .mount('#app')
    // .$nextTick(() => {
    //     postMessage({payload: 'removeLoading'}, '*')
    // })
