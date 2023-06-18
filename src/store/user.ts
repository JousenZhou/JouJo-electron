import {defineStore} from 'pinia'

/**
 * @author JouJo
 * @description: 用户模块仓库
 * @date 2023/6/18
 */
import http from '@/flyio'

interface Data {
    Authorization: string
    user: string,
    nickname: string,
    role: string
    status: boolean
}

export default defineStore('user', {
    state(): Data {
        return {
            status: false,
            Authorization: '',
            user: '',
            nickname: '',
            role: '',

        }
    },
    getters: {},
    actions: {
        async setAuthorization(token: string) {
            this.Authorization = token;
            await this.getUserInfo()
        },
        // 获取用户信息
        async getUserInfo() {
            const res = await http.get('/api/user/info');
            const {code, data} = res;
            if (code !== 200) return
            Object.assign(this, {data, status: true})
        }
    }
})