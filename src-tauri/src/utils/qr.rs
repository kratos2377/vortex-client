
use qrcode_generator::QrCodeEcc;

#[tauri::command]
pub fn generate_qr_for_bet() -> Vec<u8> {
    let result: Vec<u8> = qrcode_generator::to_png_to_vec("Hello world!", QrCodeEcc::Low, 1024).unwrap();

    result

}