use serde::{Deserialize, Serialize};



#[derive(Clone , Serialize , Deserialize)]
pub struct MQTTEventModel {
    pub event_name: String,
    pub payload: String,
}