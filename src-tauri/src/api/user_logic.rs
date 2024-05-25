use tauri::State;

use crate::{constants::api_constants::{BASE_URL, USER_LOGIC_API_ROUTE}, state::MessierClient};





#[tauri::command]
pub async fn send_request(payload: String , token: String, state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + USER_LOGIC_API_ROUTE + "/send_request";
let res = state.client.post(req_url).body(payload).header("Authorization" , token).header("Content-Type", "application/json").send().await.unwrap();
let rec = res.text().await.unwrap();

Ok(rec)
}


#[tauri::command]
pub async fn get_user_friend_requests(payload: String , token: String, state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + USER_LOGIC_API_ROUTE + "/get_user_friend_requests";
let res = state.client.get(req_url).body(payload).header("Authorization" , token).header("Content-Type", "application/json").send().await.unwrap();
let rec = res.text().await.unwrap();

Ok(rec)
}


#[tauri::command]
pub async fn accept_or_reject_request(payload: String ,token: String, state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + USER_LOGIC_API_ROUTE + "/accept_or_reject_request";

let res = state.client.put(req_url).body(payload).header("Authorization" , token).header("Content-Type", "application/json").send().await.unwrap();

let rec = res.text().await.unwrap();

Ok(rec)
}

// #[tauri::command]
// pub async fn add_wallet_address(payload: String , token: String, state: State<'_ , MessierClient>) -> Result<String , ()> {
// let req_url = BASE_URL.to_string() + USER_LOGIC_API_ROUTE + "/add_wallet_address";

// let res = state.client.post(req_url).body(payload).header("Authorization" , token).header("Content-Type", "application/json").send().await.unwrap();

// let rec = res.text().await.unwrap();

// Ok(rec)
// }

// #[tauri::command]
// pub async fn get_user_wallets(payload: String , token: String, state: State<'_ , MessierClient>) -> Result<String , ()> {
// let req_url = BASE_URL.to_string() + USER_LOGIC_API_ROUTE + "/get_user_wallets";

// let res = state.client.post(req_url).body(payload).header("Authorization" , token).header("Content-Type", "application/json").send().await.unwrap();

// let rec = res.text().await.unwrap();

// Ok(rec)
// }

// #[tauri::command]
// pub async fn delete_wallet_address(payload: String , token: String, state: State<'_ , MessierClient>) -> Result<String , ()> {
// let req_url = BASE_URL.to_string() + USER_LOGIC_API_ROUTE + "/delete_wallet_address";

// let res = state.client.post(req_url).body(payload).header("Authorization" , token).send().await.unwrap();

// let rec = res.text().await.unwrap();

// Ok(rec)
// }

#[tauri::command]
pub async fn get_user_online_friends(payload: String , token: String, state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + USER_LOGIC_API_ROUTE + "/get_user_online_friends";

let res = state.client.get(req_url).body(payload).header("Authorization" , token).header("Content-Type", "application/json").send().await.unwrap();

let rec = res.text().await.unwrap();

Ok(rec)
}

#[tauri::command]
pub async fn change_user_password(payload: String , token: String, state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + USER_LOGIC_API_ROUTE + "/change_user_password";

let res = state.client.get(req_url).body(payload).header("Authorization" , token).header("Content-Type", "application/json").send().await.unwrap();

let rec = res.text().await.unwrap();

Ok(rec)
}

#[tauri::command]
pub async fn change_user_username(payload: String , token: String, state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + USER_LOGIC_API_ROUTE + "/change_user_username";

let res = state.client.get(req_url).body(payload).header("Authorization" , token).header("Content-Type", "application/json").send().await.unwrap();

let rec = res.text().await.unwrap();

Ok(rec)
}