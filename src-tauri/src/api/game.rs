use reqwest::Error;
use tauri::State;

use crate::{constants::api_constants::{BASE_URL,  GAME_API_ROUTE}, state::WebClient};


#[tauri::command]
pub async fn create_lobby(payload: String , token: String, state: State<'_ , WebClient>) -> Result<String , Error> {
let req_url = BASE_URL.to_string() + GAME_API_ROUTE + "/create_lobby";
let res = state.client.post(req_url).body(payload).header("Authorization" , token).send().await.unwrap();
res.text().await
}


#[tauri::command]
pub async fn verify_game_status(payload: String , token: String, state: State<'_ , WebClient>) -> Result<String , Error> {
let req_url = BASE_URL.to_string() + GAME_API_ROUTE + "/verify_game_status";
let res = state.client.post(req_url).body(payload).header("Authorization" , token).send().await.unwrap();
res.text().await
}


#[tauri::command]
pub async fn send_game_invite_event(payload: String ,token: String, state: State<'_ , WebClient>) -> Result<String , Error> {
let req_url = BASE_URL.to_string() + GAME_API_ROUTE + "/send_game_invite_event";

let res = state.client.post(req_url).body(payload).header("Authorization" , token).send().await.unwrap();

res.text().await
}

#[tauri::command]
pub async fn join_lobby(payload: String , token: String, state: State<'_ , WebClient>) -> Result<String , Error> {
let req_url = BASE_URL.to_string() + GAME_API_ROUTE + "/join_lobby";

let res = state.client.post(req_url).body(payload).header("Authorization" , token).send().await.unwrap();

res.text().await
}

#[tauri::command]
pub async fn remove_user_lobby(payload: String , token: String, state: State<'_ , WebClient>) -> Result<String , Error> {
let req_url = BASE_URL.to_string() + GAME_API_ROUTE + "/remove_user_lobby";

let res = state.client.post(req_url).body(payload).header("Authorization" , token).send().await.unwrap();

res.text().await
}

#[tauri::command]
pub async fn destroy_lobby_and_game(payload: String , token: String, state: State<'_ , WebClient>) -> Result<String , Error> {
let req_url = BASE_URL.to_string() + GAME_API_ROUTE + "/destroy_lobby_and_game";

let res = state.client.post(req_url).body(payload).header("Authorization" , token).send().await.unwrap();

res.text().await
}

#[tauri::command]
pub async fn get_ongoing_games_for_user(payload: String , token: String, state: State<'_ , WebClient>) -> Result<String , Error> {
let req_url = BASE_URL.to_string() + GAME_API_ROUTE + "/get_ongoing_games_for_user";

let res = state.client.post(req_url).body(payload).header("Authorization" , token).send().await.unwrap();

res.text().await
}

#[tauri::command]
pub async fn get_current_state_of_game(payload: String , token: String, state: State<'_ , WebClient>) -> Result<String , Error> {
let req_url = BASE_URL.to_string() + GAME_API_ROUTE + "/get_current_state_of_game";

let res = state.client.post(req_url).body(payload).header("Authorization" , token).send().await.unwrap();

res.text().await
}

#[tauri::command]
pub async fn stake_in_game(payload: String , token: String, state: State<'_ , WebClient>) -> Result<String , Error> {
let req_url = BASE_URL.to_string() + GAME_API_ROUTE + "/stake_in_game";

let res = state.client.post(req_url).body(payload).header("Authorization" , token).send().await.unwrap();

res.text().await
}