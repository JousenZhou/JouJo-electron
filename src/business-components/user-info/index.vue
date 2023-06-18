<template>
    <div class="avatar">
        <el-avatar shape="square" class="avatar-icon" :size="36"/>
        <el-space class="avatar-info" direction="vertical" :size="0" alignment="normal">
            <span class="avatar-name">JouJo/染血猫🐱</span>
            <span class="avatar-job">administrators</span>
        </el-space>
    </div>
</template>

<script lang="ts">
import {Options, mixins} from 'vue-class-component';

@Options({name: 'user-info'})
export default class App extends mixins() {
}
</script>
<style scoped lang="less">
.avatar {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  //border-bottom: rgb(230, 230, 230) solid 1px;
  padding: 12px 0;

  .avatar-icon {
    background: #486BF2;
    margin-right: 10px;
    border-radius: 6px;
  }

  .avatar-info {
    flex: 1;
    overflow: hidden;
    font-size: 10px;
    //font-family: Poppins, serif;
    text-align: left;

    .avatar-name {
      color: rgb(12, 12, 13);
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      letter-spacing: 0;
    }

    .avatar-job {
      color: rgb(141, 141, 141);
      font-size: 10px;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: 0;
    }
  }
}
</style>
