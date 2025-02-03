import {defineStore} from 'pinia';
import {ref} from 'vue';
import type {Edge, Node} from '@vue-flow/core';

const useFlowStore = defineStore('vue-flow-pinia', () => {

  const id = ref('');

  const name = ref('默认蓝图');

  const nodes = ref<Node[]>([]);

  const edges = ref<Edge[]>([]);

  const isSave = ref(true);

  const isNew = ref(false);

  const reset = () => {
    edges.value = [];
    nodes.value = [];
  };

  const toggleClass = () => {
    nodes.value = nodes.value.map((node) => {
      return {
        ...node,
        class: node.class === 'dark' ? 'light' : 'dark',
      };
    });
  };

  const updatePositions = () => {
    nodes.value = nodes.value.map((node) => {
      return {
        ...node,
        position: {
          x: Math.random() * 400,
          y: Math.random() * 400,
        },
      };
    });
  };

  return {
    id,
    nodes,
    edges,
    name,
    isSave,
    isNew,
    reset,
    toggleClass,
    updatePositions,
  };
});

export default useFlowStore;
