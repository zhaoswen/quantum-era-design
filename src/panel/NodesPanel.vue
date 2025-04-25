<script setup>
import useDragAndDrop from '../core/flowable.ts'
import NavePanel from '../components/NavePanel.vue';
import useProjectStore from '../store/project.ts'
import {onMounted} from "vue";

onMounted(() => {
})

const start_node_data = {
  "handler": "none",
  "name": "开始节点",
  "desc": "业务开始节点",
  "params": [
    {
      "key": "service",
      "name": "挂载服务",
      "desc": "当前开始节点挂载的服务",
      "type": "Select",
      "default_value": "none",
      "require": true,
      "options": [
        {
          "value": "none",
          "label": "无"
        },
        {
          "value": "cron",
          "label": "定时任务"
        },
        {
          "value": "http",
          "label": "Http 监听(模拟)"
        },
      ]
    },
    {
      "key": "parallelization",
      "name": "并行化",
      "desc": "异步指定所有下游节点",
      "type": "Boolean",
      "default_value": false,
      "require": true,
      "options": []
    }
  ]
}

const {onDragStart} = useDragAndDrop()
const project = useProjectStore();
</script>

<template>
  <NavePanel title="节点" locationBorder="right">
    <div class="sidebar">
      <el-collapse accordion>
        <!-- 设计基础不会改变，一直都是这些/与流程无关 -->
        <el-collapse-item title="设计基础" name="1">
          <div class="nodes">
            <div class="sidebar_start" :draggable="true"
                 @dragstart="onDragStart($event, 'start', start_node_data.name, start_node_data.handler, start_node_data)">
              开始节点
            </div>
            <div class="sidebar_note" :draggable="true" @dragstart="onDragStart($event, 'note', '蓝图便笺', 'none')">
              蓝图便笺
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item :title="item.name" :name="item.id" v-for="item in project.current_plugins_handler">
          <div class="nodes">
            <div v-for="handler in item.func" class="sidebar_exec" :draggable="true"
                 @dragstart="onDragStart($event, 'exec', handler.name, handler.handler, handler)">
              {{ handler.name }}
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

.sidebar .nodes {
  display: flex;
  flex-wrap: wrap; /* 允许换行 */
  justify-content: left; /* 子元素之间有间距 */
  align-items: flex-start;
  justify-items: center;
}

.sidebar .nodes > div {
  margin-bottom: 10px;
  margin-right: 10px; /* 添加水平间距 */
  font-size: 11px;
  text-align: center;
  line-height: 30px;
  height: 30px;
  /*width: calc(33.333% - 10px); */
  width: 90px; /* 每行显示三个节点 */
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
}

.sidebar .nodes > div:last-child {
  margin-bottom: 0;
}

.sidebar_start {
  color: #fff;
  font-weight: bold;
  background-color: rgb(5, 88, 35);
}

.sidebar_start:hover {
  background-color: rgb(4, 158, 59);
}

.sidebar_exec {
  color: #fff;
  font-weight: bold;
  background-color: rgb(0, 94, 149);
}

.sidebar_exec:hover {
  background-color: rgb(0, 113, 181);
}

.sidebar_note {
  color: #fff;
  font-weight: bold;
  background-color: #939393;
}

.sidebar_note:hover {
  background-color: #b5b5b5;
}
</style>