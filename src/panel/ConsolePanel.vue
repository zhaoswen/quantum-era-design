<script setup lang="ts">
import {nextTick, watch} from 'vue'
import useRuntimeStore from '../store/runtime.ts';
import useDragAndDrop from '../core/flowable.ts'
import NavePanel from '../components/NavePanel.vue';
import {getLogType} from '../tools/logs.ts'
import NaveMenuButtom from "../components/NaveMenuButtom.vue";
import {DeleteOne} from "@icon-park/vue-next";

useDragAndDrop()
const runtime = useRuntimeStore();

watch(() => runtime.consoleOutput.length, async () => {
    await nextTick();
    const consoleMain = document.querySelector('.console-main');
    if (consoleMain) {
        consoleMain.scrollTop = consoleMain.scrollHeight;
    }
}, { deep: true })

</script>

<template>
    <NavePanel title="调试台" locationBorder="top" class="panels">
        <template #header>
          <NaveMenuButtom :icon="DeleteOne" location="" label="清空控制台" @click="runtime.consoleOutput = []"/>
        </template>
        <div class="engine-console">
            <div class="console-main">
                <div></div>
                <div v-for="(item) in runtime.consoleOutput" class="console-content canSelectText" :class="getLogType(item)">{{ item }}</div>
            </div>
        </div>
    </NavePanel>
</template>

<style scoped>
.panels{
  height: 250px;
}
.engine-console {
    flex: 1;
    padding-top: 10px;
    padding-bottom: 10px;
    max-height: 230px;
}

.console-main {
    flex: 1;
    overflow-y: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: start;
    color: white;
    background-color: #494949;
    border-radius: 5px;
    padding: 10px;
    gap: 7px;
}

.el-input__wrapper {
    background-color: transparent;
}

.el-input__inner {
    background: transparent;
}

.console-content {
    color: white;
    font-family: 'hack',serif;
    font-size: 13px;
    padding-right: 10px;
    padding-left: 10px;
    text-align: left;
    border-radius: 5px;
}

.INFO{
    color: #00a6ff;
}

.ERROR{
    color: #ff4d4f;
}

.WARN{
    color: #ff9900;
}

.DEBUG{
    color: #bdbdbd;
}


.no-border-bg :deep(.el-input__inner),
.no-border-bg :deep(.el-input__wrapper) {
    border: none !important;
    background-color: transparent !important;
    --el-input-focus-border-color: transparent !important;
    --el-input-border-color: transparent !important;
    --el-input-hover-border-color: transparent !important;
    height: 100%;
    font-family: 'hack',serif;
    color: #ebebeb;
}
</style>