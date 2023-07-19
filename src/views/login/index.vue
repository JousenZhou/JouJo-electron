<template>
    <p>登录页</p>
    <p>
        <span>账号</span>
        <el-input v-model="account"/>
    </p>
    <p>
        <span>密码</span>
        <el-input v-model="pwd"/>
    </p>
    <el-button @click="login">登录</el-button>
    <el-button @click="register">注册</el-button>
</template>

<script setup lang="ts">
import http from '@/flyio'
import {onMounted, ref} from 'vue'
import localstorage from '@/plugin/localstorage'
import {useRouter} from 'vue-router'
import {useUserStore} from '@/store'

const router = useRouter();
const userStore = useUserStore();
const account = ref('JousenZhou');
const pwd = ref('888888')

const login = async () => {
    const res = await http.post('/account/login', {username: account.value, password: pwd.value})
    const {code, token} = res;
    if (code !== 200) return;
    localstorage.set('Authorization', token);
    await userStore.setAuthorization(token);
    await router.replace('/erp/home')
}

const register = async () => {
    const res = await http.post('http://127.0.0.1:3000/account/register', {username: 'Jousenzhou', password: '888888'})
}


onMounted(async () => {

})

</script>

<style scoped>

</style>