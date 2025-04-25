<template>
  <div class="expandable-button">
    <NaveMenuButtom :icon="currentIcon" location="" label="显示/隐藏主菜单" @click="toggleExpand"/>
    <div v-if="isExpanded" class="expanded-button">
      <!-- 文件菜单 -->
      <el-dropdown>
        <span class="el-dropdown-link">
          文件
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>创建新蓝图</el-dropdown-item>
            <el-dropdown-item>创建新项目</el-dropdown-item>
            <el-dropdown-item divided>关闭当前蓝图</el-dropdown-item>
            <el-dropdown-item>回到工作空间</el-dropdown-item>
            <el-dropdown-item>关闭当前项目</el-dropdown-item>
            <el-dropdown-item divided>修改项目属性</el-dropdown-item>
            <el-dropdown-item>退出设计器程序</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 编辑菜单 -->
      <el-dropdown>
        <span class="el-dropdown-link">
          编辑
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>撤销</el-dropdown-item>
            <el-dropdown-item>重做</el-dropdown-item>
            <el-dropdown-item>复制</el-dropdown-item>
            <el-dropdown-item>粘贴</el-dropdown-item>
            <el-dropdown-item>剪切</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 执行菜单 -->
      <el-dropdown>
        <span class="el-dropdown-link">
          执行
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>运行蓝图</el-dropdown-item>
            <el-dropdown-item>运行项目</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 编译菜单 -->
      <el-dropdown>
        <span class="el-dropdown-link">
          编译
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>编译蓝图</el-dropdown-item>
            <el-dropdown-item>编译项目</el-dropdown-item>
            <el-dropdown-item>编译并打包蓝图</el-dropdown-item>
            <el-dropdown-item>编译并打包项目</el-dropdown-item>
            <el-dropdown-item divided>清除编译缓存</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 工具菜单 -->
      <el-dropdown>
        <span class="el-dropdown-link">
          工具
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>插件管理</el-dropdown-item>
            <el-dropdown-item>版本管理</el-dropdown-item>
            <el-dropdown-item>编译管理</el-dropdown-item>
            <el-dropdown-item>校验管理</el-dropdown-item>
            <el-dropdown-item divided>系统配置</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 帮助菜单 -->
      <el-dropdown>
        <span class="el-dropdown-link">
          帮助
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>关于设计器</el-dropdown-item>
            <el-dropdown-item>使用者文档</el-dropdown-item>
            <el-dropdown-item>开发者文档</el-dropdown-item>
            <el-dropdown-item>了解Melt 项目</el-dropdown-item>
            <el-dropdown-item divided>检查设计器更新</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {HamburgerButton, MenuUnfold} from "@icon-park/vue-next";
import NaveMenuButtom from "./NaveMenuButtom.vue";


const isExpanded = ref(false);
const currentIcon = ref(HamburgerButton);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
  currentIcon.value = isExpanded.value ? MenuUnfold : HamburgerButton;
};

</script>

<style scoped>
.expandable-button {
  display: flex;
  align-items: center;
}


.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.expanded-button {
  padding-top: 3px;
  color: #606266;
  font-size: 10px;
  margin-right: 5px;
  font-weight: normal;
  font-family: "dingtalk", sans-serif;
}

.expanded-button >  * {
  margin-left: 15px;
}

</style>