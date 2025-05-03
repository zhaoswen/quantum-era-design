<script setup>
import {Handle, Position} from '@vue-flow/core';
import {ref, watch} from 'vue';
import useRuntimeStore from '../store/runtime';
import {Checkbox} from '@icon-park/vue-next'

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
    <div class="custom-node pack_node" :class="boxClass">
        <Handle type="target" :position="Position.Left" />
        <Checkbox class="icon" />
        <div>{{ data.basic.label }}</div>
        <Handle type="source" :position="Position.Right" />
    </div>
</template>

<style scoped>
.pack_node {
    color: #fff;
    background: rgb(89, 144, 255);
}
.icon{
    margin-right: 5px;
}
</style>