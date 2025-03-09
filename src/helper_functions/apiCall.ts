import { invoke } from "@tauri-apps/api/tauri"




export const login_call = async (payload: string) => {
    let val = await invoke('login_request', { payload: payload  }).then((message) => {
        let recv_msg = JSON.parse(message as string)
        
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

        let recv_msg = JSON.parse(message as string)
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
    let recv_msg = JSON.parse(message as string)
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
    let recv_msg = JSON.parse(message as string)
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
    let recv_msg = JSON.parse(message as string)

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
    let recv_msg = JSON.parse(message as string)

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
    let recv_msg = JSON.parse(message as string)

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
    let recv_msg = JSON.parse(message as string)

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
    let recv_msg = JSON.parse(message as string)

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
    let recv_msg = JSON.parse(message as string)

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
    let recv_msg = JSON.parse(message as string)

    logMessage("get_user_friend_requests", recv_msg)

    if(!recv_msg.result.success) {
      return { "error_message": recv_msg.error_message, "status": false  }
    } else {
      return {"status": true, "friends": recv_msg.friends}
    }
  });

  return val
}


export const accept_or_reject_request_call = async (payload: string , token: string) => {
  let val = await invoke('accept_or_reject_request', {payload: payload, token: getBearerToken(token)}).then((message) => {
    let recv_msg = JSON.parse(message as string)

    logMessage("accept_or_reject_request_call", recv_msg)

    if(!recv_msg.result.success) {
      return { "error_message": recv_msg.error_message, "status": false  }
    } else {
      return {"status": true}
    }
  });

  return val
}


//Game API calls
export const send_game_invite = async (payload: string , token: string) => {
  let val = await invoke('send_game_invite_event', {payload: payload, token: getBearerToken(token)}).then((message) => {
    let recv_msg = JSON.parse(message as string)

    logMessage("send_game_invite", recv_msg)

    if(!recv_msg.result.success) {
      return { "error_message": recv_msg.error_message, "status": false  }
    } else {
      return {"status": true}
    }
  });

  return val
}

export const join_lobby_call = async (payload: string , token: string) => {
  let val = await invoke('join_lobby', {payload: payload, token: getBearerToken(token)}).then((message) => {
    let recv_msg = JSON.parse(message as string)

    logMessage("join_lobby_call", recv_msg)

    if(!recv_msg.result.success) {
      return { "error_message": recv_msg.error_message, "status": false  }
    } else {
      return {"status": true, "game_host_id": recv_msg.game_host_id, "user_count_id": recv_msg.user_cnt_id}
    }
  });

  return val
}

export const leave_lobby_call = async (payload: string , token: string) => {
  let val = await invoke('leave_lobby', {payload: payload, token: getBearerToken(token)}).then((message) => {
    let recv_msg = JSON.parse(message as string)

    logMessage("leave_lobby_call", recv_msg)

    if(!recv_msg.result.success) {
      return { "error_message": recv_msg.error_message, "status": false  }
    } else {
      return {"status": true}
    }
  });

  return val
}

export const verify_game_status_call = async (payload: string, token: string) => {
  let val = await invoke('verify_game_status', {payload: payload, token: getBearerToken(token)}).then((message) => {
    let recv_msg = JSON.parse(message as string)

    logMessage("verify_game_status", recv_msg)

    if(!recv_msg.result.success) {
      return { "error_message": recv_msg.error_message, "status": false  }
    } else {
      return {"status": true}
    }
  });

  return val
}


export const remove_game_models_call = async (payload: string, token: string) => {
  let val = await invoke('remove_game_models', {payload: payload, token: getBearerToken(token)}).then((message) => {
    let recv_msg = JSON.parse(message as string)

    logMessage("remove_game_models", recv_msg)

    if(!recv_msg.result.success) {
      return { "error_message": recv_msg.error_message, "status": false  }
    } else {
      return {"status": true}
    }
  });

  return val
}

