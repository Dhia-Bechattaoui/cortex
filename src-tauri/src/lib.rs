use std::fs;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct Conversation {
    pub id: String,
    pub transcript: String,
}

#[tauri::command]
fn get_gemini_conversations() -> Result<Vec<Conversation>, String> {
    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;
    let brain_dir = home_dir.join(".gemini/antigravity-ide/brain");
    
    let mut conversations = Vec::new();
    
    if let Ok(entries) = fs::read_dir(&brain_dir) {
        for entry in entries.flatten() {
            if entry.path().is_dir() {
                let id = entry.file_name().to_string_lossy().to_string();
                let log_path = entry.path().join(".system_generated/logs/transcript.jsonl");
                
                if log_path.exists() {
                    if let Ok(transcript) = fs::read_to_string(&log_path) {
                        conversations.push(Conversation {
                            id,
                            transcript,
                        });
                    }
                }
            }
        }
    }
    
    Ok(conversations)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_gemini_conversations])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
