import { invoke } from "@tauri-apps/api/tauri"




export const login_call = async (payload: string) => {
    let val = await invoke('login_request', { payload: payload  }).then((message) => {
        console.log("MESSAGE IS")
        console.log(message)
        let recv_msg = JSON.parse(message)
          if(!recv_msg.result.success) {
            return { "error_message": recv_msg.error_message, "status": false  }
          } else {
            return {"status": true}
          }


      });

    
}


export const registration_call = async (payload: string) => {
   let val = await invoke('registration_request', { payload: payload  }).then((message) => {
    console.log("MESSAGE IS")
    console.log(message)
        let recv_msg = JSON.parse(message)
          if(!recv_msg.result.success) {
            return { "error_message": recv_msg.error_message, "status": false  }
          } else {
            return {"status": true}
          }

      })

      return val
}