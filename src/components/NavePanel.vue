<template>
  <div :style="locationBorder == 'left' ? 'border-left: 1px solid #ebebeb;' : 'border-right: 1px solid #ebebeb;'">
    <div class="nav-panel-header">
      <span>{{ title }}</span>
      <div :class="locationBorder != 'top' ? 'default-panel' : ''">
        <slot name="header"></slot>
      </div>
    </div>
    <div class="nav-panel-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'NavePanel',
  props: {
    title: {
      type: String,
      default: '标题'
    },
    width: {
      type: String,
      default: '350px'
    },
    // 指定某个边显示边框
    locationBorder: {
      type: String,
      default: 'left'
    }
  }

}
</script>

<style scoped>
.nav-panel-header {
  height: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(238, 238, 238, 0.27);
  font-size: 12px;
  /* font-weight: bold; */
  text-align: left;
  padding: 5px 16px;
  border-bottom: 1px solid #ebebeb;
  /* 隐藏超出的部分 */
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-family: 'dingtalk', serif;
}

.nav-panel-content {
  padding: 5px 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
}
</style>
