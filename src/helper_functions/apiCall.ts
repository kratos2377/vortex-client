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

export const get_ongoing_games_for_user  = async (payload: string , token: string) => {
  let val = await invoke('get_ongoing_games_for_user', {payload: payload, token: getBearerToken(token)}).then((message) => {
    let recv_msg = JSON.parse(message)

    logMessage("get_ongoing_games_for_user", recv_msg)

    if(!recv_msg.result.success) {
      return { "error_message": recv_msg.error_message, "status": false  }
    } else {
      return {"status": true , "games": recv_msg.games}
    }
  });

  return val
}


export const get_user_online_friends  = async (payload: string , token: string) => {
  let val = await invoke('get_user_online_friends', {payload: payload, token: getBearerToken(token)}).then((message) => {
    let recv_msg = JSON.parse(message)

    logMessage("get_user_online_friends", recv_msg)

    if(!recv_msg.result.success) {
      return { "error_message": recv_msg.error_message, "status": false  }
    } else {
      return {"status": true , "friends": recv_msg.friends}
    }
  });

  return val
}


export const change_user_password  = async (payload: string , token: string) => {
  let val = await invoke('change_user_password', {payload: payload, token: getBearerToken(token)}).then((message) => {
    let recv_msg = JSON.parse(message)

    logMessage("change_user_password", recv_msg)

    if(!recv_msg.result.success) {
      return { "error_message": recv_msg.error_message, "status": false  }
    } else {
      return {"status": true}
    }
  });

  return val
}


export const change_user_username  = async (payload: string , token: string) => {
  let val = await invoke('change_user_username', {payload: payload, token: getBearerToken(token)}).then((message) => {
    let recv_msg = JSON.parse(message)

    logMessage("change_user_username", recv_msg)

    if(!recv_msg.result.success) {
      return { "error_message": recv_msg.error_message, "status": false  }
    } else {
      return {"status": true}
    }
  });

  return val
}

export const send_friend_request  = async (payload: string , token: string) => {
  let val = await invoke('send_request', {payload: payload, token: getBearerToken(token)}).then((message) => {
    let recv_msg = JSON.parse(message)

    logMessage("send_friend_request", recv_msg)

    if(!recv_msg.result.success) {
      return { "error_message": recv_msg.error_message, "status": false  }
    } else {
      return {"status": true}
    }
  });

  return val
}


export const create_lobby_call  = async (payload: string , token: string) => {
  let val = await invoke('create_lobby', {payload: payload, token: getBearerToken(token)}).then((message) => {
    let recv_msg = JSON.parse(message)

    logMessage("create_lobby", recv_msg)

    if(!recv_msg.result.success) {
      return { "error_message": recv_msg.error_message, "status": false  }
    } else {
      return {"status": true, "game_id": recv_msg.game_id}
    }
  });

  return val
}

export const get_user_friend_requests = async (payload: string , token: string) => {
  let val = await invoke('get_user_friend_requests', {payload: payload, token: getBearerToken(token)}).then((message) => {
    let recv_msg = JSON.parse(message)

    logMessage("get_user_friend_requests", recv_msg)

    if(!recv_msg.result.success) {
      return { "error_message": recv_msg.error_message, "status": false  }
    } else {
      return {"status": true, "friends": recv_msg.friends}
    }
  });

  return val
}



//Game API calls
export const send_game_invite = async (payload: string , token: string) => {
  let val = await invoke('send_game_invite', {payload: payload, token: getBearerToken(token)}).then((message) => {
    let recv_msg = JSON.parse(message)

    logMessage("send_game_invite", recv_msg)

    if(!recv_msg.result.success) {
      return { "error_message": recv_msg.error_message, "status": false  }
    } else {
      return {"status": true}
    }
  });

  return val
}


//Helper fns
const getBearerToken = ( token: string) => {
  return "Bearer " + token;
}


const logMessage = async (fn_name: string , msg: any) => {
  console.log("RECEVIED message from " + fn_name )
  console.log(msg)
}