<script setup>
import {Handle, Position} from '@vue-flow/core';
import {ref, watch} from 'vue';
import useRuntimeStore from '../store/runtime';
import {Components} from '@icon-park/vue-next'

const props = defineProps(['data']);
const boxClass = ref("");

const runtime = useRuntimeStore();
watch(() => runtime.attr.basic.id, (newVal) => {
    if (newVal === props.data.basic.id) {
        boxClass.value = "custom-node-selected";
    } else {
        boxClass.value = "";
    }
});
</script>

<template>
    <div class="custom-node exec_node" :class="boxClass">
        <Handle type="target" :position="Position.Left" />
        <Components class="icon" />
        <div>{{ data.basic.label }}</div>
        <Handle type="source" :position="Position.Right" />
    </div>
</template>

<style scoped>
.exec_node {
    color: #fff;
    background: rgb(0, 94, 149);
}
.icon{
    margin-right: 5px;
}
</style>