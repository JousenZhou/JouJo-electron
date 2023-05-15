<template>
    <el-card :v-bind="$attr" class="dk-card">
        <template #default>
            <slot/>
        </template>
        <template #header>
            <slot name="header">
                <el-space class="dk-card-header" v-if="color || icon || title">
                    <!-- 色点 -->
                    <span class="dk-card-header-color" v-if="color" :style="{background: color}"/>
                    <!-- 图标 -->
                    <el-icon v-if="icon">
                        <component :is="icon"/>
                    </el-icon>
                    <!-- 文案 -->
                    <span v-if="title">{{ title }}</span>
                </el-space>
            </slot>
        </template>
    </el-card>
</template>

<script lang="ts">
import {Options, mixins} from 'vue-class-component';
import {Prop} from 'vue-property-decorator'

@Options({name: 'dk-card'})
export default class App extends mixins() {
    @Prop({type: Object}) icon
    @Prop({type: String}) title
    @Prop({type: String}) color
}
</script>

<style scoped lang="less">
.dk-card {

  :deep(.el-card__header) {
    font-size: 12px;
    padding: 8px 10px !important;
  }

  :deep(.el-card__body) {
    font-size: 12px;
    padding: 8px 10px !important;
  }

  .dk-card-header {
    height: 20px;

    .dk-card-header-color {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
  }
}
</style>