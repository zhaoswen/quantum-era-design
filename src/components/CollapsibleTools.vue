<template>
  <div class="expandable-button">

    <div v-if="isExpanded" class="expanded-buttons-container">
      <transition-group name="fade" tag="div" class="expanded-buttons">
        <NaveMenuButtom :icon="Add" label="新建蓝图" location="bottom" @click="createNew"/>
        <NaveMenuButtom :icon="DownloadThree" label="保存修改" location="bottom" @click="saveFile"/>
        <NaveMenuButtom :icon="Lightning" label="运行蓝图" location="bottom" @click="runFile"/>
        <NaveMenuButtom :icon="ApplicationOne" label="打包蓝图" location="bottom" @click="compile_package"/>
        <!--        <NaveMenuButtom :icon="Refresh" :disabled="true" label="刷新依赖" location="bottom"-->
        <!--                        @click="refreshProjectDependencies"/>-->
        <!--        <NaveMenuButtom :icon="Deeplink" label="刷新组件属性" location="bottom" @click="refreshProjectDependencies"/>-->
        <!--        <NaveMenuButtom :icon="Erase" label="清空蓝图" location="bottom" @click="cleanFile"/>-->
        <NaveMenuButtom :icon="CloseOne" label="关闭蓝图" location="bottom" @click="closeFile"/>
        <NaveMenuButtom :icon="DoubleUp" label="返回工作空间" location="bottom" @click="backToProject"/>
      </transition-group>
    </div>
    <NaveMenuButtom :icon="currentIcon" location="" label="" @click="toggleExpand"/>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {
  Add,
  ApplicationOne,
  CloseOne,
  DoubleUp,
  DownloadThree,
  Lightning, MoreApp,
} from "@icon-park/vue-next";
import NaveMenuButtom from "./NaveMenuButtom.vue";
import {compile_package} from "../core/compiler.ts";
import useProjectStore from "../store/project.ts";
import useRuntimeStore from "../store/runtime.ts";
import useFlowStore from "../store/flow.ts";
import {run_blueprint, save_blueprint} from "../core/blueprint.ts";
import {success, warn} from "../tools/message.ts";
import {save} from '@tauri-apps/plugin-dialog';

const current_project = useProjectStore();
const flow_store = useFlowStore();

// 默认展开
const isExpanded = ref(true);
const currentIcon = ref(MoreApp);
const runtime = useRuntimeStore();

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
  currentIcon.value = isExpanded.value ? MoreApp : MoreApp;
};

const showBP = computed(() => {
  return current_project.active_blueprint != '' || flow_store.isNew;
});

// 新建蓝图
const createNew = () => {
  // 先关闭文件
  closeFile();
  flow_store.name = '蓝图';
  flow_store.isSave = false;
  flow_store.isNew = true;
}

// 保存蓝图
const saveFile = () => {
  // 如果当前有活跃的蓝图，就覆盖，如果没有，就让用户选择保存位置
  if (showBP.value && current_project.active_blueprint != '') {
    save_blueprint().then(_ => {
      success('当前蓝图已保存');
      flow_store.isSave = true;
    });
  } else {
    saveAsFile()
    flow_store.isSave = false;
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
        flow_store.isSave = true;
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



const backToProject = () => {
  runtime.pageIndex = "0";
}

// 关闭文件
// TODO：检验文件是否已保存
const closeFile = () => {
  flow_store.reset();
  current_project.active_blueprint = '';
  flow_store.isSave = false;
};


// // 刷新依赖
// const refreshProjectDependencies = async (force: boolean = true) => {
//   const project = useProjectStore();
//   const runtime = useRuntimeStore();
//   const root_path = runtime.engineCorePath + "/extension";
//   // invoke(invoke)
//   if (force) {
//     // 删除根目录下的extension文件夹（临时方案）
//     invoke('dir_remove', {path: root_path}).then(res => {
//       if (res) {
//         info('依赖已刷新');
//       } else {
//         warn('依赖刷新失败');
//       }
//     });
//     // 重新拉取依赖
//     await loadProjectDependencies(project.project_dependencies);
//   }
// };

// const cleanFile = () => {
//   if (current_project.active_blueprint == undefined || current_project.active_blueprint == '') {
//     warn('请先选择一个蓝图');
//     return;
//   }
//   reset_blueprint();
//   info('当前蓝图已清空');
//   flow_store.isSave = false;
// };

</script>

<style scoped>
.expandable-button {
  display: flex;
  align-items: center;
}

.expanded-buttons {
  display: flex;
  margin-left: 10px;
  overflow: visible;
}

.expanded-button {
  color: #606266;
  font-size: 13px;
  margin-right: 5px;
}
</style>