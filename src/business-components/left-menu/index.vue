<template>
    <el-space class="menu" fill :size="0" direction="vertical">
        <el-space :size="0" class="menu-header">
            <span>Menu</span>
            <el-icon>
                <Plus/>
            </el-icon>
        </el-space>
        <el-tree :data="data" :props="defaultProps"/>
    </el-space>
</template>

<script lang="ts">
import {Options, mixins} from 'vue-class-component';
import dkMenu from '@/components/dk-menu/index.vue'
import {Plus} from '@element-plus/icons-vue'

@Options({name: 'left-menu', components: {dkMenu, Plus}})
export default class App extends mixins() {
    data: any[] = [
        {
            label: '🐱 独立站（cross-border）',
            children: [{label: '建站'}, {label: '部署'}]
        },
        {
            label: '🐱 机器人（robot）',
            children: [
                {label: '🐱 插件市场'},
                {label: '🐱 基础配置'},
                {label: '🐱 脚本（script）'},
            ]
        },
        {
            label: '🐱 AI智能',
            children: [
                {
                    label: '🐱 Stable Diffusion',
                    children: [
                        {
                            label: '🐱 lora',
                            children: [
                                {label: '🐱 训练'},
                                {label: '🐱 模型库'},
                            ]
                        },
                    ]
                }
            ]
        },
        {
            label: '🐱 橱窗',
            children: [{label: 'sku',}]
        },
        {
            label: '🐱 物流',
            children: [{label: 'sku',}]
        },
        {
            label: '🐱 仓库',
            children: [{label: 'sku',}]
        },
        {
            label: '🐱 数据库（mysql）',
            children: [{label: 'sku',}]
        },
        {
            label: '🐱 接口api',
            children: [{label: 'sku',}]
        },
        {
            label: '🐱 推流',
            children: [{label: 'sku',}]
        },
        {
            label: '🐱 媒体',
            children: [{label: 'sku',}]
        },
        {
            label: '🐱 活动页（share）',
            children: [{label: 'sku',}]
        },
        {
            label: '🐱 自定义模块',
            children: [{label: 'sku',}]
        },

    ]
    defaultProps: object = {
        children: 'children',
        label: 'label',
    }

}
</script>
<style scoped lang="less">
.menu {
  padding: 20px 14px 0 14px;
  width: calc(100% - 28px);

  .menu-header {
    width: 100%;
    justify-content: space-between;
    color: rgb(141, 141, 141);
    font-size: 12px;
    line-height: 16px;
    margin-bottom: 10px;
  }
}
</style>
