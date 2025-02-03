import {useVueFlow} from "@vue-flow/core";
import {ref, watch} from "vue";
import {v4 as uuidv4} from "uuid";
import {SimxPluginHandler} from "../types/plugin";

// 生成唯一节点ID的函数
function getId() {
  return uuidv4().toString();
}

// 定义拖拽状态管理对象
const state = {
  draggedType: ref(null), // 当前正在拖拽的节点类型
  draggedDisplayName: "", // 当前正在拖拽的节点显示名称
  draggedHandler: "", // 当前正在拖拽的节点处理器
  draggedData: {} as SimxPluginHandler, // 当前正在拖拽的节点数据
  isDragOver: ref(false), // 是否拖拽到有效区域上空
  isDragging: ref(false), // 是否正在拖拽
};

// 导出的拖拽和放置功能钩子函数
/**
 * `useDragAndDrop` 是一个用于处理拖拽和放置操作的 Vue Composition API 函数。
 * 它提供了拖拽开始、进行、离开、结束以及放置节点的处理函数，并管理相关的状态。
 * 
 * 该函数通过解构 `state` 对象获取拖拽相关的状态，并使用 `useVueFlow` 获取 VueFlow 的核心功能。
 * 它监听 `isDragging` 状态的变化来控制页面文本的选择功能。
 * 
 * 拖拽操作涉及设置数据传输的数据类型和效果，存储拖拽元素的相关信息，并更新拖拽状态。
 * 放置操作则根据拖拽的数据在指定位置创建新节点，并在新节点初始化后调整其位置。
 * 
 * 返回一个对象，包含拖拽和放置相关的状态和处理函数，供组件使用。
 * 
 * @returns {Object} 包含拖拽和放置相关的状态和处理函数的对象。
 */
export default function useDragAndDrop() {
// 解构状态对象中的属性
  const { draggedType, isDragOver, isDragging } = state;

  // 使用VueFlow的核心功能
  const { addNodes, screenToFlowCoordinate, onNodesInitialized, updateNode } =
    useVueFlow();

  // 监听拖拽状态变化，以控制页面的文本选择功能
  watch(isDragging, (dragging) => {
    document.body.style.userSelect = dragging ? "none" : "";
  });

  // 拖拽开始时的处理函数
  /**
   * 处理拖动开始事件。
   * @param event - 拖动事件对象，包含数据传输相关属性和方法。
   * @param type - 被拖动元素的类型，当前传入为 null。
   * @param displayName - 被拖动元素的显示名称。
   * @param handler - 可选的处理器名称。
   * @param handlerData - 可选的处理器相关数据。
   * 
   * 在拖动开始时，设置数据传输的数据类型和允许的效果，
   * 并存储相关信息如类型、显示名称、处理器及处理器数据，
   * 同时将拖动状态设为 true，并添加拖放结束的事件监听。
   */
  function onDragStart(
    event: {
      dataTransfer: {
        setData: (arg0: string, arg1: any) => void;
        effectAllowed: string;
      };
    },
    type: null,
    displayName: string,
    handler?: string,
    handlerData?: SimxPluginHandler
  ) {
    if (event.dataTransfer) {
      event.dataTransfer.setData("application/vueflow", type);
      event.dataTransfer.effectAllowed = "move";
    }
    draggedType.value = type;
    state.draggedDisplayName = displayName; // 存储显示名称
    if (handler) {
      state.draggedHandler = handler; // 存储处理器
    }

    if (handlerData) {
      state.draggedData = handlerData;
    }

    isDragging.value = true;

    document.addEventListener("drop", onDragEnd);
  }

  // 拖拽进入有效区域时的处理函数
  /**
   * 处理拖动过程中的事件。
   * @param event - 拖动事件对象，包含阻止默认行为的方法和数据传输对象。
   * - `event.preventDefault()`：阻止默认的拖动行为。
   * - `event.dataTransfer.dropEffect`：设置拖放效果为“移动”。
   * 
   * 如果当前有被拖动的元素类型（`draggedType.value`），则将 `isDragOver.value` 设置为 `true`，
   * 并更新数据传输对象的 `dropEffect` 属性为 "move"，以指示拖放操作的效果。
   */
  function onDragOver(event: {
    preventDefault: () => void;
    dataTransfer: { dropEffect: string };
  }) {
    event.preventDefault();

    if (draggedType.value) {
      isDragOver.value = true;

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }
    }
  }

  // 拖拽离开有效区域时的处理函数
  /**
   * 处理拖拽离开事件的函数。
   * 当拖拽元素离开指定区域时，将 `isDragOver` 的值设为 `false` ，用于更新相关的界面状态或执行后续逻辑。
   */
  function onDragLeave() {
    isDragOver.value = false;
  }

  // 拖拽结束时的处理函数
  /**
   * 处理拖拽结束时的操作。
   * 重置相关状态变量，并移除文档上的 'drop' 事件监听器。
   */
  function onDragEnd() {
    isDragging.value = false;
    isDragOver.value = false;
    draggedType.value = null;
    state.draggedDisplayName = ""; // 清空显示名称
    state.draggedHandler = ""; // 清空处理器
    state.draggedData = {} as SimxPluginHandler;
    document.removeEventListener("drop", onDragEnd);
  }

  // 放置节点时的处理函数
  /**
   * 处理拖放事件的函数，在指定位置创建新节点。
   * @param event - 包含客户端 X 和 Y 坐标信息的事件对象。
   * 根据拖放的数据确定节点的相关属性，如显示名称、处理器路径和参数等，
   * 创建新节点并添加到节点列表中，同时在新节点初始化后调整其位置。
   */
  function onDrop(event: { clientX: any; clientY: any }) {
    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    });

    const nodeId = getId();

    // 确保draggedType.value不是null
    const nodeType = draggedType.value || "exec";

    let displayedName = "默认名称";
    let handler = "";
    // let params = [] as SimxPluginParam[];
    let params = {} as any;
    // 分析是否存在处理器属性
    const data = state.draggedData;
    if (data.name) {
      displayedName = data.name;
      handler = data.handler;
      // 处理处理器参数
      if (data.params) {
        // params = data.params
        for (let index in data.params) {
          params[data.params[index].key] = data.params[index].default_value;
        }
      }
    }else{
      displayedName = state.draggedDisplayName;
      handler = state.draggedHandler;
    }

    const newNode = {
      id: nodeId,
      type: nodeType, // 使用非null的类型
      position,
      // 组件配置
      data: {
        // 基础配置
        basic: {
          // 节点ID
          id: nodeId,
          // 节点显示名称
          label: displayedName,
          // 节点处理器路径
          handler: handler,
          // 被禁用的节点不参与编译，不参与调试
          disabled: false,
          // 下游节点群
          downstream: [],
          // 节点补偿流
          redress_stream: [],
        },
        // 组件配置
        component: params,
        // 自定义配置
        custom: [],
        // 这个后续优化吧，太离谱了，现在懒得改编译器...
        // 处理器参数详细信息，component是最终数据
        params: data.params,
      },
    };

    const { off } = onNodesInitialized(() => {
      updateNode(nodeId, (node) => ({
        position: {
          x: node.position.x - node.dimensions.width / 2,
          y: node.position.y - node.dimensions.height / 2,
        },
      }));

      off();
    });

    addNodes(newNode);
  }

  // 返回拖拽和放置相关的状态和处理函数
  return {
    draggedType,
    isDragOver,
    isDragging,
    onDragStart,
    onDragLeave,
    onDragOver,
    onDrop,
  };
}
