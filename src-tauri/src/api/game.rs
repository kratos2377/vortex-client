use tauri::State;

use crate::{constants::api_constants::{BASE_URL,  GAME_API_ROUTE}, state::MessierClient};


#[tauri::command]
pub async fn create_lobby(payload: String , token: String, state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + GAME_API_ROUTE + "/create_lobby";
let res = state.client.post(req_url).body(payload).header("Authorization" , token).header("Content-Type", "application/json").send().await.unwrap();
let rec = res.text().await.unwrap();

Ok(rec)
}


#[tauri::command]
pub async fn verify_game_status(payload: String , token: String, state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + GAME_API_ROUTE + "/verify_game_status";
let res = state.client.post(req_url).body(payload).header("Authorization" , token).header("Content-Type", "application/json").send().await.unwrap();
let rec = res.text().await.unwrap();

Ok(rec)
}

#[tauri::command]
pub async fn remove_game_models(payload: String , token: String, state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + GAME_API_ROUTE + "/remove_game_models";
let res = state.client.post(req_url).body(payload).header("Authorization" , token).header("Content-Type", "application/json").send().await.unwrap();
let rec = res.text().await.unwrap();

Ok(rec)
}

#[tauri::command]
pub async fn send_game_invite_event(payload: String ,token: String, state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + GAME_API_ROUTE + "/send_game_invite_event";

let res = state.client.post(req_url).body(payload).header("Authorization" , token).header("Content-Type", "application/json").send().await.unwrap();

let rec = res.text().await.unwrap();

Ok(rec)
}

#[tauri::command]
pub async fn join_lobby(payload: String , token: String, state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + GAME_API_ROUTE + "/join_lobby";

let res = state.client.post(req_url).body(payload).header("Authorization" , token).header("Content-Type", "application/json").send().await.unwrap();

let rec = res.text().await.unwrap();

Ok(rec)
}

#[tauri::command]
pub async fn leave_lobby(payload: String , token: String, state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + GAME_API_ROUTE + "/leave_lobby";

let res = state.client.post(req_url).body(payload).header("Authorization" , token).header("Content-Type", "application/json").send().await.unwrap();

let rec = res.text().await.unwrap();

Ok(rec)
}


#[tauri::command]
pub async fn remove_user_lobby(payload: String , token: String, state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + GAME_API_ROUTE + "/remove_user_lobby";

let res = state.client.post(req_url).body(payload).header("Authorization" , token).header("Content-Type", "application/json").send().await.unwrap();

let rec = res.text().await.unwrap();

Ok(rec)
}

#[tauri::command]
pub async fn destroy_lobby_and_game(payload: String , token: String, state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + GAME_API_ROUTE + "/destroy_lobby_and_game";

let res = state.client.post(req_url).body(payload).header("Authorization" , token).header("Content-Type", "application/json").send().await.unwrap();

let rec = res.text().await.unwrap();

Ok(rec)
}


#[tauri::command]
pub async fn start_game(payload: String , token: String, state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + GAME_API_ROUTE + "/start_game";

let res = state.client.post(req_url).body(payload).header("Authorization" , token).header("Content-Type", "application/json").send().await.unwrap();

let rec = res.text().await.unwrap();

Ok(rec)
}

#[tauri::command]
pub async fn get_ongoing_games_for_user(payload: String , token: String, state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + GAME_API_ROUTE + "/get_ongoing_games_for_user";

let res = state.client.get(req_url).body(payload).header("Authorization" , token).header("Content-Type", "application/json").send().await.unwrap();

let rec = res.text().await.unwrap();

Ok(rec)
}

#[tauri::command]
pub async fn get_current_state_of_game(payload: String , token: String, state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + GAME_API_ROUTE + "/get_current_state_of_game";

let res = state.client.get(req_url).body(payload).header("Authorization" , token).header("Content-Type", "application/json").send().await.unwrap();

let rec = res.text().await.unwrap();

Ok(rec)
}

#[tauri::command]
pub async fn stake_in_game(payload: String , token: String, state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + GAME_API_ROUTE + "/stake_in_game";

let res = state.client.post(req_url).body(payload).header("Authorization" , token).header("Content-Type", "application/json").send().await.unwrap();

let rec = res.text().await.unwrap();

Ok(rec)
}

#[tauri::command]
pub async fn update_player_status(payload: String , token: String, state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + GAME_API_ROUTE + "/update_player_status";

let res = state.client.post(req_url).body(payload).header("Authorization" , token).header("Content-Type", "application/json").send().await.unwrap();

let rec = res.text().await.unwrap();

Ok(rec)
}

#[tauri::command]
pub async fn get_lobby_players(payload: String , token: String, state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + GAME_API_ROUTE + "/get_lobby_players";

let res = state.client.post(req_url).body(payload).header("Authorization" , token).header("Content-Type", "application/json").send().await.unwrap();

let rec = res.text().await.unwrap();

Ok(rec)
}


#[tauri::command]
pub async fn get_user_turn_mappings(payload: String , token: String, state: State<'_ , MessierClient>) -> Result<String , ()> {
let req_url = BASE_URL.to_string() + GAME_API_ROUTE + "/get_user_turn_mappings";

let res = state.client.post(req_url).body(payload).header("Authorization" , token).header("Content-Type", "application/json").send().await.unwrap();

let rec = res.text().await.unwrap();

Ok(rec)
}