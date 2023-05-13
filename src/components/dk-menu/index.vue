<template>
    <el-menu>
        <menu-item
                v-for="(item, index) in data"
                :key="index"
                :menu="item"/>
    </el-menu>
</template>

<script lang="ts">
import {Options, mixins} from 'vue-class-component';
import {Prop} from '@/decorator'
import menuItem from './item.vue'

@Options({name: 'dk-menu', components: {menuItem}})
export default class App extends mixins() {
    @Prop({required: true, type: Array}) data: any[] | undefined
}
</script>
<style scoped lang="less">

</style>
