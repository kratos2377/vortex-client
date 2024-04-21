use reqwest::Error;
use tauri::State;

use crate::{constants::api_constants::{BASE_URL, USER_AUTH_API_ROUTE}, state::WebClient};



#[tauri::command]
pub async fn verify_token_request(payload: String , state: State<'_ , WebClient>) -> Result<String , Error> {
let req_url = BASE_URL.to_string() + USER_AUTH_API_ROUTE + "/verify_token";

let res = state.client.get(req_url).body(payload).send().await.unwrap();

res.text().await
}


#[tauri::command]
pub async fn login_request(payload: String , state: State<'_ , WebClient>) -> Result<String , Error> {
let req_url = BASE_URL.to_string() + USER_AUTH_API_ROUTE + "/login";

let res = state.client.post(req_url).body(payload).send().await.unwrap();

res.text().await
}


#[tauri::command]
pub async fn registration_request(payload: String , state: State<'_ , WebClient>) -> Result<String , Error> {
let req_url = BASE_URL.to_string() + USER_AUTH_API_ROUTE + "/registration";

let res = state.client.post(req_url).body(payload).send().await.unwrap();

res.text().await
}

#[tauri::command]
pub async fn send_email_request(payload: String , state: State<'_ , WebClient>) -> Result<String , Error> {
let req_url = BASE_URL.to_string() + USER_AUTH_API_ROUTE + "/send_email";

let res = state.client.post(req_url).body(payload).send().await.unwrap();

res.text().await
}

#[tauri::command]
pub async fn verify_user_request(payload: String , state: State<'_ , WebClient>) -> Result<String , Error> {
let req_url = BASE_URL.to_string() + USER_AUTH_API_ROUTE + "/verify_user";

let res = state.client.post(req_url).body(payload).send().await.unwrap();

res.text().await
}