// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Arc;

use state::WebClient;


pub mod api;
pub mod models;
pub mod constants;
pub mod state;


#[tokio::main]
async fn main() {
    let client = WebClient {
        client:  Arc::new(reqwest::Client::new())
    };
    tauri::Builder::default()
     .plugin(tauri_plugin_store::Builder::default().build())
        .manage(client)
        .invoke_handler(tauri::generate_handler![
            // User auth logic
            api::user_auth::verify_token_request,
            api::user_auth::login_request,
            api::user_auth::registration_request,
            api::user_auth::send_email_request,
            api::user_auth::verify_user_request,

            // User non-auth logic
            api::user_logic::send_request,
            api::user_logic::get_user_friend_requests,
            api::user_logic::accept_or_reject_request,
            api::user_logic::add_wallet_address,
            api::user_logic::get_user_wallets,
            api::user_logic::delete_wallet_address,
            api::user_logic::get_all_users_friends,

            // Game api logic
            api::game::create_lobby,
            api::game::verify_game_status,
            api::game::send_game_invite_event,
            api::game::join_lobby,
            api::game::remove_user_lobby,
            api::game::destroy_lobby_and_game,
            api::game::get_ongoing_games_for_user,
            api::game::get_current_state_of_game,
            api::game::stake_in_game,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
