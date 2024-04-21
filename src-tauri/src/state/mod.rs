use std::sync::Arc;

pub struct WebClient {
  pub  client: Arc<reqwest::Client>,
}
