
use qrcode_generator::QrCodeEcc;
use base64::{encode};
#[tauri::command]
pub fn generate_qr_for_bet(game_room_data: String) -> String {
    let result: Vec<u8> = qrcode_generator::to_png_to_vec(game_room_data, QrCodeEcc::Low, 1024).unwrap();
    let final_res = encode(&result);

    final_res

}