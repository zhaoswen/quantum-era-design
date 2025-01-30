import {defineStore} from 'pinia';
import {ref} from 'vue';
import {SimxPlugin} from '../entity/plugin';

const useRuntimeStore = defineStore('runtime-pinia', () => {

  // 当前页面
  const pageIndex = ref<string>('0');

  // 引擎核心目录（指.simx目录），默认存在于用户目录下的.simx文件夹
  // TODO：后续改为可配置
  const engineCorePath = ref<string>('');

  // 系统插件信息
  const plugins = ref<SimxPlugin[]>([]);

  // 是否显示当前左侧工具
  const showToolLeft = ref<boolean>(false);
  // 是否显示当前右侧工具
  const showToolRight = ref<boolean>(false);
  // 是否显示当前底部工具
  const showToolBottom = ref<boolean>(false);

  // 当前左侧工具（project、vcs、struct、nodes）
  const currentToolLeft = ref<string>('0');
  // 当前右侧工具（attribute、ai、todo）
  const currentToolRight = ref<string>('0');
  // 当前底部工具（shell、log、debug）
  const currentToolBottom = ref<string>('0');

  
  const progress = ref<any>({
    // 当前进度
    current: 0,
    // 总进度
    total: 0,
    // 进度条颜色
    color: 'primary',
    // 进度条文本
    text: '稍等...',
  });


  const attr = ref<Attr>({
    basic: {
      // 节点ID
      id: "",
      // 节点显示名称
      label: "",
      // 节点处理器路径
      handler: '',
      // 被禁用的节点不参与编译，不参与调试
      disabled: false,
      // 下游节点群
      downstream: [],
      // 节点补偿流
      redress_stream: [],
    },
    component: {},
    custom: [],
    params: [],
  });

  // 控制台输出列表，在此处增加内容，会同步显示在控制台窗口中
  const consoleOutput = ref<any []>([]);

  // 当前蓝图
  const currentBlueprint = ref<any>({
    // 蓝图ID
    id: "",
    // 蓝图名称
    name: "",
    // 蓝图版本
    version: "",
    // 蓝图更新时间
    update_date: "",
    // 蓝图描述
    description: "",
    // 蓝图路径
    path: "",
  });


  return {
    plugins,
    engineCorePath,
    showToolLeft,
    showToolRight,
    showToolBottom,
    currentToolLeft,
    currentToolRight,
    currentToolBottom,
    pageIndex,
    attr,
    currentBlueprint,
    consoleOutput,
    progress
  };
});

export default useRuntimeStore;

interface Attr {
  basic: {
    // 节点ID
    id: string,
    // 节点显示名称
    label: string,
    // 节点处理器路径
    handler: string,
    // 被禁用的节点不参与编译，不参与调试
    disabled: boolean,
    // 下游节点群
    downstream: [],
    // 节点补偿流
    redress_stream: [],
  },
  component: any,
  custom: any[];
  params: any[];
}