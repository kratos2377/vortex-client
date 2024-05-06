use tauri::State;

use crate::{constants::api_constants::{BASE_URL, USER_AUTH_API_ROUTE}, state::WebClient};



#[tauri::command]
pub async fn verify_token_request(payload: String , state: State<'_ , WebClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + USER_AUTH_API_ROUTE + "/verify_token";

let res = state.client.get(req_url).body(payload).send().await;

if res.is_err() {
    return Ok("no response recieved".to_string())
}

let rec = res.unwrap().text().await;

if rec.is_err() {
    return Ok("no response recieved".to_string())
}

Ok(rec.unwrap())
}


#[tauri::command]
pub async fn login_request(payload: String , state: State<'_ , WebClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + USER_AUTH_API_ROUTE + "/login";

let res = state.client.post(req_url).body(payload).send().await.unwrap();

let rec = res.text().await.unwrap();

Ok(rec)
}


#[tauri::command]
pub async fn registration_request(payload: String , state: State<'_ , WebClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + USER_AUTH_API_ROUTE + "/registration";

let res = state.client.post(req_url).body(payload).send().await.unwrap();

let rec = res.text().await.unwrap();

Ok(rec)
}

#[tauri::command]
pub async fn send_email_request(payload: String , state: State<'_ , WebClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + USER_AUTH_API_ROUTE + "/send_email";

let res = state.client.post(req_url).body(payload).send().await.unwrap();

let rec = res.text().await.unwrap();

Ok(rec)
}

#[tauri::command]
pub async fn verify_user_request(payload: String , state: State<'_ , WebClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + USER_AUTH_API_ROUTE + "/verify_user";

let res = state.client.post(req_url).body(payload).send().await.unwrap();

let rec = res.text().await.unwrap();

Ok(rec)
}