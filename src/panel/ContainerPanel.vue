<script setup>
import useDragAndDrop from '../core/flowable.ts'
import NavePanel from '../components/NavePanel.vue';

const { onDragStart } = useDragAndDrop()
</script>

<template>
  <NavePanel title="封装包" locationBorder="right">
    <div class="sidebar">
      <el-collapse accordion>
        <el-collapse-item title="Nacos" name="1">
          <div class="nodes">
            <div class="sidebar_pack" :draggable="true" @dragstart="onDragStart($event, 'pack', '打印数据')">
              打印数据
            </div>
            <div class="sidebar_pack" :draggable="true" @dragstart="onDragStart($event, 'pack', '发起子流程')">
              发起子流程
            </div>
            <div class="sidebar_pack" :draggable="true" @dragstart="onDragStart($event, 'pack', '同步等待')">
              同步等待
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="Redis" name="2">
          <div class="nodes">
            <div class="sidebar_pack" :draggable="true" @dragstart="onDragStart($event, 'pack', '设置变量')">
              设置变量
            </div>
            <div class="sidebar_pack" :draggable="true" @dragstart="onDragStart($event, 'pack', '修改变量')">
              修改变量
            </div>
            <div class="sidebar_pack" :draggable="true" @dragstart="onDragStart($event, 'pack', '清除变量')">
              清除变量
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </NavePanel>
</template>

<style scoped>
.sidebar {
  width: 100%;
}

.sidebar .nodes > div {
  margin-bottom: 10px;
  text-align: center;
  line-height: 35px;
  height: 35px;
  width: 100%;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
}

.sidebar .nodes>div:last-child {
  margin-bottom: 0;
}

.sidebar_pack {
  color: #fff;
  font-weight: bold;
  background-color: rgb(89, 144, 255);
}

.sidebar_pack:hover {
  background-color: rgb(0, 85, 255);
}
</style>