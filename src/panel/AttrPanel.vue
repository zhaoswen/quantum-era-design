<template>
    <NavePanel title="属性">
        <el-tabs v-model="activeName" tab-position="top" @tab-click="handleClick" stretch class="tabs">
            <el-tab-pane label="基础" name="basic">
                <el-form :model="runtime.attr.basic" label-position="top">
                    <el-form-item label="节点标识">
                        <el-input v-model="runtime.attr.basic.id" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="节点名称">
                        <el-input v-model="runtime.attr.basic.label"></el-input>
                    </el-form-item>
                    <el-form-item label="节点处理器">
                        <el-input v-model="runtime.attr.basic.handler" disabled></el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="组件" name="comp">
                <el-form :model="runtime.attr.component" label-position="top">
                    <el-form-item :label="item.name" v-for="item in runtime.attr.params">
                        <template #label>
                            {{ item.name }}
                        </template>
                        <el-tooltip :content="item.desc" placement="top" effect="dark">
                            <!-- 下拉框 -->
                            <el-select v-if="item.type === 'Select'" v-model="runtime.attr.component[item.key]"
                                placeholder="请选择 #{item.name}">
                                <el-option v-for="option in item.options" :key="option.value" :label="option.label"
                                    :value="option.value"></el-option>
                            </el-select>
                            <!-- 数字输入框 -->
                            <el-input-number v-else-if="item.type === 'Number'"
                                v-model="runtime.attr.component[item.key]" />
                            <!-- 开关 -->
                            <el-switch v-else-if="item.type === 'Boolean'" v-model="runtime.attr.component[item.key]" />
                            <!-- 日期选择 -->
                            <el-date-picker v-else-if="item.type === 'Date'" v-model="runtime.attr.component[item.key]"
                                type="date" placeholder="选择日期" />
                            <!-- 时间选择 -->
                            <el-time-picker v-else-if="item.type === 'Time'" v-model="runtime.attr.component[item.key]"
                                placeholder="选择时间" />
                            <!-- 日期时间选择 -->
                            <el-date-picker v-else-if="item.type === 'Datetime'"
                                v-model="runtime.attr.component[item.key]" type="datetime" placeholder="选择日期时间" />
                            <!-- 文本输入框 -->
                            <el-input v-else v-model="runtime.attr.component[item.key]"></el-input>
                        </el-tooltip>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="自定义" name="custom">
                <el-form :model="runtime.attr.custom" label-position="top">
                    <div v-for="(item, index) in Object.keys(runtime.attr.custom)">
                        <el-input :prefix-icon="MilkTea" v-model="runtime.attr.custom[index]" placeholder="格式key:value"
                            class="input-with-custom">
                            <template #append>
                                <el-button type="warning" @click="handleCustomRemove(index)" :icon="Delete" />
                            </template>
                        </el-input>
                    </div>
                    <el-button type="primary" class="add-custom" @click="addCustom">添加</el-button>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </NavePanel>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {ElForm, ElFormItem, ElInput} from 'element-plus';
import NavePanel from '../components/NavePanel.vue';
import {Delete, MilkTea} from '@element-plus/icons-vue';
import useRuntimeStore from '../store/runtime';

const activeName = ref('basic') // 修改为正确的初始值

const runtime = useRuntimeStore();
const handleClick = (tab: string) => { // 修改参数类型
}

const handleCustomRemove = (index: number) => {
    runtime.attr.custom.splice(index, 1)
}

const addCustom = () => {
    runtime.attr.custom.push('')
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