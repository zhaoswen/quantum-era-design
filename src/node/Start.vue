<script setup>
import {Handle, Position} from '@vue-flow/core'
import {ref, watch} from 'vue';
import useRuntimeStore from '../store/runtime';
import {AssemblyLine} from '@icon-park/vue-next'

const props = defineProps(['data'])
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
    <div class="custom-node start_node" :class="boxClass">
        <AssemblyLine class="icon" />
        <div>{{ data.basic.label }}</div>
        <Handle type="source" :position="Position.Bottom" />
    </div>
</template>

<style scoped>
.start_node {
    color: #fff;
    background: rgb(105, 123, 255);
}
.icon{
    margin-right: 5px;
}
</style>