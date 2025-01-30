// 蓝图编译器，用于将simx design绘制的流编译为engine可执行的蓝图文件
import useFlowStore from "../store/flow";
import {invoke} from "@tauri-apps/api/core";
import useProjectStore from "../store/project";
import {error} from "../tools/message";


/**
 * 编译流程图数据并生成蓝图文件。
 * 
 * 该函数从流存储中获取流程图数据，并根据节点和边的信息生成蓝图配置。
 * 它会处理节点的自定义属性，构建节点的上下游关系，并将最终的蓝图数据序列化后存储到指定路径。
 * 
 * @returns 返回一个Promise，表示编译操作的异步完成。
 */
export async function compiler() {
// 流程图数据
  const flow_store = useFlowStore();
  // 蓝图数据

  const current_project = useProjectStore();
  // 当前蓝图
  let blueprint_file = {} as any;

  // 删除object中的design属性
  delete blueprint_file["design"];

  // 入口点数据列表
  let endpoints = [];

  // 蓝图数据
  let blueprint = {} as any;

  blueprint_file["name"] = "";
  blueprint_file["version"] = "1.0.0";
  blueprint_file["update_date"] = new Date().toISOString();

  // 这是蓝图配置
  blueprint["parallel_endpoints"] = false;
  blueprint["parallel_routes"] = false;
  blueprint["maximum_repetition"] = 30;

  let routes = {} as any;
  for (let node of flow_store.nodes) {
    
    let node_tags = [] as string[];

    // 笔记节点不参与编译
    if (node.type == "note") {
      continue;
    }

    // 下游节点数据列表
    let downstream = [];
    let handler = node.data.basic.handler || "";
    // 编制节点数据
    if (node.type == "start") {
      // 这个属性目前引擎没有用，但还是保留吧
      node_tags.push("Start");
      endpoints.push(node.id);
      // 如果为start，引擎会忽略此节点的handler执行，如果为event开始，代表要启动监听
      handler = "start";
    }

    // 编制下游节点（连线）
    for (let edge of flow_store.edges) {
      if (edge.source === node.id) {
        downstream.push(edge.target);
      }
    }

    // attr中仅存在组件属性和自定义属性，基础属性需要单独汇编
    let attr = node.data.component;
    console.log("node.data -----> ", node.data);
    // 编制节点属性
    for (let index in node.data.custom) {
      let custom_attr = node.data.custom[index] as string;
      console.log("custom_attr -----> ", custom_attr);
      try {
        attr[custom_attr.split(":")[0]] = custom_attr.split(":")[1];
      } catch (e) {
        error(("编译自定义属性失败：" + e) as string);
      }
    }
    
    routes[node.id] = {
      id: node.id,
      name: node.data.basic.label,
      handler: handler,
      downstream: downstream,
      redress_stream: [],
      tags: node_tags,
      // 汇编attr
      attr: attr,
    };
  }
  // 汇编routes
  blueprint["routes"] = routes;
  // 汇编endpoints
  blueprint["endpoints"] = endpoints;
  // 汇编蓝图
  blueprint_file["blueprint"] = blueprint;
  // 蓝图依赖
  blueprint_file["requirements"] = [];
  // 设计文件名称
  // target/lib目录是编译后蓝图的存储位置
  let o_file = current_project.project_path + "/target/lib/" + flow_store.id + ".bp";
  // 调用存储
  invoke("compile", {
    content: JSON.stringify(blueprint_file),
    target: o_file,
  });
}
