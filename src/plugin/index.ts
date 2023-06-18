import tagsView from './tagView/index.js';
import store from '@/store/index';
import router from '@/router/index';
import ElementUI from 'element-plus';
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia';

export default {
    install: (Vue: any) => {
        /** 挂载原型方法*/
        // Vue.config.globalProperties = {
        //     $router: router,
        //     $store: store,
        //     $route: router.currentRoute
        // };
        Vue.use(router)
        Vue.use(store)
        Vue.use(createPinia())
        Vue.use(ElementUI)
        Vue.use(tagsView({store, router}));
    }
};
