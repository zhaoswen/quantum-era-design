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
<style scoped lang="scss">
.sidebar {
  width: 100%;
}

.sidebar .nodes {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  align-items: flex-start;
  justify-items: center;
}

.sidebar .nodes > div {
  margin-bottom: 10px;
  margin-right: 10px;
  font-size: 11px;
  text-align: center;
  line-height: 30px;
  height: 30px;
  width: 75px;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.14);
}

.sidebar .nodes > div:last-child {
  margin-bottom: 0;
}

.sidebar_pack {
  color: #fff;
  font-weight: bold;
  background-color: rgb(0, 94, 149);
}

.sidebar_pack:hover {
  background-color: rgb(0, 160, 255);
  box-shadow: 1px 1px 5px 8px rgba(0, 0, 0, 0.14);
}
</style>