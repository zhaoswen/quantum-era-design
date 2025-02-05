use tauri::command;
use log::log;
use std::env;

// 获取当前用户根目录
#[command]
pub fn get_user_root_dir() -> Result<String, String> {
    match env::var("HOME") {
        Ok(home) => {
            log::debug!("home: {}", home);
            Ok(home)
        },
        Err(e) => {
            log::error!("Failed to get HOME environment variable: {}", e);
            Err("Failed to get HOME environment variable".to_string())
        }
    }
}
