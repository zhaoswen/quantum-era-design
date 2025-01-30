use std::fs;
use tauri::command;

#[command]
pub fn resolve(path: &str) -> Result<String, String> {
    let result = fs::read_to_string(path);
    match result {
        Ok(s) => Ok(s),
        Err(e) => Err(e.to_string()),
    }
}
