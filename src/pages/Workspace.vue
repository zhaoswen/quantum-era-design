<script setup lang="ts">
import {DeleteOne, FolderOpen, Plus, RefreshOne} from '@icon-park/vue-next'
import {ElButton, ElContainer, ElMain} from 'element-plus';
import {createProject, deleteProject, loadCache, openProject, openWorkspace, reflushProjectList} from '../core/project'
import useProjectStore from '../store/project';
import {computed, onMounted} from 'vue';

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
        <img src="/icon.png" class="logo" alt="Logo" />
        <!-- 标题 -->
        <span class="title">Simx Flow Design</span>
        <div class="description">Simx Era Design 2025.1 春季版</div>
        <div>
          <el-button type="primary" link @click="openWorkspace">打开工作区</el-button>
        </div>
      </div>
    </el-aside>
    <el-main class="main">
      <div class="flex flex-wrap gap-4" style="height: 100%">
        <el-table :data="project_store.projects" v-show="workspaceOpend" style="width: 100%"
          empty-text="未识别到项目，创建或打开其他目录" class="table">
          <el-table-column label="项目名称" prop="name" />
          <el-table-column label="项目描述" prop="description" />
          <el-table-column label="项目路径" show-overflow-tooltip prop="path" />
          <el-table-column align="right">
            <template #header>
              <el-tooltip content="创建项目" placement="bottom" effect="light">
                <el-button type="primary" size="small" :icon="Plus" @click="createProject"></el-button>
              </el-tooltip>
              <el-tooltip content="刷新列表" placement="bottom" effect="light">
                <el-button type="primary" size="small" :icon="RefreshOne" @click="reflushProjectList()"></el-button>
              </el-tooltip>
            </template>
            <template #default="scope">
              <el-tooltip content="进入项目" placement="bottom" effect="light">
                <el-button size="small" type="primary" :icon="FolderOpen" @click="openProject(scope.row)">
                </el-button>
              </el-tooltip>
              <el-tooltip content="删除项目" placement="bottom" effect="light">
                <el-button size="small" :icon="DeleteOne" type="danger" @click="deleteProject(scope.row)">
                </el-button>
              </el-tooltip>
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
  height: calc(100vh - 10px);
}

.table {
  font-family: 'puhui',serif;
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
  font-family: 'dingtalk',serif;
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
  font-family: 'dingtalk',serif;
}
</style>