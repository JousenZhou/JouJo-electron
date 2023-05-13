<template>

</template>

<script lang="ts">
import {Options, mixins} from 'vue-class-component';
import {Prop} from "@/decorator";

@Options({name: ''})
export default class App extends mixins() {
    @Prop({required: true, type: Object}) menu: object | undefined
}
</script>
<style scoped lang="less">

</style>
