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
            <Notes class="icon" />
            <span>{{ data.basic.label }}</span>
        </div>
        <!-- 这是便笺的内容 -->
        <ElInput v-model="data.component.text" class="body no-border-bg " type="textarea" :rows="11" autofocus />
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
    font-family: 'dingtalk',serif;
    color: #ffffff;
}

.note_node {
    width: 200px;
    height: 300px;
    background: #ddc258;
    border-radius: 5px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);
    padding: 5px 10px;
    text-align: center;
}

.header {
    font-size: 14px;
    margin-bottom: 10px;
    font-family: 'dingtalk',serif;
    text-align: left;
    padding: 10px;
    border-bottom: 1px solid #ebebeb;
    color: white;
}

.body {
    text-align: left;
}
.icon{
    margin-right: 5px;
}
</style>