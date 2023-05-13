import vuex from './store';
import index from './index.vue';
import redirect from './redirect';
export default function({ store, router }) {
    return {
        install: (Vue) => {
            // 注册vuex
            store.registerModule('tagsView', vuex);
            // 注入redirect路由
            router.addRoute({
                path: '/redirect',
                name: 'redirect',
                meta: {},
                component: redirect
            });
            // 注册组件
            Vue.component('tagsView', index);
            Vue.config.globalProperties.$cache = store.state['tagsView']['cachedViews'];
        }
    };
}
