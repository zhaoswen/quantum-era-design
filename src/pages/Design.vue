<template>
  <div class="design">
    <div class="tools">
      <div class="left">
        <el-page-header :icon="ArrowLeft" @click="backToProject">
          <template #title>
            <span class="blueprint_title_text"> 返回 </span>
          </template>
          <template #content>
            <span class="blueprint_title_text"> {{
                current_project.active_blueprint == "" ? "未打开文件" : current_project.active_blueprint.split('/').pop()?.split('\\').pop()
              }} </span>
          </template>
        </el-page-header>
      </div>
      <div class="title_bar right">
        <NaveMenuButtom :icon="Add" label="新建蓝图" location="bottom" @click="createNew"/>
        <NaveMenuButtom :icon="Save" label="保存修改" location="bottom" @click="saveFile"/>
        <NaveMenuButtom :icon="Lightning" label="运行蓝图" location="bottom" @click="runFile"/>
        <NaveMenuButtom :icon="Refresh" label="刷新依赖" location="bottom" @click="refreshProjectDependencies"/>
        <NaveMenuButtom :icon="Deeplink" label="刷新组件属性" location="bottom" @click="refreshProjectDependencies"/>
        <NaveMenuButtom :icon="Erase" label="清空蓝图" location="bottom" @click="cleanFile"/>
        <NaveMenuButtom :icon="CloseOne" label="关闭蓝图" location="bottom" @click="closeFile"/>
      </div>
    </div>
    <div class="dnd-flow" @drop="onDrop">
      <div class="mainBar mainBarLeft ">
        <div class="mainBarTop">
          <NaveMenuButtom :icon="FolderClose" label="项目管理" location="right"
                          :selected="runtime.showToolLeft && runtime.currentToolLeft === 'project'"
                          @click="mainBarButtonClick('project', 'left')"/>
          <NaveMenuButtom :icon="Fork" label="版本控制" location="right"
                          :selected="runtime.showToolLeft && runtime.currentToolLeft === 'vcs'"
                          @click="mainBarButtonClick('vcs', 'left')"/>
          <NaveMenuButtom :icon="Components" label="节点列表" location="right"
                          :selected="runtime.showToolLeft && runtime.currentToolLeft === 'nodes'"
                          @click="mainBarButtonClick('nodes', 'left')"/>
          <NaveMenuButtom :icon="Checkbox" label="封装包" location="right"
                          :selected="runtime.showToolLeft && runtime.currentToolLeft === 'container'"
                          @click="mainBarButtonClick('container', 'left')"/>
        </div>
        <div class="mainBarBottom">
          <NaveMenuButtom :icon="Help" label="项目问题" location="right"
                          :selected="runtime.showToolBottom && runtime.currentToolBottom === 'warning'"
                          @click="mainBarButtonClick('warning', 'bottom')"/>
          <NaveMenuButtom :icon="CodeComputer" label="控制台" location="right"
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
          <NaveMenuButtom :icon="DashboardOne" label="节点属性" location="left"
                          :selected="runtime.showToolRight && runtime.currentToolRight === 'attr'"
                          @click="mainBarButtonClick('attr', 'right')"/>
          <NaveMenuButtom :icon="Robot" label="人工智能" location="left"
                          :selected="runtime.showToolRight && runtime.currentToolRight === 'ai'"
                          @click="mainBarButtonClick('ai', 'right')"/>
        </div>
        <div class="mainBarBottom">
          <NaveMenuButtom :icon="SettingConfig" label="系统配置" location="left"
                          @click="mainBarButtonClick('ai', 'right')"/>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import {
  Add,
  ArrowLeft,
  Checkbox,
  CloseOne,
  CodeComputer,
  Components,
  DashboardOne,
  Deeplink,
  Erase,
  FolderClose,
  Fork,
  Help,
  Lightning,
  Refresh,
  Robot,
  Save,
  SettingConfig
} from '@icon-park/vue-next'
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'
import {NodeMouseEvent, useVueFlow, VueFlow} from '@vue-flow/core'
import DropzoneBackground from '../components/DropzoneBackground.vue'
import useDragAndDrop from '../core/flowable.ts'
import {reset_blueprint, run_blueprint, save_blueprint} from '../core/blueprint.ts';
import {MiniMap} from '@vue-flow/minimap'
import '@vue-flow/minimap/dist/style.css'
import StartNode from '../node/Start.vue'
import ExecNode from '../node/Exec.vue'
import NoteNode from '../node/Note.vue'
import PackNode from '../node/Pack.vue'
import useFlowStore from '../store/flow.ts'
import useProjectStore from '../store/project.ts'
import {info, success, warn} from '../tools/message.ts'
import {save} from '@tauri-apps/plugin-dialog';
import useRuntimeStore from '../store/runtime.ts'
import NodesPanel from '../panel/NodesPanel.vue'
import ProjectPanel from '../panel/ProjectPanel.vue'
import AttrPanel from '../panel/AttrPanel.vue'
import ContainerPanel from '../panel/ContainerPanel.vue'
import ConsolePanel from '../panel/ConsolePanel.vue'
import NaveMenuButtom from '../components/NaveMenuButtom.vue'
import {handleKeyboardEvent} from '../core/event.ts'
import {loadProjectDependencies} from '../core/plugin.ts'
import {invoke} from '@tauri-apps/api/core'
import useConfigStore from "../store/configuration.ts";

