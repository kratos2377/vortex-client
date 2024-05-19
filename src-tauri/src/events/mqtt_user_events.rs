use serde::Serialize;
use tauri::{AppHandle, Manager, State};

use crate::state::MessierClient;

use super::mqtt_event_model::MQTTEventModel;


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
    let rx = mqtt_cli.start_consuming();

    for msg in rx.iter() {
           if let Some(msg) = msg {
            let mqtt_payload_string = String::from_utf8(msg.payload().to_vec()).unwrap();
            let mqtt_event: MQTTEventModel = serde_json::from_str(&mqtt_payload_string).unwrap();

            app.emit_all(&mqtt_event.event_name, Payload {message: mqtt_event.payload}).unwrap();
        }
    }

    Ok(())
}