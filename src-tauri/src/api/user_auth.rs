use tauri::State;

use crate::{constants::api_constants::{BASE_URL, USER_AUTH_API_ROUTE}, state::MessierClient};



#[tauri::command]
pub async fn verify_token_request(payload: String , state: State<'_ , MessierClient>) -> Result<String , ()> {


let req_url = BASE_URL.to_string() + USER_AUTH_API_ROUTE + "/verify_token";

let res = state.client.post(req_url).body(payload).header("Content-Type", "application/json").send().await;

if res.is_err() {
    println!("{:?}", res.unwrap());
    return Ok("no response recieved 1".to_string())
}

let rec = res.unwrap().text().await;

if rec.is_err() {
    return Ok("no response recieved 2".to_string())
}

Ok(rec.unwrap())
}


#[tauri::command]
pub async fn login_request(payload: String , state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + USER_AUTH_API_ROUTE + "/login";

let res = state.client.post(req_url).body(payload).header("Content-Type", "application/json").send().await.unwrap();

let rec = res.text().await.unwrap();

Ok(rec)
}


#[tauri::command]
pub async fn registration_request(payload: String , state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + USER_AUTH_API_ROUTE + "/registration";

let res = state.client.post(req_url).body(payload).header("Content-Type", "application/json").send().await.unwrap();

let rec = res.text().await.unwrap();

Ok(rec)
}

#[tauri::command]
pub async fn send_email_request(payload: String , state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + USER_AUTH_API_ROUTE + "/send_email";

let res = state.client.post(req_url).body(payload).header("Content-Type", "application/json").send().await.unwrap();

let rec = res.text().await.unwrap();

Ok(rec)
}

#[tauri::command]
pub async fn verify_user_request(payload: String , state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + USER_AUTH_API_ROUTE + "/verify_user";

let res = state.client.post(req_url).body(payload).header("Content-Type", "application/json").send().await.unwrap();

let rec = res.text().await.unwrap();

Ok(rec)
}