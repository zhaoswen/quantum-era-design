<template>
  <div class="expandable-button">
    <NaveMenuButtom :icon="currentIcon" location="" label="" @click="toggleExpand"/>
    <div v-if="isExpanded" class="expanded-buttons-container">
      <transition-group name="fade" tag="div" class="expanded-buttons">
        <el-button v-for="button in buttons" :key="button.label" type="text" class="expanded-button"
                   @click="handleButtonClick(button)">
          {{ button.label }}
        </el-button>
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {ElButton} from 'element-plus';
import {HamburgerButton, MenuUnfold} from "@icon-park/vue-next";
import NaveMenuButtom from "./NaveMenuButtom.vue";
import {Direction} from "../types/common";

const isExpanded = ref(false);
const currentIcon = ref(HamburgerButton);

const props = defineProps({
  buttons: {
    type: Array,
    default: []
  },
  // 展开方向（向哪个方向展开）
  direction: {
    type: Direction,
    default: Direction.down
  }
})

const buttons = [
  {label: '文件', action: () => console.log('Button 1 clicked')},
  {label: '编辑', action: () => console.log('Button 2 clicked')},
  {label: '视图', action: () => console.log('Button 3 clicked')},
  {label: '工具', action: () => console.log('Button 4 clicked')},
  {label: '调试', action: () => console.log('Button 5 clicked')},
  {label: '编译', action: () => console.log('Button 6 clicked')},
  {label: 'VCS', action: () => console.log('Button 7 clicked')},
  {label: '帮助', action: () => console.log('Button 8 clicked')},
];

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
  currentIcon.value = isExpanded.value ? MenuUnfold : HamburgerButton;
};

const handleButtonClick = (button: { label: string; action: () => void }) => {
  button.action();
};

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