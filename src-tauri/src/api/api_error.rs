
#[derive(Debug)]
pub struct APIError{
	pub result: SuccessResponse,
	pub error_message: String,
}


#[derive(Debug)]
pub struct SuccessResponse {
	pub success: bool
}


impl Default for APIError {
    fn default() -> Self {
        APIError{
            result: SuccessResponse {
                success: false
            },
            error_message: "Error while connecting to server please try later".to_string(),
        }
    }
}


impl APIError {
    pub fn custom_message(message: String) -> Self {
        APIError{
            result: SuccessResponse {
                success: false
            },
            error_message: message,
        }
    }
}