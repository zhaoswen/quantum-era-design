import {defineStore} from 'pinia';
import {ref} from 'vue';
import {SimxPluginHandlers} from '../entity/plugin';

const useProjectStore = defineStore('project-pinia', () => {

  // 当前工作空间路径
  const workspace_path = ref<string>('');

  // 当前项目的名称
  const project_name = ref<string>('默认项目');

  // 当前项目的路径
  const project_path = ref<string>('');

  // 当前项目的依赖列表
  const project_dependencies = ref<Dependency[]>([]);

  const projects = ref<Project[]>([]);

  const current_project = ref<Project>({
    name: '',
    path: '',
    description: '',
    dependencies: [] as Dependency[],
  });

  // 当前项目处理器依赖配置
  const current_plugins_handler = ref<SimxPluginHandlers[]>([]);

  // 这个实际上就是当前文件的路径，是一个字符串，代表当前活跃的蓝图
  const active_blueprint = ref<string>('');

  return {
    current_plugins_handler,
    project_name,
    project_path,
    active_blueprint,
    projects,
    workspace_path,
    current_project,
    project_dependencies
  };
});

export default useProjectStore;
