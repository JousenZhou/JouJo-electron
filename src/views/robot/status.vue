<template>
    <dk-card title="Robot环境">
        <!--  环境检测      -->
        <template #default>
            <ul class="check-list">
                <li v-for="(item) in checklist" :key="item.value">
                    <span><i :class="checkValue?.[item.value]?'success':''"/>{{ item.label }}</span>
                    <span v-if="checkValue?.[item.value]">{{ typeof checkValue?.[item.value] === "boolean" ? '已安装' : checkValue?.[item.value] }}</span>
                    <el-link style="font-size: 12px" v-else type="danger">
                        <span @click="install(item)">未安装</span>
                    </el-link>
                </li>
            </ul>
            <el-divider style="margin: 6px 0"/>
            <header>
                <span>快速脚本</span>
            </header>
            <ul class="script-list">
                <li v-for="(item) in script" :key="item.id">
                    <span><i :class="item.status?'start':'stop'"/>{{ item.label }}</span>
                    <el-icon size="15" color="#d5cdcd" style="cursor:pointer;">
                        <VideoPause v-if="item.status"/>
                        <VideoPlay v-else @click="runScript(item)"/>
                    </el-icon>
                </li>
            </ul>
        </template>
    </dk-card>
</template>


<script lang="ts">
import {Options, mixins} from 'vue-class-component';
import dkCard from "@/components/dk-card/index.vue";
import {Checklist, CheckValue} from './types'
import channelExample from '@/channel'
import {VideoPause, VideoPlay, StarFilled} from '@element-plus/icons-vue'

@Options({name: 'robot-status', components: {dkCard, VideoPause, VideoPlay, StarFilled}})
export default class App extends mixins() {
    // 需要检验的状态
    checklist: Array<Checklist> = [
        {label: 'Node', value: 'node'},
        {label: 'Git', value: 'git'},
        {label: 'Env', value: 'env'}
    ]
    // 校验值\
    checkValue: CheckValue = {}

    // 正在执行的脚本
    script = [
        {label: '微信chatGPT', id: 9, status: false},
        {label: 'QQchatGPT', id: 2, status: false}
    ]

    // 获取环境
    async getEnv() {
        const {status, result} = await channelExample.getRobotEnv()
        if (!status) return
        this.checkValue = result
    }

    // 安装
    async install() {
        console.log('安装环境')
        const {status, result} = await channelExample.installRobotEnv()
    }

    // 运行脚本
    async runScript(item){
        const {status, result} = await channelExample.robotRunScript(item.id)
    }

    async mounted() {
        await this.getEnv()
    }
}
</script>

<style scoped lang="less">
.check-list, .script-list {
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;

    > span {
      .success {
        background: #509d1c;
      }

      .stop {
        background: #d5cdcd;
      }

      .start {
        background: #00c2ff;
      }

      i {
        display: inline-block;
        border-radius: 50%;
        height: 10px;
        width: 10px;
        background: rgba(255, 0, 0, 0.79);
        margin-right: 6px;
      }
    }
  }
}

header {
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  font-weight: bolder;
}
</style>