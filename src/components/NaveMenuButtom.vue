<template>
  <el-tooltip :content="label" :placement="location" effect="light">
    <el-button type="primary" :class="{ 'selected': selected }" class="mainBarButton" @click="mainBarButtonClick" :icon="icon">
    </el-button>
  </el-tooltip>
</template>

<script setup lang="ts">
// 任意数量的参数
const mainBarButtonClick = (...attr: any[]) => {
  emit('click', attr);
}

// 自定义事件
const emit = defineEmits(['click']);


defineProps({
  label: {
    type: String,
    required: true,
    default: '菜单按钮'
  },
  location: {
    type: String,
    required: true,
    default: 'right'
  },
  icon: {
    required: true,
  },
  selected: {
    type: Boolean,
    required: false,
    default: false
  }
})

</script>


<style scoped>
.mainBarButton {
  width: 26px;
  height: 28px;
  font-weight: 100;
  font-size: 13px;
  background-color: transparent;
  border: none;
  /* 添加边框以确保按钮样式一致 */
  color: #1c1c1c;
  /* 添加底部外边距以确保间距一致 */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
}

.mainBarButton:hover {
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.29);
  color: #ffffff;
  border: none;
}

.selected{
  color: #69bcff;
}

/* 防止纵向不对齐 */
.el-button + .el-button {
  margin-left: 0;
}


</style>