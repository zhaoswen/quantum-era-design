<script setup lang="ts">
import {Delete, DisabledComputer, Install, UpdateRotation} from '@icon-park/vue-next'
// 名称
const props = defineProps({
    title: String,
    description: String,
    isInstalled: Boolean,
    canUpdate: Boolean,
});

const handleClick = () => {
    emit('click');
}

// 自定义事件
const emit = defineEmits(['click']);


</script>
<template>
    <div class="nave-item" @click="handleClick">
        <div class="basic_info">
            <span class="title">
                {{ props.title }}
            </span>
            <span class="description">
                {{ props.description }}
            </span>
        </div>
        <div class="operation">
            <el-tooltip content="安装" placement="bottom" effect="light">
                <el-button type="primary" text :icon="Install" v-if="!isInstalled" />
            </el-tooltip>
            <el-tooltip content="更新" placement="bottom" effect="light">
                <el-button type="primary" text :icon="UpdateRotation" v-if="isInstalled && canUpdate" />
            </el-tooltip>
            <el-tooltip content="禁用" placement="bottom" effect="light">
                <el-button type="warning" text :icon="DisabledComputer" v-if="isInstalled" />
            </el-tooltip>
            <el-tooltip content="卸载" placement="bottom" effect="light">
                <el-button type="danger" text :icon="Delete" v-if="isInstalled" />
            </el-tooltip>
        </div>
    </div>
</template>
<style scoped>
.el-button {
    width: 25px;
    height: 25px;
}

/* 基础信息，包括标题和描述 */
.basic_info {
    flex: 8;
}

/* 操作区域 */
.operation {
    /* background: #ababab; */
    display: flex;
    justify-content: end;
    align-items: center;
    height: 100%;
    padding-right: 10px;
    flex: 2;
}

/* 标题文字 */
.title {
    display: block;
    font-size: 13px;
    color: #333;
    margin-left: 10px;
    text-align: start;
    font-family: 'dingtalk',serif;
    width: 100%;
    margin-bottom: 3px;
}

/* 描述文字 */
.description {
    display: block;
    font-size: 11px;
    color: #767676;
    margin-left: 10px;
    text-align: start;
    font-family: 'puhui',serif;
    width: 100%;
}

.nave-item {
    height: 60px;
    width: 100%;
    background-color: #ebebeb;
    box-shadow: 0 0 10px #ebebeb81;
    font-size: 14px;
    cursor: pointer;
    padding-left: 10px;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    border-radius: 5px;
    color: #333;
}

.nave-item:hover {
    background-color: #69bcff2f;
    color: white;
    /* box-shadow: 1px 1px 1px #ebebeb; */
}
</style>