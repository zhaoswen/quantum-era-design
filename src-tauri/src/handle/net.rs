use reqwest::blocking::{Client, RequestBuilder};
use serde_json::Value;
use std::collections::HashMap;
use tauri::command;

#[command]
pub fn request(
    path: &str,
    method: &str,
    headers: HashMap<String, String>,
    body: Option<Value>,
) -> Value {
    if path.is_empty() {
        return Value::String("Path is empty".to_string());
    }

    let client = Client::new();
    let mut request: RequestBuilder = match method.to_lowercase().as_str() {
        "get" => client.get(path),
        "post" => client.post(path),
        "delete" => client.delete(path),
        "put" => client.put(path),
        _ => return Value::String("Cannot find request method".to_string()),
    };

    for (key, value) in headers {
        request = request.header(key, value);
    }

    if let Some(b) = body {
        request = request.json(&b);
    }

    match request.send() {
        Ok(response) => response.json().unwrap_or_else(|e| Value::String(format!("Failed to parse response: {:?}", e).to_string())),
        Err(e) => Value::String(format!("failed: {:?}", e).to_string()),
    }
}
