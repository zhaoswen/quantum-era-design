<script setup lang="ts">
import {DeleteOne, FolderOpen, Plus, RefreshOne} from '@icon-park/vue-next'
import {ElButton, ElContainer, ElMain} from 'element-plus';
import {createProject, deleteProject, loadCache, openProject, openWorkspace, reflushProjectList} from '../core/project'
import useProjectStore from '../store/project';
import {computed, onMounted} from 'vue';
import NaveMenuButtom from "../components/NaveMenuButtom.vue";

const project_store = useProjectStore();

onMounted(() => {
  // 加载本地缓存
  loadCache();
  if (project_store.workspace_path != "") {
    reflushProjectList();
  }
});

const workspaceOpend = computed(() => {
  return project_store.workspace_path != "";
});
</script>

<template>
  <el-container class="main_container">
    <el-aside class="aside">
      <div>
        <!-- 图片Logo -->
        <img src="/icon.png" class="logo" alt="Logo"/>
        <!-- 标题 -->
        <span class="title">Simx Flow Design</span>
        <div class="description">Simx Era Design 2025.2 夏季版</div>
        <div>
          <el-tooltip content="点击打开工作区，也可以选择一个空文件夹作为工作区" placement="bottom" effect="light">
            <el-button type="primary" link @click="openWorkspace">点击打开一个工作区</el-button>
          </el-tooltip>
        </div>
      </div>
    </el-aside>
    <el-main class="main">
      <div class="flex flex-wrap gap-4" style="height: 100%">
        <el-table :data="project_store.projects" v-show="workspaceOpend" style="width: 100%"
                  empty-text="未识别到项目，创建或打开其他目录" class="table">
          <el-table-column label="项目名称" prop="name"/>
          <el-table-column label="项目描述" prop="description"/>
          <el-table-column label="项目路径" show-overflow-tooltip prop="path"/>
          <el-table-column align="right">
            <template #header>
              <div class="headler-button">
                <NaveMenuButtom :icon="Plus" location="" label="创建项目" @click="createProject"/>
                <NaveMenuButtom :icon="RefreshOne" location="" label="刷新列表" @click="reflushProjectList"/>
              </div>
            </template>
            <template #default="scope">
              <div class="headler-button">
                <NaveMenuButtom :icon="FolderOpen" location="" label="进入项目" @click="openProject(scope.row)"/>
                <NaveMenuButtom :icon="DeleteOne" location="" label="删除项目" @click="deleteProject(scope.row)"/>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-empty v-show="!workspaceOpend" style="height: 100%;" description="请先创建一个工作区">
          <el-button type="primary" link @click="openWorkspace">打开工作区</el-button>
        </el-empty>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>
.main_container {
  max-height: 100vh;
  height: calc(100vh - 10px);
  overflow: auto;
}

.table {
  font-family: 'puhui', serif;
}

.headler-button {
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 10px;
}

.aside {
  /* 垂直居中对齐 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30%;
  border-right: #ebebeb 1px solid;
}

.logo {
  width: 180px;
  margin-bottom: 25px;
}

.title {
  font-size: 25px;
  font-family: 'dingtalk', serif;
  font-weight: bold;
  margin-bottom: 15px;
  color: #000;
  display: block;
}

.description {
  font-size: 14px;
  font-weight: normal;
  margin-bottom: 50px;
  color: #5b5b5b;
  display: block;
  font-family: 'dingtalk', serif;
}
</style>