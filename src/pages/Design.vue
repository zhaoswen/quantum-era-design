<!--suppress VueUnrecognizedSlot -->
<template>
  <div class="design">
    <div class="tools">
      <div class="left">
        <MainMenu/>
      </div>
      <div class="title_bar right">
        <CollapsibleTools/>
      </div>
    </div>
    <div class="dnd-flow" @drop="onDrop">
      <div class="mainBar mainBarLeft ">
        <div class="mainBarTop">
          <NaveMenuButtom :icon="FolderClose" label="项目" location="right"
                          :selected="runtime.showToolLeft && runtime.currentToolLeft === 'project'"
                          @click="mainBarButtonClick('project', 'left')"/>
          <NaveMenuButtom :icon="Fork" label="版本" location="right" :disabled="true"
                          :selected="runtime.showToolLeft && runtime.currentToolLeft === 'vcs'"
                          @click="mainBarButtonClick('vcs', 'left')"/>
          <NaveMenuButtom :icon="StereoNesting" label="节点" location="right"
                          :selected="runtime.showToolLeft && runtime.currentToolLeft === 'nodes'"
                          @click="mainBarButtonClick('nodes', 'left')"/>
          <NaveMenuButtom :icon="ApiApp" label="封装" location="right" :disabled="true"
                          :selected="runtime.showToolLeft && runtime.currentToolLeft === 'container'"
                          @click="mainBarButtonClick('container', 'left')"/>
        </div>
        <div class="mainBarBottom">
          <NaveMenuButtom :icon="Help" label="问题" location="right" :disabled="true"
                          :selected="runtime.showToolBottom && runtime.currentToolBottom === 'warning'"
                          @click="mainBarButtonClick('warning', 'bottom')"/>
          <NaveMenuButtom :icon="Terminal" label="控制台" location="right"
                          :selected="runtime.showToolBottom && runtime.currentToolBottom === 'console'"
                          @click="mainBarButtonClick('console', 'bottom')"/>
        </div>
      </div>
      <!-- 节点边栏 -->
      <NodesPanel class="panel" v-show="runtime.showToolLeft && runtime.currentToolLeft === 'nodes'"/>
      <ContainerPanel class="panel" v-show="runtime.showToolLeft && runtime.currentToolLeft === 'container'"/>
      <ProjectPanel class="panel" v-show="runtime.showToolLeft && runtime.currentToolLeft === 'project'"/>
      <!-- 流程图 -->
      <div class="design-content">
        <div class="flow-body">
          <VueFlow v-if="showBP" v-model:nodes="flow_store.nodes" v-model:edges="flow_store.edges"
                   @nodeClick="nodeClick" @dragover="onDragOver" @dragleave="onDragLeave">
            <DropzoneBackground :style="{
                            backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
                            transition: 'background-color 0.2s ease',
                        }">
            </DropzoneBackground>
            <MiniMap pannable zoomable v-if="config.design_config.show_minimap"/>
            <template #node-start="startNodeProps">
              <StartNode v-bind="startNodeProps"/>
            </template>
            <template #node-exec="execNodeProps">
              <ExecNode v-bind="execNodeProps"/>
            </template>
            <template #node-note="noteNodeProps">
              <NoteNode v-bind="noteNodeProps"/>
            </template>
            <template #node-pack="packNodeProps">
              <PackNode v-bind="packNodeProps"/>
            </template>
          </VueFlow>
          <el-empty class="empty" image="/icon.png" v-else>
            <template #description>
              <span class="empty-description-text">Simx Era 设计器</span>
            </template>
          </el-empty>
        </div>
        <ConsolePanel class="bottomPanel"
                      v-show="runtime.showToolBottom && runtime.currentToolBottom === 'console'"/>
      </div>
      <AttrPanel class="panel" v-show="runtime.showToolRight && runtime.currentToolRight === 'attr'"/>
      <div class="mainBar mainBarRight ">
        <div class="mainBarTop">
          <NaveMenuButtom :icon="Halo" label="属性" location="left"
                          :selected="runtime.showToolRight && runtime.currentToolRight === 'attr'"
                          @click="mainBarButtonClick('attr', 'right')"/>
          <NaveMenuButtom :icon="CrossRingTwo" label="AI" location="left" :disabled="true"
                          :selected="runtime.showToolRight && runtime.currentToolRight === 'ai'"
                          @click="mainBarButtonClick('ai', 'right')"/>
        </div>
        <div class="mainBarBottom">
          <NaveMenuButtom :icon="SettingConfig" label="配置" location="left"
                          @click="mainBarButtonClick('ai', 'right')"/>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import {
  ApiApp,
  CrossRingTwo,
  FolderClose,
  Fork,
  Halo,
  Help,
  SettingConfig,
  StereoNesting,
  Terminal
} from '@icon-park/vue-next'
import {computed, onBeforeUnmount, onMounted} from 'vue'
import MainMenu from '../components/MainMenu.vue'
import {NodeMouseEvent, useVueFlow, VueFlow} from '@vue-flow/core'
import DropzoneBackground from '../components/DropzoneBackground.vue'
import useDragAndDrop from '../core/flowable.ts'
import {MiniMap} from '@vue-flow/minimap'
import '@vue-flow/minimap/dist/style.css'
import StartNode from '../node/Start.vue'
import ExecNode from '../node/Exec.vue'
import NoteNode from '../node/Note.vue'
import PackNode from '../node/Pack.vue'
import useFlowStore from '../store/flow.ts'
import useProjectStore from '../store/project.ts'
import useRuntimeStore from '../store/runtime.ts'
import NodesPanel from '../panel/NodesPanel.vue'
import ProjectPanel from '../panel/ProjectPanel.vue'
import AttrPanel from '../panel/AttrPanel.vue'
import ContainerPanel from '../panel/ContainerPanel.vue'
import ConsolePanel from '../panel/ConsolePanel.vue'
import NaveMenuButtom from '../components/NaveMenuButtom.vue'
import {handleKeyboardEvent} from '../core/event.ts'
import useConfigStore from "../store/configuration.ts";
import CollapsibleTools from "../components/CollapsibleTools.vue";

