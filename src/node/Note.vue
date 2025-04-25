<script setup>
import {ElInput} from 'element-plus';
import {ref} from 'vue';
import {Notes} from '@icon-park/vue-next'

let text = ref('')

const props = defineProps(['data'])
</script>

<template>
  <div class="note_node">
    <!-- 这是便笺的标题 -->
    <div class="header">

      <span>{{ data.basic.label }}</span>
    </div>
    <!-- 这是便笺的内容 -->
    <ElInput v-model="data.component.text" class="body no-border-bg " type="textarea" :rows="11" autofocus/>
  </div>
</template>

<style scoped>
.no-border-bg :deep(.el-input__inner),
.no-border-bg :deep(.el-textarea__inner) {
  border: none !important;
  background-color: transparent !important;
  --el-input-focus-border-color: transparent !important;
  --el-input-border-color: transparent !important;
  --el-input-hover-border-color: transparent !important;
  height: 100%;
  font-family: 'dingtalk', serif;
  color: #7e7e7e;
}

.note_node {
  width: 200px;
  height: 300px;
  background: #ffffff;
  border: #eeeeee 1px solid;
  border-radius: 5px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);
  padding: 5px 10px;
  text-align: center;
}

.header {
  font-size: 14px;
  margin-bottom: 10px;
  font-family: 'dingtalk', serif;
  text-align: center;
  padding: 12px;
  border-bottom: 1px solid #ebebeb;
  color: #454545;
}

.body {
  text-align: left;
}

.icon {
  margin-right: 15px;
}
</style>