use std::{sync::Arc, time::Duration};


pub struct MessierClient {
  pub  client: Arc<reqwest::Client>,

}


// pub fn create_mqtt_client( topic: String) -> mqtt::Client {
//   let new_id = nano_id::base64::<15>();
//   let create_opts = mqtt::CreateOptionsBuilder::new()
//   .server_uri("tcp://127.0.0.1:1883")
//   .client_id("event_subscriptions_".to_string() +  &topic.to_string() + "_" + &new_id)
//   .delete_oldest_messages(true)
//   .finalize();

//   let mut cli = mqtt::Client::new(create_opts).unwrap();


//   let lwt = mqtt::MessageBuilder::new()
//   .topic("connection_test")
//   .payload("Consumer lost connection")
//   .finalize();
// let conn_opts = mqtt::ConnectOptionsBuilder::new()
//   .keep_alive_interval(Duration::from_secs(20))
//   .clean_session(false)
//   .will_message(lwt)
//   .finalize();

// // Connect and wait for it to complete or fail.
// if let Err(e) = cli.connect(conn_opts) {
//   println!("Unable to connect:\n\t{:?}", e);

// }

// // subscribe_topics(&cli , topic.clone(), &config);

// cli
// }