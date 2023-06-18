<template>
    <div class="JouJo-layout">
        <!--左侧导航-->
        <div class="layout-left">
            <div class="layout-left-step">
                <!--个人信息-->
                <user-info/>
                <!--搜索框-->
                <search/>
            </div>
            <!--菜单-->
            <left-menu/>
            <!--配置-->
        </div>
        <!--容器-->
        <div class="layout-right">
            <!--头部-->
            <header class="layout-header">
                <tags-view :routes="routes"/>
            </header>
            <!--主要内容-->
            <div class="layout-content">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Options, mixins} from 'vue-class-component';
import userInfo from '@/business-components/user-info/index.vue'
import search from '@/business-components/search-box/index.vue'
import leftMenu from '@/business-components/left-menu/index.vue'
import {baseRouter} from '@/router';

@Options({
    name: 'Layout',
    components: {userInfo, search, leftMenu}
})
export default class App extends mixins() {
    routes = baseRouter;

}
</script>

<style lang="less" scoped>
.JouJo-layout {
  height: 100%;
  width: 100%;
  background: #fff;
  display: flex;

  .layout-left {
    width: 224px;
    border-right: 1px rgb(230, 230, 230) solid;

    .layout-left-step {
      padding: 0 14px 12px 14px;
      border-bottom: rgb(240, 240, 240) 1px solid;
    }
  }

  .layout-right {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: linear-gradient(#f0f7ff, white 200px);

    .layout-header {
      height: 40px;
    }

    .layout-content {
      flex: 1;
      overflow: hidden;
      //background: white;
    }
  }
}
</style>
