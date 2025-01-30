import useFlowStore from "../store/flow";
import {invoke} from "@tauri-apps/api/core";
import useProjectStore from "../store/project";
import {error, success} from "../tools/message";
import {refreshProject} from "./project";
import {compiler} from "./compiler";
import {v4 as uuidv4} from "uuid";
import useRuntimeStore from "../store/runtime";

// 读取蓝图文件
/**
 * 异步读取蓝图文件并更新流程图数据。
 * 
 * 此函数首先从当前项目中获取活动蓝图的路径，然后尝试读取和解析该文件。
 * 如果成功，它会将解析得到的节点、边、名称和ID等信息更新到流程图存储中。
 * 如果在读取或解析过程中发生错误，函数会记录相应的错误信息。
 * 
 * @returns 返回值为void，但会更新flow_store中的流程图数据。
 * 
 * @example
 * // 调用read_blueprint函数来加载并更新蓝图数据
 * read_blueprint();
 */
export async function read_blueprint() {
  const flow_store = useFlowStore();
  const current_project = useProjectStore();
  let text;
  try {
    text = await invoke("resolve", { path: current_project.active_blueprint });
  } catch (e) {
    error("设计器无法读取目标文件，权限或路径错误", 1200);
    return;
  }
  let json;
  try {
    // 解析JSON
    json = JSON.parse(text as string);
  } catch (e) {
    error("设计器无法解析的文件结构，检查文件是否损坏", 1300);
    return;
  }

  try {
    // 更新流程图数据
    flow_store.nodes = json.design.nodes;
    // 更新节点连接
    flow_store.edges = json.design.edges;
    // 更新流程图名称
    flow_store.name = json.name;
    // 更新流程图ID
    if (json.id == undefined) {
      // 旧蓝图没有这个属性
      flow_store.id = uuidv4().toString();
    } else {
      flow_store.id = json.id;
    }
  } catch (e) {
    error("设计器解析蓝图源文件时出错，无法识别的文件结构", 1400);
    return;
  }
}

// 保存蓝图文件
/**
 * 保存当前流程图的蓝图数据到指定路径。
 * 如果未提供路径，则使用当前项目的活动蓝图路径。
 * 
 * @param path - 可选参数，指定保存蓝图数据的路径。如果为空字符串，则使用当前项目的活动蓝图路径。
 * @returns 返回一个Promise，该Promise在成功保存并刷新项目后解析。
 * 
 * 该函数首先获取流程图和项目的状态，生成或使用现有的蓝图ID，
 * 并构建包含ID、名称（如果存在，否则为“未命名”）、版本和更新日期的蓝图对象。
 * 蓝图的设计数据（节点和边）从流程图状态中获取。
 * 最后，该函数调用编译服务将蓝图数据保存到指定路径，并在成功后刷新项目。
 */
export async function save_blueprint(path: string = "") {
  // 流程图数据
  const flow_store = useFlowStore();
  const current_project = useProjectStore();
  if (path == "") {
    path = current_project.active_blueprint;
  }

  // 当前蓝图
  let blueprint = {} as any;

  if (flow_store.id == "" || flow_store.id == undefined) {
    flow_store.id = uuidv4().toString();
  }

  blueprint["id"] = flow_store.id;

  if (flow_store.name != "" && flow_store.name != undefined) {
    blueprint["name"] = flow_store.name;
  } else {
    blueprint["name"] = "未命名";
  }

  blueprint["version"] = "1.0.0";
  blueprint["update_date"] = new Date().toISOString();

  // 增加蓝图设计数据
  blueprint["design"] = {
    nodes: flow_store.nodes,
    edges: flow_store.edges,
  };


  return invoke("compile", {
    content: JSON.stringify(blueprint),
    target: path,
  }).then(async (_) => {
    // 创建后刷新项目
    return refreshProject();
  });
}

/**
 * 编译蓝图的异步函数。
 * 此函数会先保存蓝图，然后调用编译器进行编译。
 */
export async function compile_blueprint() {
  await save_blueprint();
  await compiler();
}

/**
 * 移除蓝图的异步函数。
 * 
 * @returns 返回一个 Promise 对象，表示移除蓝图操作的最终完成（或失败）及其结果值。
 */
export async function remove_blueprint() { }

// 重置（清空）蓝图文件
/**
 * 重置蓝图的异步函数。
 * 此函数调用 `useFlowStore` 钩子来获取流程存储实例，并调用其 `reset` 方法以重置蓝图状态。
 */
export async function reset_blueprint() {
  const flow_store = useFlowStore();
  flow_store.reset();
}

/**
 * 执行蓝图的异步函数。
 * 该函数首先获取运行时、当前项目和流程存储的实例。
 * 然后编译蓝图，并分析编译后的文件路径。
 * 接着调用本地引擎执行编译后的蓝图文件。
 * 如果执行过程中出现错误，则记录错误信息并返回。
 * 执行成功后，尝试打开控制台以显示输出结果，并将输出按行分割后添加到运行时的控制台输出数组中。
 * 最后，显示成功消息。
 */
export async function run_blueprint() {
  const runtime = useRuntimeStore();
  const current_project = useProjectStore();
  const flow_store = useFlowStore();
  // 编译蓝图
  await compile_blueprint();
  // 分析蓝图编译后文件
  let target_bp_path =
    current_project.project_path + "/target/lib/" + flow_store.id + ".bp";
  // 调用本地引擎执行
  try {
    invoke("exec", { path: target_bp_path }).then(res => {
      // 尝试打开控制台（用于显示输出）
      runtime.showToolBottom = true;
      runtime.currentToolBottom = "console";

      // 将res根据行分割
      let str = res as string;
      let lines = str.split("\n");
      lines.forEach((line) => {
        runtime.consoleOutput.push(line);
      });
    })
  } catch (e) {
    error(e as string, 1200);
    return;
  }

  success('当前蓝图已运行');
}