export const update_player_status = async (payload: string, token: string) => {
  let val = await invoke('update_player_status', {payload: payload, token: getBearerToken(token)}).then((message) => {
    let recv_msg = JSON.parse(message as string)

    logMessage("update_player_status", recv_msg)

    if(!recv_msg.result.success) {
      return { "error_message": recv_msg.error_message, "status": false  }
    } else {
      return {"status": true}
    }
  });

  return val
}

export const get_lobby_players = async (payload: string, token: string) => {
  let val = await invoke('get_lobby_players', {payload: payload, token: getBearerToken(token)}).then((message) => {
    let recv_msg = JSON.parse(message as string)

    logMessage("get_lobby_players", recv_msg)

    if(!recv_msg.result.success) {
      return { error_message: recv_msg.error_message, status: false  }
    } else {
      return { status: true, lobby_users: recv_msg.lobby_users}
    }
  });

  return val
}

export const destroy_lobby_and_game = async (payload: string, token: string) => {
  let val = await invoke('destroy_lobby_and_game', {payload: payload, token: getBearerToken(token)}).then((message) => {
    let recv_msg = JSON.parse(message  as string)

    logMessage("destroy_lobby_and_game", recv_msg)

    if(!recv_msg.result.success) {
      return { error_message: recv_msg.error_message, status: false  }
    } else {
      return { status: true}
    }
  });

  return val
}

export const start_game = async (payload: string, token: string) => {
  let val = await invoke('start_game', {payload: payload, token: getBearerToken(token)}).then((message) => {
    let recv_msg = JSON.parse(message  as string)

    logMessage("start_game", recv_msg)

    if(!recv_msg.result.success) {
      return { error_message: recv_msg.error_message, status: false  }
    } else {
      return {status: true}
    }
  });

  return val
}

export const get_user_turn_mappings = async (payload: string, token: string) => {
  let val = await invoke('get_user_turn_mappings', {payload: payload, token: getBearerToken(token)}).then((message) => {
    let recv_msg = JSON.parse(message as string)

    logMessage("get_user_turn_mappings", recv_msg)

    if(!recv_msg.result.success) {
      return { error_message: recv_msg.error_message, status: false  }
    } else {
      return {status: true, user_turns: recv_msg.user_turns}
    }
  });

  return val
}

export const get_game_details = async (payload: string, token: string) => {
  let val = await invoke('get_game_details', {payload: payload, token: getBearerToken(token)}).then((message) => {
    let recv_msg = JSON.parse(message as string)

    logMessage("get_game_details", recv_msg)

    if(!recv_msg.result.success) {
      return { error_message: recv_msg.error_message, status: false  }
    } else {
      return {status: true, game: recv_msg.game, chess_state: recv_msg.chess_state}
    }
  });

  return val
}


export const create_match_making_ticket = async (payload: string, token: string) => {
  let val = await invoke('create_match_making_ticket', {payload: payload, token: getBearerToken(token)}).then((message) => {
    let recv_msg = JSON.parse(message as string)

    logMessage("create_match_making_ticket", recv_msg)

    if(!recv_msg.result.success) {
      return { error_message: recv_msg.error_message, status: false  }
    } else {
      return {status: true}
    }
  });

  return val
}


export const delete_match_making_ticket = async (payload: string, token: string) => {
  let val = await invoke('delete_match_making_ticket', {payload: payload, token: getBearerToken(token)}).then((message) => {
    let recv_msg = JSON.parse(message as string)

    logMessage("delete_match_making_ticket", recv_msg)

    if(!recv_msg.result.success) {
      return { error_message: recv_msg.error_message, status: false  }
    } else {
      return {status: true}
    }
  });

  return val
}

export const replay_game = async (payload: string, token: string) => {
  let val = await invoke('replay_game', {payload: payload, token: getBearerToken(token)}).then((message) => {
    let recv_msg = JSON.parse(message as string)

    logMessage("replay_game", recv_msg)

    if(!recv_msg.result.success) {
      return { error_message: recv_msg.error_message, status: false  }
    } else {
      return {status: true}
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