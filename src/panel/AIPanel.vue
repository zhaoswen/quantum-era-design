<template>
  <NavePanel title="Era AI">
    <el-tabs v-model="activeName" tab-position="top" @tab-click="handleClick" stretch class="tabs">
      <el-tab-pane label="Chat" name="chat">
      </el-tab-pane>
      <el-tab-pane label="Agent" name="agent">
      </el-tab-pane>
      <el-tab-pane label="设置" name="setting">
      </el-tab-pane>
    </el-tabs>
  </NavePanel>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import NavePanel from '../components/NavePanel.vue';

const activeName = ref('chat') // 修改为正确的初始值

const handleClick = () => { // 修改参数类型
}


</script>

<style scoped>
.el-form-item {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  flex-direction: column;
}

.tabs {
  height: 100%;
  /* margin-top: -20px; */
  overflow: auto;
}

.add-custom {
  margin-top: 10px;
  width: 100%;
}

.input-with-custom {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>