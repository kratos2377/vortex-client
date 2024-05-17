import { invoke } from "@tauri-apps/api/tauri"




export const login_call = async (payload: string) => {
    let val = await invoke('login_request', { payload: payload  }).then((message) => {
        let recv_msg = JSON.parse(message)
          if(!recv_msg.result.success) {
            return { "error_message": recv_msg.error_message, "status": false  }
          } else {
            return {"status": true, "token": recv_msg.token , "user": { id: recv_msg.user.id, first_name: recv_msg.user.first_name, last_name: recv_msg.user.last_name, username: recv_msg.user.username,
              score: recv_msg.user.score, verified: recv_msg.user.verified, email: recv_msg.user.email
              }}
          }


      });

    return val
}


export const registration_call = async (payload: string) => {
   let val = await invoke('registration_request', { payload: payload  }).then((message) => {

        let recv_msg = JSON.parse(message)
          if(!recv_msg.result.success) {
            return { "error_message": recv_msg.error_message, "status": false  }
          } else {
            return {"status": true, "token": recv_msg.token, "user": { id: recv_msg.user.id, first_name: recv_msg.user.first_name, last_name: recv_msg.user.last_name, username: recv_msg.user.username,
              score: recv_msg.user.score, verified: recv_msg.user.verified, email: recv_msg.user.email
              }}
          }

      })

      return val
}


export const send_email_call = async (paylod: string) => {
  let val = await invoke('send_email_request', {payload: paylod}).then((message) => {
    let recv_msg = JSON.parse(message)
    console.log("MSG RECEIVED WAS")
    console.log(recv_msg)
    if(!recv_msg.result.success) {
      return { "error_message": recv_msg.error_message, "status": false  }
    } else {
      return {"status": true}
    }
  });

  return val
}

export const verify_user_request_call = async (payload: string) => {
  let val = await invoke('verify_user_request', {payload: payload}).then((message) => {
    let recv_msg = JSON.parse(message)
    if(!recv_msg.result.success) {
      return { "error_message": recv_msg.error_message, "status": false  }
    } else {
      return {"status": true}
    }
  });

  return val
}