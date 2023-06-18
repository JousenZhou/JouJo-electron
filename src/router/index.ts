import {createRouter, createWebHashHistory, Router} from 'vue-router'
import authority from './authority'

export const baseRouter = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue')
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/404/index.vue')
    },
    {
        path: '/erp',
        name: 'Layout',
        component: () => import('@/layout/index.vue'),
        children: [
            {
                path: 'home',
                name: 'home',
                meta: {
                    title: '🐱 dashboard',
                    noCache: true,
                    affix: true
                },
                component: () => import('@/views/home/index.vue')
            },

            {
                path: '404',
                name: '404',
                meta: {title: '🐱 404'},
                component: () => import('@/views/404/index.vue')
            },

            // {
            //     path: 'robot',
            //     name: 'robot',
            //     meta: {
            //         title: '🐱 机器人(robot)/脚本',
            //     },
            //     component: () => import('@/views/robot/index.vue')
            // }
        ]
    },
    {
        path: '/',
        redirect: '/login',
    }
];


const router: Router = createRouter({
    // @ts-ignore
    scrollBehavior: (to, from, savedPosition) => {
        if (savedPosition) return savedPosition
        return {x: 0, y: 0};
    },
    history: createWebHashHistory(),
    routes: baseRouter,
})
router.beforeEach(authority);

export default router