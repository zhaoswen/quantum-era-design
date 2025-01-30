use std::fs;
use std::path::Path;
use tauri::command;
use tauri::ipc::InvokeError;

#[command]
pub fn compile(content: String, target: String) -> Result<String, InvokeError> {
    // 确保目标目录存在
    if let Some(dir_path) = Path::new(&target).parent() {
        fs::create_dir_all(dir_path).unwrap();
    }

    // 将 content 写入文件
    fs::write(&target, content).unwrap();

    Ok("设计文件保存成功".to_string())
}
