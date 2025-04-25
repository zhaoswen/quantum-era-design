<script setup lang="ts">
import {FileQuality} from '@icon-park/vue-next'
// 名称
const props = defineProps({
  title: String,
  selected: Boolean,
});


const handleClick = () => {
  emit('click');
}

// 自定义事件
const emit = defineEmits(['click']);


</script>
<template>
  <div class="nave-item" :class="{ 'selected': props.selected }" @click="handleClick">
    <el-icon>
      <FileQuality/>
    </el-icon>
    <span class="title">
            {{ props.title }}
        </span>
  </div>
</template>
<style scoped>

.title {
  margin-left: 10px;
  text-align: start;
  font-family: 'puhui', serif;
  width: 100%;
}

.nave-item {
  height: 35px;
  width: 100%;
  font-size: 14px;
  cursor: pointer;
  padding-left: 10px;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  border-radius: 5px;
  color: #333;
}

.nave-item:hover {
  background-color: #12814c;
  color: white;
  /* box-shadow: 1px 1px 1px #ebebeb; */
}

.selected {
  color: #12814c;
}

</style>