<template>
    <div class="items">
        <ExtensionItem v-for="plugin in plugins" :title="plugin.name" :description="plugin.description"
            :is-installed="props.sort === 'installed'" />
        <el-empty description="暂无插件" v-show="plugins.length === 0"/>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import useRuntimeStore from '../store/runtime';
import {SimxPlugin} from '../entity/plugin';
import ExtensionItem from './ExtensionItem.vue';

const runtime = useRuntimeStore();

const plugins = ref([] as SimxPlugin[])

onMounted(() => {
    // 清除掉旧有的数据
    plugins.value.length = 0;
    switch (props.sort) {
        case 'installed':
            loadInstalledExtensions()
            break;
        case 'popular':
            loadPopularExtensions()
            break;
        case 'updated':
            loadUpdatedExtensions()
            break;
        case 'simx':
            loadSimxExtensions()
            break;
        case 'newest':
            loadNewestExtensions()
            break;
        case 'all':
            loadAllExtensions()
            break;
        default:
            break;
    }
})

const props = defineProps({
    sort: {
        // 允许以下值
        // installed, popular, updated, simx, newest, all
        type: String,
        required: true,
        default: 'installed'
    }
})

const loadInstalledExtensions = () => {
    console.log('loadInstalledExtensions', runtime.plugins)
    plugins.value = runtime.plugins
}


function loadPopularExtensions() {

}

function loadUpdatedExtensions() {

}

function loadSimxExtensions() {

}
function loadNewestExtensions() {

}

function loadAllExtensions() {

}
</script>

<style scoped>
.items {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    align-content: space-between;
    padding-left: 5px;
    padding-right: 5px;
    gap: 15px;
}
</style>