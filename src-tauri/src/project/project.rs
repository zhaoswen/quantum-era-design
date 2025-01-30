use serde_json::{json, Value};
use std::fs;
use std::path::PathBuf;
use std::string::ToString;
use tauri::command;
use tauri::ipc::InvokeError;

// 获取工作空间中项目列表
#[command]
pub fn get_project_list(workspace_path: String) -> Result<Value, InvokeError> {
    let projects = fs::read_dir(&workspace_path).unwrap();
    let mut projects_list = vec![];
    for project in projects {
        let project: fs::DirEntry = project.unwrap();
        let project_path = project.path();
        let project_name = project_path.file_name().unwrap().to_str().unwrap();
        // 尝试加载项目
        if project_path.is_dir() {
            let project_file = project_path.clone().join("project.pro");
            // 判断文件是否存在
            if fs::metadata(&project_file).is_ok() {
                // 读取文件内容
                let project_content = fs::read_to_string(&project_file).unwrap();
                projects_list.push(json!({
                    "name": project_name,
                    "path": project_path.to_str().unwrap(),
                    "content": project_content
                }));
            }
        }
    }
    Ok(json!({ "projects": projects_list }))
}

#[command]
pub fn get_project_info(path: String) -> Result<Value, InvokeError> {
    let mut blueprint: Vec<Value> = vec![];
    let mut config: Vec<Value> = vec![];
    let mut extension: Vec<Value> = vec![];

    let path = PathBuf::from(path);

    let blueprint_path = path.join("blueprint");
    let config_path = path.join("config");
    let library_path = path.join("extension");
    if blueprint_path.exists() {
        for entry in fs::read_dir(blueprint_path).unwrap() {
            let entry: fs::DirEntry = entry.unwrap();
            let entry_path = entry.path();
            let file_name = entry_path.file_name().unwrap().to_str().unwrap();
            if entry_path.is_file() && file_name.ends_with(".bps") {
                blueprint.push(json!({
                    "name": file_name,
                    "path": entry_path.to_str().unwrap(),
                }));
            }
        }
    }
    if config_path.exists() {
        for entry in fs::read_dir(config_path).unwrap() {
            let entry: fs::DirEntry = entry.unwrap();
            let entry_path = entry.path();
            if entry_path.is_file() {
                let file_name = entry_path.file_name().unwrap().to_str().unwrap();
                config.push(json!({
                    "name": file_name,
                }));
            }
        }
    }
    if library_path.exists() {
        for entry in fs::read_dir(library_path).unwrap() {
            let entry: fs::DirEntry = entry.unwrap();
            let entry_path = entry.path();
            if entry_path.is_file() {
                let file_name = entry_path.file_name().unwrap().to_str().unwrap();
                extension.push(json!({
                    "name": file_name,
                }));
            }
        }
    }
    Ok(json!({
        "blueprint": json!(blueprint),
        "config": json!(config),
        "extension": json!(extension)
    }))
}

// 创建项目
#[command]
pub fn create_project(
    project_path: String,
    project_type: String,
    project_template: String,
) -> Result<String, InvokeError> {
    // 暂时不管类型和模板（因为现在不支持。。。）

    if fs::create_dir_all(&project_path).is_err() {
        return Err(InvokeError::from("创建基础目录失败"));
    }

    let project_file_path = project_path.clone() + "/project.pro";
    let project_bp_path = project_path.clone() + "/blueprint";
    let project_extension_path = project_path.clone() + "/extension";
    let project_config_path = project_path + "/config";

    // 创建蓝图文件夹
    if fs::create_dir_all(&project_bp_path).is_err() {
        return Err(InvokeError::from("创建蓝图目录失败"));
    }

    // 创建依赖文件夹
    if fs::create_dir_all(&project_extension_path).is_err() {
        return Err(InvokeError::from("创建扩展目录失败"));
    }

    if fs::create_dir_all(&project_config_path).is_err() {
        return Err(InvokeError::from("创建配置目录失败"));
    }

    let content = "{
    \"name\": \"案例项目\",
    \"version\": \"1.0\",
    \"author\": \"zhaosw\",
    \"description\": \"这是一个测试项目\",
    \"services\": [],
    \"proxy\": []
}";

    fs::write(&project_file_path, content).unwrap();
    Ok("设计文件保存成功".to_string())
}
