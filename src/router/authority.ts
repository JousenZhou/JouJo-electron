import localstorage from '@/plugin/localstorage'
import {RouteLocationNormalized, NavigationGuardNext} from 'vue-router'
import {useUserStore} from '@/store'
// 白名单不需要校验直接通过
const whiteList = ['/login'];

export default async function (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    // 白名单不校验
    if (whiteList.indexOf(to.path) !== -1) return next()
    // 内存信息
    const userStore = useUserStore();
    // 已登录
    if (userStore.status) return to.matched.length ? next() : next('/erp/404')
    // 未登录
    // 1.从浏览器缓存里面获取凭证
    const Authorization = localstorage.get('Authorization')
    // 没有凭证则返回登录页
    if (!Authorization) next('/login')
    // 兑换用户信息
    await userStore.setAuthorization(Authorization)
    // 重定向
    return next({ ...to, replace: true });
}
