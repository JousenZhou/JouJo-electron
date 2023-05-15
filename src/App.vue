<template>
    <router-view />
</template>

<script lang="ts">
import {Options, mixins} from 'vue-class-component';
import Layout from '@/layout/index.vue'

@Options({name: 'App', components: {Layout}})
export default class App extends mixins() {
}
</script>

<!--
#222431
#181A26
#2CB2E5
-->