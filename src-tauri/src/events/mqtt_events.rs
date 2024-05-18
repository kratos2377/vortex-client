use serde::Serialize;
use tauri::{AppHandle, Manager, State};

use crate::state::MessierClient;


#[derive(Clone, Serialize)]
struct Payload {
    message: String,
}


#[tauri::command]
pub fn subscribe_to_user_topic(payload: String , state: State<'_, MessierClient>) -> Result<String , ()> {
    let user_topic = serde_json::from_str(&payload).unwrap();
    let _ = &state.mqtt_user_client.subscribe(user_topic, 0);
    Ok("Subscribed to User Topic".to_string())
}

#[tauri::command]
pub fn unsubscribe_to_user_topic(payload: String , state: State<'_, MessierClient>) -> Result<String , ()> {
    let user_topic = serde_json::from_str(&payload).unwrap();
    let _ = &state.mqtt_user_client.unsubscribe(user_topic);
    Ok("Unsubscribed to User Topic".to_string())
}

#[tauri::command]
pub async fn listen_to_user_event(app: AppHandle , state: State<'_,MessierClient>) -> Result<() , ()> {

    let mqtt_cli = &state.mqtt_user_client;
    let mut rx = mqtt_cli.start_consuming();

    for msg in rx.iter() {
           if let Some(msg) = msg {
            app.emit_all("user-event", Payload {message: msg.to_string()}).unwrap();
        }
    }

    Ok(())
}