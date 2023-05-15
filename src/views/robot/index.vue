<template>
    <div class="robot-view">
        <el-row gutter="10">
            <el-col :span="6">
                <!--状态机-->
                <status/>
                <!--全局配置-->
                <dk-card style="margin-top: 20px" title="全局配置" :icon="Setting"/>
            </el-col>
            <el-col :span="18">
                <!--脚本任务-->
                <dk-card title="脚本仓库" :icon="FolderOpened"/>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
import {Options, mixins} from 'vue-class-component';
import dkCard from '@/components/dk-card/index.vue'
import status from './status.vue'
import {Setting, FolderOpened} from '@element-plus/icons-vue'

@Options({name: 'App', components: {dkCard, status}})
export default class App extends mixins() {
    Setting = Setting
    FolderOpened = FolderOpened
}
</script>


<style scoped lang="less">
.robot-view {
  padding: 20px;
}
</style>