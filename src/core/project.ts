import {invoke} from "@tauri-apps/api/core";
import {ElMessage, ElMessageBox} from "element-plus";
import {open} from '@tauri-apps/plugin-dialog';
import {error, success} from "../tools/message";
import useProjectStore from "../store/project";
import useRuntimeStore from "../store/runtime";
import {loadProjectDependencies} from "./plugin";

// 刷新项目
/**
 * 刷新项目信息
 * 
 * 此函数用于从服务器获取当前项目的详细信息，并更新到项目存储中。
 * 如果项目路径为空，则不会执行任何操作。
 * 
 * @async
 * @function refreshProject
 * @returns {Promise<void>} 返回一个空Promise，操作完成时解决。
 */
export async function refreshProject() {

    const project = useProjectStore();
    let path = project.project_path;
    // 如果项目路径为空，则不加载项目面板
    if (path == '') {
        return;
    }
    // 尝试加载当前项目下所有项目数据
    let res: any = await invoke("get_project_info", { path: path });
    project.current_project.blueprints = res.blueprint;
    project.current_project.configs = res.config;
    project.current_project.dependencies = res.dependencie;
}

// 创建工作空间
/**
 * 打开工作空间
 * 
 * 此函数用于打开一个工作空间目录。它会弹出一个选择目录的对话框，允许用户选择一个目录作为工作空间。
 * 选择成功后，会将工作空间的路径保存到项目存储（store）中，并缓存到浏览器的 localStorage 中。
 * 最后，它会刷新项目列表以反映新的工作空间。
 * 
 * @returns {Promise<void>} 返回一个 Promise 对象，该对象在操作完成时解析。
 */
export function openWorkspace() {
    const project = useProjectStore();

    open({
        multiple: false,
        directory: true,
        canCreateDirectories: true,
        title: '选择要打开的工作空间',
    }).then(res => {
        if (res === null) {
            return;
        }
        // 将工作空间的路径放到 store
        project.workspace_path = res;
        // 缓存到localstorage
        localStorage.setItem("workspace_path", project.workspace_path);
        // 刷新项目列表
        reflushProjectList();
    });
}

/**
 * 创建一个新的项目。
 * 
 * 此函数会弹出一个文件选择对话框，让用户选择一个目录来创建新项目。
 * 选择目录后，将调用插件接口创建一个新项目，并将项目信息添加到项目存储中。
 * 
 * @returns {Promise<void>} 无返回值，但会在项目创建成功后显示成功消息。
 */
export function createProject() {
    const project = useProjectStore();

    open({
        multiple: false,
        directory: true,
        canCreateDirectories: true,
        title: '选择要创建项目的目录',
    }).then(res => {
        if (res === null) {
            return;
        }
        invoke("create_project", {
            // 要插件的路径，必须是一个文件夹的路径
            projectPath: res,
            // 项目类型，目前仅支持se：
            // 1. se：Engine Project，流引擎标准项目
            // 2. mx：Mixture Project，混合开发项目
            // 3. lx：Lesi programme language project，Lesi 编程语言项目
            projectType: "se",
            // 模板
            // 指定项目的创建模板
            projectTemplate: "default",
        }).then(() => {
            // 将项目信息写入到 store
            project.projects.push({
                name: "案例项目",
                path: res,
                description: "这是一个测试项目",
                dependencies: []
            })
            success('创建项目成功')
        })

    });
}

/**
 * 刷新项目列表
 * 
 * 此函数用于重新获取并更新项目列表。它调用接口扫描工作空间目录，
 * 解析返回的项目信息，并将其存储到项目存储中。
 * 
 * @returns 返回一个 Promise 对象，表示异步操作的最终完成（或失败）及其结果值。
 */
export function reflushProjectList() {
    const project = useProjectStore();
    // 调用接口，尝试扫描工作空间目录
    invoke("get_project_list", {
        // 要插件的路径，必须是一个文件夹的路径
        workspacePath: project.workspace_path,
    }).then((res: any) => {
        project.projects = [];
        for (let index in res.projects) {

            try {
                let json = JSON.parse(res.projects[index].content);
                let name = json.name;
                let path = res.projects[index].path;
                let description = json.description;
                project.projects.push({
                    name: name,
                    path: path,
                    description: description,
                    dependencies: json.dependencies,
                })
            } catch (e) {
                error('项目信息解析失败: ' + e)
            }
        }
    });
}

/**
 * 打开一个项目并加载其相关信息。
 * 
 * @param row - 包含项目信息的对象，必须包含 path、name 和 description 属性。
 * 
 * 该函数执行以下操作：
 * 1. 设置项目的路径和名称。
 * 2. 更新当前项目的信息，包括名称、路径、描述和初始化依赖数组。
 * 3. 刷新项目信息。
 * 4. 加载项目的依赖配置。
 * 5. 跳转到设计器页面。
 */
export async function openProject(row: any) {
    const runtime = useRuntimeStore();
    const project = useProjectStore();
    project.project_path = row.path;
    project.project_name = row.name;
    project.current_project = {
        name: row.name,
        path: row.path,
        description: row.description,
        dependencies: row.dependencies,
    }

    project.project_dependencies = row.dependencies as Dependency[];
    // if (!project.project_dependencies || project.project_dependencies.length == 0){
    //     project.project_dependencies = [];
    //     project.project_dependencies.push({
    //         name: "simx",
    //         path: "simx"
    //     })
    // }
    await refreshProject();
    await loadProjectDependencies(project.project_dependencies)
    // 跳转到设计器
    runtime.pageIndex = "1";
}

/**
 * 保存当前项目的函数。
 * 此函数负责将当前项目的状态持久化到存储系统中。
 */
export function saveProject() {
}

/**
 * 关闭当前项目。
 * 此函数用于关闭当前正在操作的项目，涉及资源释放、状态重置等操作。
 */
export function closeProject() {
}

/**
 * 删除指定的项目。
 * 
 * @param row - 包含项目名称和路径的对象。
 * 此函数会弹出确认对话框，如果用户确认，则调用 `invoke` 函数执行删除操作，
 * 并在删除成功后刷新项目列表并显示成功消息。
 * 如果用户取消或删除过程中发生错误，则不执行任何操作。
 */
export function deleteProject(row: any) {
    ElMessageBox.confirm(
        '正在尝试删除项目【' + row.name + '】，这将会从文件系统中直接删除此项目，删除后无法直接找回，请确认此操作？',
        '危险操作确认',
        {
            confirmButtonText: '了解风险且确认删除',
            cancelButtonText: '取消操作',
            type: 'warning',
        }
    )
        .then(async () => {
            let res: any = await invoke("dir_remove", { path: row.path });
            console.log(res);
            // 刷新项目列表
            reflushProjectList();
            ElMessage({
                type: 'success',
                message: '成功删除项目',
            })
        })
        .catch(() => { })
}

/**
 * 编译项目的函数。
 * 
 * 负责处理项目的编译过程。
 */
export function compileProject() {
}

// 加载缓存
/**
 * 加载缓存的工作区路径，并更新项目存储中的工作区路径，随后刷新项目列表。
 * 如果本地存储中存在工作区路径，则将其设置到项目存储中，并触发项目列表的刷新。
 */
export function loadCache() {
    let workspace_path = localStorage.getItem("workspace_path")
    if (workspace_path != "" && workspace_path != undefined) {
        const project = useProjectStore();
        project.workspace_path = workspace_path;
        // 刷新项目列表
        reflushProjectList();
    }
}