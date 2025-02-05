use std::path::PathBuf;
use std::{env, path::Path, process::Command};
use tauri::command;

#[command]
pub async fn exec(path: String) -> Result<String, String> {
    match env::current_dir() {
        Ok(dir) => {
            let mut exe_path = dir.join("data").join("engine");
            // 判断当前是否为windows
            if cfg!(target_os = "windows") {
                exe_path = exe_path.join("engine.exe");
            } else {
                exe_path = exe_path.join("engine");
            }
            let mut cmd = Command::new(exe_path.to_str().expect("cannot trans exe_path"));
            cmd.arg("run");
            cmd.arg(path);
            let response = cmd.output();
            if response.is_err() {
                return Err("执行操作时发生严重错误：".to_string()
                    + response.err().expect("cannot trans response").to_string().as_str());
            }
            let output = response.expect("cannot fix response data");
            let stdout = String::from_utf8(output.stdout).expect("cannot trans stdout");
            let stderr = String::from_utf8(output.stderr).expect("cannot trans stderr");
            if !stderr.is_empty() {
                return Err(stderr.as_str().to_string());
            }
            Ok(stdout)
        }
        Err(e) => {
            log::error!("Failed to get current directory: {}", e);
            Err("Failed to get current directory".to_string())
        }
    }
}

// 一般只有linux/macos下可以运行成功
#[command]
pub fn set_executable(path: &Path) -> Result<(), String> {
    // 判断当前是否为windows
    if cfg!(target_os = "windows") {
        return Ok(());
    }

    let mut cmd = Command::new("/bin/chmod");
    cmd.arg("775");
    cmd.arg(path);
    let response = cmd.output();
    if response.is_err() {
        return Err(
            "执行操作时发生严重错误：".to_string() + response.err().unwrap().to_string().as_str()
        );
    }
    let output = response.unwrap();
    let stderr = String::from_utf8(output.stderr).unwrap();
    if !stderr.is_empty() {
        return Err(stderr.as_str().to_string());
    }
    Ok(())
}
