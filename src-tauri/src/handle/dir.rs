use serde_json::{json, Value};
use std::{fs, vec};
use tauri::command;

#[command]
// 获取文件夹内容
pub fn dir_list(path: String) -> Result<Value, String> {
    let dir = fs::read_dir(&path).map_err(|e| e.to_string())?;
    let mut dirs = vec![];
    let mut files = vec![];

    for entry in dir {
        let entry_ins: fs::DirEntry = entry.map_err(|e| e.to_string())?;
        let entry_path = entry_ins.path();
        let entry_name = entry_path.file_name().unwrap().to_str().unwrap();
        let metadata = entry_path.metadata().map_err(|e| e.to_string())?;

        let entry_info = json!({
            "name": entry_name,
            "path": entry_path.to_str().unwrap(),
            "is_symlink": entry_path.is_symlink(),
            "is_hidden": entry_name.starts_with("."),
            "is_readable": metadata.permissions().readonly(),
        });

        if entry_path.is_dir() {
            dirs.push(entry_info);
        } else {
            files.push(entry_info);
        }
    }

    Ok(json!({ "dirs": dirs, "files": files }))
}

// 创建文件夹
#[command]
pub fn dir_create(path: String) -> Result<bool, String> {
    fs::create_dir_all(&path).map_err(|e| e.to_string())?;
    Ok(true)
}

// 删除文件夹
#[command]
pub fn dir_remove(path: String) -> Result<bool, String> {
    fs::remove_dir_all(&path).map_err(|e| e.to_string())?;
    Ok(true)
}

// 检查文件夹是否存在
#[command]
pub fn dir_exists(path: String) -> Result<bool, String> {
    Ok(fs::metadata(&path).is_ok())
}
