#[cfg(windows)]
use libloader::libloading::Library;
#[cfg(windows)]
use libloader::libloading::Symbol;
#[cfg(unix)]
use libloading::Library;
#[cfg(unix)]
use libloading::Symbol;
use std::path::PathBuf;
use std::{path::Path, process::Command};
use tauri::command;

#[command]
pub async fn exec(path: String) -> Result<String, String> {
    // 获取当前用户目录
    let user_dir = std::env::var("HOME").expect("获取用户目录失败");

    let user_dir_path = Path::new(&user_dir).join(".simx");
    let exe_path: PathBuf;
    // 判断当前是否为windows
    if cfg!(target_os = "windows") {
        exe_path = user_dir_path.join("engine").join("engine.exe");
    } else {
        exe_path = user_dir_path.join("engine").join("engine");
    }
    println!("exe_path: {:?}", exe_path.to_str().unwrap());
    let mut cmd = Command::new(exe_path.to_str().unwrap());
    cmd.arg("run");
    cmd.arg(path);
    let response = cmd.output();
    if response.is_err() {
        return Err(
            "执行操作时发生严重错误：".to_string() + response.err().unwrap().to_string().as_str()
        );
    }
    let output = response.unwrap();
    let stdout = String::from_utf8(output.stdout).unwrap();
    let stderr = String::from_utf8(output.stderr).unwrap();
    if !stderr.is_empty() {
        return Err(stderr.as_str().to_string());
    }
    Ok(stdout)
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

pub fn load_engine_serve() {
    // 获取根目录
    let user_dir = std::env::var("HOME").expect("获取用户目录失败");
    // 检查是否存在.simx文件夹
    let user_dir_path = Path::new(&user_dir).join(".simx");
    if !user_dir_path.exists() {
        std::fs::create_dir(user_dir_path.clone()).expect("创建用户目录失败");
    }
    // 检查是否存在engine文件夹
    let engine_dir = user_dir_path.join("engine");
    if !engine_dir.exists() {
        std::fs::create_dir(engine_dir.clone()).expect("创建引擎目录失败");
    }
    // 检查是否存在engine.dll文件或engine.dylib文件或engine.so文件
    let engine_path: PathBuf;
    if cfg!(target_os = "windows") {
        // 是否为windows
        engine_path = engine_dir.join("engine.dll");
    } else if cfg!(target_os = "macos") {
        // 是否为macos
        engine_path = engine_dir.join("engine.dylib");
    } else {
        // 是否为linux
        engine_path = engine_dir.join("engine.so");
    }
    // 判断文件是否存在
    if !engine_path.exists() {
        // 从中央仓库下载
    } else {
        let lib = unsafe { Library::new(engine_path) }.expect("Could not load lib");
        unsafe {
            let serve: Symbol<unsafe extern "C" fn()> = lib
                .get("serve".as_bytes())
                .expect("Could not find serve function");
            // 调用函数
            serve();
        }
    }
}