const {onConnect, addEdges} = useVueFlow()

const {onDragOver, onDrop, onDragLeave, isDragOver} = useDragAndDrop()

const flow_store = useFlowStore();

const config = useConfigStore();

const showBP = computed(() => {
  return current_project.active_blueprint != '' || flow_store.isNew;
});

// 初始化事件
onMounted(() => {
  window.addEventListener('keydown', handleKeyboardEvent);

})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyboardEvent);
});


const current_project = useProjectStore();
const runtime = useRuntimeStore();

const mainBarButtonClick = (menu: string, location: string) => {
  const handleButtonClick = (showTool: boolean, currentTool: string, setShowTool: (value: boolean) => void, setCurrentTool: (value: string) => void) => {
    if (showTool && currentTool === menu) {
      // 已经打开，且是当前面板
      setShowTool(false);
    } else if (showTool && currentTool !== menu) {
      // 已经打开，但不是当前面板
      setCurrentTool(menu);
    } else {
      // 未打开，设置为显示，并设置为当前面板
      setShowTool(true);
      setCurrentTool(menu);
    }
  };

  switch (location) {
    case 'left':
      handleButtonClick(runtime.showToolLeft, runtime.currentToolLeft, (value) => runtime.showToolLeft = value, (value) => runtime.currentToolLeft = value);
      break;
    case 'right':
      handleButtonClick(runtime.showToolRight, runtime.currentToolRight, (value) => runtime.showToolRight = value, (value) => runtime.currentToolRight = value);
      break;
    case 'bottom':
      handleButtonClick(runtime.showToolBottom, runtime.currentToolBottom, (value) => runtime.showToolBottom = value, (value) => runtime.currentToolBottom = value);
      break;
  }
};

const nodeClick = (nodeMouseEvent: NodeMouseEvent) => {
  let node = nodeMouseEvent.node;
  runtime.attr.basic = node.data.basic;
  // 重新计算节点的值（分析其默认值的类型）
  runtime.attr.component = node.data.component;
  runtime.attr.custom = node.data.custom;
  runtime.attr.params = node.data.params;
}

onConnect(addEdges)
</script>


<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  width: 300px;
}

.mainBar {
  height: 100%;
  /* width: 45px; */
  padding-top: 10px;
  padding-left: 5px;
  padding-right: 5px;
  /* 元素纵向排列，顶对齐，水平居中，间隔10px */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* 修改为顶对齐 */
  align-items: center;

  gap: 20px;
  /* 添加元素间隔 */
}

.mainBarLeft {
  border-right: #ebebeb 1px solid;
}

.mainBarRight {
  border-left: #ebebeb 1px solid;
}

.empty {
  height: 100%;
  width: 100%;
}

.flow-body {
  display: flex;
  flex-direction: column;
  flex: 20;
}

/* 底部面板通用样式 */
.bottomPanel {
  display: flex;
  max-height: 350px;

  flex-direction: column;
  flex: 15;
  border-top: #ebebeb 1px solid;
}

.design {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 11px);
  border-top: #ebebeb 1px solid;

}

.design-content {
  display: flex;
  flex: 20;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
}

.tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;
  border-bottom: #ebebeb 1px solid;
}

.left {
  display: flex;
  justify-content: end;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.right {
  display: flex;
  justify-content: end;
  align-items: center;
}

.title_bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
}

.mainBarTop {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 10px;
}

.mainBarBottom {
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;
  gap: 10px;
  padding-bottom: 5px;
}

.empty-description-text {
  color: #474747;
  font-family: 'dingtalk', serif;
  font-weight: 300;
  font-size: 18px;
}
</style>