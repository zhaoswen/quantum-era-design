use crate::compiler::compile::compile;
use crate::executor::exec::exec;
use crate::executor::exec::set_executable;
use crate::handle::dir::{dir_create, zip_dir};
use crate::handle::dir::dir_exists;
use crate::handle::dir::dir_list;
use crate::handle::dir::dir_remove;
use crate::handle::files::copy_file;
use crate::handle::files::read_file;
use crate::handle::files::write_file;
use crate::handle::files::{check_file_exists, delete_file};
use crate::handle::net::request;
use crate::handle::system::{get_current_dir, get_user_root_dir};
use crate::project::project::create_project;
use crate::project::project::get_project_info;
use crate::project::project::get_project_list;
use crate::resolver::resolve::resolve;

// 引入
mod compiler;
mod executor;
mod handle;
mod project;
mod resolver;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_upload::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            request,
            // 获取用户根目录
            get_user_root_dir,
            // 获取当前目录
            get_current_dir,
            // 判断文件是否存在
            check_file_exists,
            // 判断文件夹是否存在
            dir_exists,
            // 获取文件夹内容
            dir_list,
            // 创建文件夹
            dir_create,
            // 删除文件夹
            dir_remove,
            // 压缩文件夹
            zip_dir,
            // 写文件
            write_file,
            // 读文件
            read_file,
            // 复制文件
            copy_file,
            // 删除文件
            delete_file,
            // 编译
            compile,
            // 解析
            resolve,
            // 创建项目
            create_project,
            // 获取项目列表
            get_project_list,
            // 获取项目信息
            get_project_info,
            // 执行
            exec,
            // 文件授权（仅linux、macos）
            set_executable,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
