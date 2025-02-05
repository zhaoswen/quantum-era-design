<template>
  <Workspace v-show="runtime.pageIndex == '0'"/>
  <Design v-show="runtime.pageIndex == '1'"/>
  <Extension v-show="runtime.pageIndex == '2'"/>
  <Setting v-show="runtime.pageIndex == '3'"/>
</template>

<script setup lang="ts">
import {onMounted} from 'vue'
import {useVueFlow} from '@vue-flow/core'
import useDragAndDrop from './core/flowable'
import Design from './pages/Design.vue'
import Workspace from './pages/Workspace.vue'
import Setting from './pages/Setting.vue'
import Extension from './pages/Extension.vue'
import useRuntimeStore from './store/runtime'
import {checkEnv, initConfig} from "./core/init.ts";

const {onConnect, addEdges} = useVueFlow()

useDragAndDrop()

const runtime = useRuntimeStore();

// 初始化事件
onMounted(() => {
  checkEnv().then(() => {
    initConfig()
  })

})

onConnect(addEdges)
</script>


<style scoped>

</style>