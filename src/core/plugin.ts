import {invoke} from "@tauri-apps/api/core";
import useRuntimeStore from "../store/runtime";
import {SimxPluginHandlers} from "../types/plugin";
import useProjectStore from "../store/project";
import {getProfileByReceptionist} from "../api/http";

/**
 * 异步加载项目依赖项。
 * @param dependencies - 依赖项数组，每个依赖项应包含名称等信息。
 * 该函数会在运行时存储中获取引擎核心路径，然后遍历依赖项，
 * 拼接插件处理器配置目录路径，判断该路径是否存在。
 * 如果存在则尝试加载处理器配置，否则记录错误信息。
 */
export const loadProjectDependencies = async (dependencies: Dependency[]) => {
  const runtime = useRuntimeStore();
  const project = useProjectStore();
  let simx_root_dir = runtime.engineCorePath;
  for (let index in dependencies) {
    let dependency_path = dependencies[index];
    // 拼接插件处理器配置目录
    let handler_path =
      simx_root_dir + "/extension/" + dependency_path.name + "/handler";
    // 判断handler_path是否存在
    let isHandlerPathExist: boolean = await invoke("dir_exists", {
      path: handler_path,
    });
    if (!isHandlerPathExist) {
      // 配置不存在，尝试下载
      await RequireExtensionProfile(dependency_path.name);
    }
    project.current_plugins_handler = [];
    await loadPlugin(handler_path);
  }
};

/**
 * 异步加载指定路径下的插件。
 * 它会遍历该路径下的所有文件和子文件夹，读取所有以“.json”结尾的文件，
 * 将其内容解析为`SimxPluginHandlers`类型，并添加到项目的当前插件处理器数组中。
 * @param path - 要加载插件的文件夹路径。
 */
export const loadPlugin = async (path: string) => {
  console.log("-----")
  let project = useProjectStore();  // 遍历文件夹，读取所有json文件
  let response: any = await invoke("dir_list", { path: path });
  for (let i = 0; i < response.files.length; i++) {
    let file = response.files[i];
    // 判断文件是否是json文件
    if (file.name.endsWith(".json")) {
      // 读取文件内容
      let file_response: any = await invoke("read_file", { path: file.path });
      // 解析为Json
      let json: SimxPluginHandlers = JSON.parse(file_response);
      project.current_plugins_handler.push(json);
    }
  }
  for (let i = 0; i < response.dirs.length; i++) {
    let dirs = response.dirs[i];
    await loadPlugin(dirs.path)
  }
};

/**
 * 异步加载扩展配置
 * @param extension_path - 扩展的路径
 * 此函数会获取扩展的相关配置信息，创建插件描述文件、基础文件夹，并根据处理器和服务的信息分别创建对应的配置文件。
 * 对于处理器，会在 handler 目录下按照特定格式生成每个处理器的配置文件。
 * 对于服务，目前处于待实现状态（TODO）。
 */
export const RequireExtensionProfile = async (extension_path: string) => {
  const runtime = useRuntimeStore();
  // 插件配置目录
  let simx_extension_path =
    runtime.engineCorePath + "/extension/" + extension_path;

  // 发起请求，向中央仓库请求插件配置
  let response = await getProfileByReceptionist(extension_path);
  // 解析响应中的处理器信息
  let handlers = response.data.handlers;
  // 解析响应中的服务信息
  let services = response.data.services;

  // 1. 创建插件描述文件
  invoke("write_file", {
    path: simx_extension_path + "/index.json",
    content: JSON.stringify(response.data.info),
  });

  // 2. 创建基础文件夹
  invoke("dir_create", { path: simx_extension_path + "/handler" });
  invoke("dir_create", { path: simx_extension_path + "/service" });

  // 循环创建插件中所有处理器的配置文件
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      let group = handlers[i];
      // 创建处理器配置文件
      // 尝试组合
      let file = {
        id: group.id,
        name: group.name,
        func: group.func.map((handler: any) => {
          console.log("file.handler: ", handler);
          return {
            handler: handler.handler,
            name: handler.name,
            desc: handler.description,
            params: handler.params.map((param: any) => {
              let options = JSON.parse(param.paramOptions);
              return {
                key: param.paramKey,
                name: param.paramName,
                desc: param.paramDescription,
                type: param.paramType,
                default_value: fixDefaultVarType(param.paramDefaultValue, param.paramType),
                require: param.paramRequire,
                options: options,
              };
            }),
          };
        }),
      };
      invoke("write_file", {
        path:
          simx_extension_path +
          "/handler/" +
          group.id.split(".").pop() +
          "/" +
          group.id.split(".").pop() +
          ".json",
        content: JSON.stringify(file),
      });
    }
  }

  // TODO：循环创建插件中所有服务的配置文件
  if (services) {
    for (let i = 0; i < services.length; i++) {
      // let service = services[i];
      // 创建处理器配置文件
      // invoke("write_file", { path: extension_path + "/" + handler.id + "/handler.json", content: JSON.stringify(handler) })
    }
  }
};

function fixDefaultVarType(str: string, types: string): any {
  switch (types) {
    case "String":
      return str;
    case "Number":
      return Number(str);
    case "Boolean":
      return str == "true";
    case "Array":
      return JSON.parse(str);
    case "Object":
      return JSON.parse(str);
    default:
      // 对于Select等类型，直接使用字符串即可
      return str;
  }
}