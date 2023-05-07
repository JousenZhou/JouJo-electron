<template>
    <div class="JouJo-layout">
        <!--左侧菜单-->
        <div>

        </div>
        <!--容器-->
        <div>
            <!--头部-->
            <header>
                头部
            </header>
            <div>
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Options, mixins} from 'vue-class-component';

@Options({name: 'Layout'})
export default class App extends mixins() {
}
</script>

<style lang="scss" scoped>
.JouJo-layout {
  height: 100%;
  width: 100%;
  background: black;
}
</style>
