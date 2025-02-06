<template>
  <div class="expandable-button">
    <NaveMenuButtom :icon="currentIcon" location="" label="显示/隐藏主菜单" @click="toggleExpand"/>
    <div v-if="isExpanded" class="expanded-button">
      <!-- 文件菜单 -->
      <el-dropdown>
        <span class="el-dropdown-link">
          文件
          <el-icon class="el-icon--right">
            <arrow-down/>
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>创建蓝图</el-dropdown-item>
            <el-dropdown-item>创建项目</el-dropdown-item>
            <el-dropdown-item divided>关闭蓝图</el-dropdown-item>
            <el-dropdown-item>关闭项目</el-dropdown-item>
            <el-dropdown-item divided>项目属性</el-dropdown-item>
            <el-dropdown-item>退出程序</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 编辑菜单 -->
      <el-dropdown>
        <span class="el-dropdown-link">
          编辑
          <el-icon class="el-icon--right">
            <arrow-down/>
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
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
          <el-icon class="el-icon--right">
            <arrow-down/>
          </el-icon>
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
          <el-icon class="el-icon--right">
            <arrow-down/>
          </el-icon>
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
          <el-icon class="el-icon--right">
            <arrow-down/>
          </el-icon>
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
          <el-icon class="el-icon--right">
            <arrow-down/>
          </el-icon>
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
      <!--        <el-button v-for="button in buttons" :key="button.label" type="text" class="expanded-button"-->
      <!--                   @click="handleButtonClick(button)">-->
      <!--          {{ button.label }}-->
      <!--        </el-button>-->
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {ElButton} from 'element-plus';
import {HamburgerButton, MenuUnfold} from "@icon-park/vue-next";
import NaveMenuButtom from "./NaveMenuButtom.vue";

export default defineComponent({
  components: {
    NaveMenuButtom,
    ElButton,
  },
  setup() {
    const isExpanded = ref(false);
    const currentIcon = ref(HamburgerButton);
    const buttons = [
      {label: '文件', action: () => console.log('Button 1 clicked')},
      {label: '编辑', action: () => console.log('Button 2 clicked')},
      {label: '视图', action: () => console.log('Button 3 clicked')},
      {label: '工具', action: () => console.log('Button 4 clicked')},
      {label: '调试', action: () => console.log('Button 5 clicked')},
      {label: '编译', action: () => console.log('Button 6 clicked')},
      {label: '版本', action: () => console.log('Button 7 clicked')},
      {label: '窗口', action: () => console.log('Button 8 clicked')},
      {label: '帮助', action: () => console.log('Button 9 clicked')},
    ];

    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value;
      currentIcon.value = isExpanded.value ? MenuUnfold : HamburgerButton;
    };

    const handleButtonClick = (button: { label: string; action: () => void }) => {
      button.action();
    };

    return {
      isExpanded,
      currentIcon,
      buttons,
      toggleExpand,
      handleButtonClick,
    };
  },
});
</script>

<style scoped>
.expandable-button {
  display: flex;
  align-items: center;
}

.expanded-buttons {
  display: flex;
  margin-left: 10px;
  overflow: visible; /* 确保不会隐藏过渡效果 */
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
  margin-left: 15px;
  padding-top: 5px;
  color: #606266;
  font-size: 12px;
  margin-right: 5px;
  font-weight: normal;
  font-family: "dingtalk", sans-serif;
}
</style>