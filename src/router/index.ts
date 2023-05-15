import {createRouter, createWebHashHistory, Router} from 'vue-router'


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
                path: 'robot',
                name: 'robot',
                meta: {
                    title: '🐱 机器人(robot)/脚本',
                },
                component: () => import('@/views/robot/index.vue')
            }
        ]
    },
    {
        path:'/',
        redirect: '/erp/robot',
    }
];


const router: Router = createRouter({
    history: createWebHashHistory(),
    routes: baseRouter,
})

export default router