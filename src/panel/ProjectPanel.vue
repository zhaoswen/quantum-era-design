<!-- 项目面板 -->
<template>
  <NavePanel title="项目" locationBorder="right">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="蓝图管理" name="1">
        <div class="items">
          <NaveItem v-for="(item) in project.current_project.blueprints" :selected="item.path === project.active_blueprint" :title="item.name"  @click="handleClick(item.path)">
          </NaveItem>
          <el-empty description="暂无蓝图" v-if="project.current_project.blueprints && project.current_project.blueprints.length === 0"></el-empty>
        </div>
      </el-collapse-item>
      <el-collapse-item title="服务管理" name="2">
        <div v-for="(item) in project.current_project.configs">
          {{ item.name }}
        </div>
        <el-empty description="暂无服务" v-if="project.current_project.configs && project.current_project.configs.length === 0"></el-empty>
      </el-collapse-item>
      <el-collapse-item title="配置管理" name="3">
        <div v-for="(item) in project.current_project.configs">
          {{ item.name }}
        </div>
        <el-empty description="暂无配置" v-if="project.current_project.configs && project.current_project.configs.length === 0"></el-empty>
      </el-collapse-item>
      <el-collapse-item title="资源管理" name="4">
        <div v-for="(item) in project.current_project.dependencies">
          {{ item.name }}
        </div>
        <el-empty description="暂无资源" v-if="project.current_project.dependencies && project.current_project.dependencies.length === 0"></el-empty>
      </el-collapse-item>
    </el-collapse>
  </NavePanel>
</template>
<script lang="ts" setup>
import {ref} from 'vue';
import NavePanel from '../components/NavePanel.vue';
import useProjectStore from '../store/project';
import NaveItem from '../components/NaveItem.vue';
import {read_blueprint} from '../core/blueprint';

const activeName = ref('1')

const project = useProjectStore();


const handleClick = (path: string) => {
  // 打开文件
  project.active_blueprint = path;
  read_blueprint();
}



</script>
<style scoped>
.items{
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  align-content: space-between;
  padding-left: 5px;
  padding-right: 5px;
  gap: 10px;
}

</style>