<template>
    <div class="search-box">
        <el-input
                class="search"
                placeholder="Quick Find"
                size="small">
            <template #prefix>
                <el-icon size="16">
                    <Search/>
                </el-icon>
            </template>
        </el-input>
    </div>
</template>

<script lang="ts">
import {Options, mixins} from 'vue-class-component';
import {Search} from '@element-plus/icons-vue'

@Options({name: 'user-info', components: {Search}})
export default class App extends mixins() {

}
</script>
<style scoped lang="less">
.search-box {
  margin-top: 20px;

  .search {

    :deep(.el-input__wrapper) {
      border-radius: 8px;
      background: rgb(240, 247, 255);
      padding: 0 10px;
      box-shadow: none;
    }

    :deep(.el-input__inner) {
      height: 36px;
      background: rgba(0, 0, 0, 0);
    }
  }
}
</style>