const {onConnect, addEdges} = useVueFlow()

const {onDragOver, onDrop, onDragLeave, isDragOver} = useDragAndDrop()

const flow_store = useFlowStore();

const config = useConfigStore();

const saved = ref(true);

const isNew = ref(false);

const showBP = computed(() => {
  return current_project.active_blueprint != '' || isNew.value;
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

const backToProject = () => {
  runtime.pageIndex = "0";
}

const nodeClick = (nodeMouseEvent: NodeMouseEvent) => {
  let node = nodeMouseEvent.node;
  runtime.attr.basic = node.data.basic;
  // 重新计算节点的值（分析其默认值的类型）
  runtime.attr.component = node.data.component;
  runtime.attr.custom = node.data.custom;
  runtime.attr.params = node.data.params;
}

const createNew = () => {
  // 先关闭文件
  closeFile();
  flow_store.name = '蓝图';
  saved.value = false;
  isNew.value = true;
}

// const openFile = () => {
//   open({
//     multiple: false,
//     directory: false,
//     canCreateDirectories: true,
//     title: '选择蓝图',
//     filters: [
//       {
//         name: 'Blueprint 设计文件',
//         extensions: ['bps'],
//       },
//       {
//         name: 'Blueprint 设计文件 (带注释)',
//         extensions: ['bpm'],
//       },
//       {
//         name: 'Blueprint 执行文件',
//         extensions: ['bp'],
//       },
//     ],
//   }).then(res => {
//     if (res === null) {
//       return;
//     }
//     // 先关闭文件
//     closeFile();
//     // 设置目标文件
//     current_project.active_blueprint = res as string;
//     // 解析并显示
//     read_blueprint();
//     saved.value = true;
//   });
// };

const saveFile = () => {
  // 如果当前有活跃的蓝图，就覆盖，如果没有，就让用户选择保存位置
  if (showBP.value && current_project.active_blueprint != '') {
    save_blueprint().then(_ => {
      success('当前蓝图已保存');
      saved.value = true;
    });
  } else {
    saveAsFile()
    isNew.value = false;
  }
};

// 另存为
const saveAsFile = () => {
  save({
    canCreateDirectories: true,
    title: '选择储存位置',
    defaultPath: current_project.project_path + "/blueprint",
    filters: [
      {
        name: 'Blueprint 设计文件',
        extensions: ['bps'],
      },
      {
        name: 'Blueprint 设计文件 (含注释)',
        extensions: ['bpm'],
      },
    ],
  }).then(res => {
    if (res != undefined && res != '') {
      save_blueprint(res as string).then(() => {
        // 设置激活文件
        current_project.active_blueprint = res as string;
        saved.value = true;
      })
    }
  });
}

const runFile = () => {
  if (current_project.active_blueprint == undefined || current_project.active_blueprint == '') {
    warn('请先选择一个蓝图');
    return;
  }
  run_blueprint();
};

// const compileFile = () => {
//   if (current_project.active_blueprint == undefined || current_project.active_blueprint == '') {
//     warn('请先选择一个蓝图');
//     return;
//   }
//   compile_blueprint().then(_ => {
//     success('当前蓝图编译成功');
//   });
// };

const cleanFile = () => {
  if (current_project.active_blueprint == undefined || current_project.active_blueprint == '') {
    warn('请先选择一个蓝图');
    return;
  }
  reset_blueprint();
  info('当前蓝图已清空');
  saved.value = false;
};

// 刷新依赖
const refreshProjectDependencies = async (force: boolean = true) => {
  const project = useProjectStore();
  const runtime = useRuntimeStore();
  const root_path = runtime.engineCorePath + "/extension";
  console.log("========> ", project.project_dependencies)
  // invoke(invoke)
  if (force) {
    // 删除根目录下的extension文件夹（临时方案）
    invoke('dir_remove', {path: root_path}).then(res => {
      if (res) {
        info('依赖已刷新');
      } else {
        warn('依赖刷新失败');
      }
    });
    // 重新拉取依赖
    await loadProjectDependencies(project.project_dependencies);
  }
};

// 关闭文件
// TODO：检验文件是否已保存
const closeFile = () => {
  flow_store.reset();
  current_project.active_blueprint = '';
  saved.value = false;
};


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
  height: calc(100vh - 10px);
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
  padding-left: 10px;
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

.blueprint_title_text {
  color: #626262;
  font-family: 'dingtalk', serif;
  font-weight: 400;
  font-size: 13px;
}

.empty-description-text {
  color: #474747;
  font-family: 'dingtalk', serif;
  font-weight: 300;
  font-size: 18px;
}
</style>