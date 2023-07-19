<template>
    <el-dialog
            v-model="dialogVisible"
            title="Tips"
            width="30%"
            :before-close="handleClose"
    >
        <span>This is a message</span>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </span>
        </template>
    </el-dialog>
</template>


<script setup lang="ts">

import {ref, defineExpose} from 'vue'

const dialogVisible = ref(false);

defineExpose({
    start: () => {
    }
})

</script>

<style scoped lang="less"/>