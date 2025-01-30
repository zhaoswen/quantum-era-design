use tauri::command;
// 获取当前用户根目录
#[command]
pub fn get_user_root_dir() -> String {
    let home = std::env::var("HOME").unwrap();
    home
}
