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

// 压缩文件夹到zip
// TODO：有问题...
#[command]
pub fn zip_dir(source: String, target: String) -> Result<(), String> {
    println!("source: {}", source);
    println!("target: {}", target);
    // // 创建目标 ZIP 文件
    // let file = File::create(&target).map_err(|e| e.to_string())?;
    // let mut zip_writer = ZipWriter::new(file);
    //
    // // 设置 ZIP 文件的压缩选项
    // let options = FileOptions::default()
    //     .compression_method(CompressionMethod::Deflated);
    //
    // // 递归遍历源目录并添加到 ZIP 文件中
    // let source_path = Path::new(&source);
    // if !source_path.is_dir() {
    //     return Err(format!("Source path '{}' is not a directory", source));
    // }
    //
    // let walker = WalkDir::new(source_path);
    // for entry in walker {
    //     let entry = entry.map_err(|e| e.to_string())?;
    //     let path = entry.path();
    //     let name = path.strip_prefix(source_path).map_err(|e| e.to_string())?;
    //
    //     if path.is_file() {
    //         // 如果是文件，将其添加到 ZIP 文件中
    //         zip_writer
    //             .start_file(name.to_string_lossy(), options.clone())
    //             .map_err(|e| e.to_string())?;
    //         let mut file = File::open(path).map_err(|e| e.to_string())?;
    //         io::copy(&mut file, &mut zip_writer).map_err(|e| e.to_string())?;
    //     } else if path.is_dir() && name.to_string_lossy() != "" {
    //         // 如果是目录，在 ZIP 文件中添加一个目录条目
    //         zip_writer
    //             .add_directory(name.to_string_lossy(), options.clone())
    //             .map_err(|e| e.to_string())?;
    //     }
    // }
    //
    // // 完成 ZIP 文件的写入
    // zip_writer.finish().map_err(|e| e.to_string())?;

    Ok(())
}