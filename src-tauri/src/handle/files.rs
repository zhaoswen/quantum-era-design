use std::fs;
use std::path::Path;
use tauri::command;
use tauri::ipc::InvokeError;

#[command]
pub fn write_file(content: String, path: String) -> Result<String, InvokeError> {
    // 确保目标目录存在
    if let Some(dir_path) = Path::new(&path).parent() {
        fs::create_dir_all(dir_path).unwrap();
    }

    // 将 content 写入文件
    fs::write(&path, content).unwrap();

    Ok("设计文件保存成功".to_string())
}

#[command]
pub fn read_file(path: &str) -> Result<String, String> {
    let result = fs::read_to_string(path);
    match result {
        Ok(s) => Ok(s),
        Err(e) => Err(e.to_string()),
    }
}

// 检查文件是否存在
#[command]
pub fn check_file_exists(path: &str) -> bool {
    Path::new(path).exists()
}
