// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Arc;

use state::{MessierClient};


pub mod api;
pub mod models;
pub mod constants;
pub mod state;
pub mod utils;
pub mod events;

#[tokio::main]
async fn main() {
    let client = MessierClient {client:Arc::new(reqwest::Client::new())};
   let builder =  tauri::Builder::default()
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
            api::user_logic::get_user_online_friends,
            api::user_logic::change_user_password,
            api::user_logic::change_user_username,
            api::user_logic::get_ongoing_games_for_user,

            // Game api logic
            api::game::create_lobby,
            api::game::verify_game_status,
            api::game::send_game_invite_event,
            api::game::join_lobby,
            api::game::leave_lobby,
            api::game::remove_user_lobby,
            api::game::start_game,
            api::game::destroy_lobby_and_game,
            api::game::get_current_state_of_game,
            api::game::stake_in_game,
            api::game::remove_game_models,
            api::game::update_player_status,
            api::game::get_lobby_players,
            api::game::get_user_turn_mappings,
            api::game::get_game_details,
            api::game::create_match_making_ticket,
            api::game::delete_match_making_ticket,
            api::game::replay_game,

            //MQTT User events
            // events::mqtt_events::subscribe_to_user_topic,
            // events::mqtt_events::unsubscribe_to_user_topic,
            // events::mqtt_events::listen_to_user_event,

            // //MQTT Game events
            // events::mqtt_events::subscribe_to_game_topic,
            // events::mqtt_events::unsubscribe_to_game_topic,
            // events::mqtt_events::listen_to_game_event,

            //Util fns
            utils::qr::generate_qr_for_bet

        ]);

        let app = builder.build(tauri::generate_context!()) .expect("error while running tauri application");
        app.run(|app_handle, event| match event {
            tauri::RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit();
                tauri::AppHandle::exit(app_handle, 0);
            }
            _ => {}
        });
       
}
