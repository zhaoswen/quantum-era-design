<script setup>
import ExtensionList from '../components/ExtensionList.vue';
</script>

<template>
  <div class="body">
    <el-tabs stretch tab-position="left" style="height: 100%;">
      <el-tab-pane class="tab-body" lazy label="等待更新">
        <ExtensionList sort="updated"/>
      </el-tab-pane>
      <el-tab-pane class="tab-body" lazy label="当前安装">
        <ExtensionList sort="installed"/>
      </el-tab-pane>
      <el-tab-pane class="tab-body" lazy label="官方插件">
        <ExtensionList sort="simx"/>
      </el-tab-pane>
      <el-tab-pane class="tab-body" lazy label="推荐内容">
        <ExtensionList sort="popular"/>
      </el-tab-pane>
      <el-tab-pane class="tab-body" lazy label="全部内容">
        <ExtensionList sort="all"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.body {
  height: calc(100vh - 10px);
  padding: 20px 15px;
}

.tab-body {
  padding: 20px;
}

.el-tabs__item is-left {

}
</style>