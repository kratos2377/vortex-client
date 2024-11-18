import React , { useContext, useEffect, useState } from "react";
import Loading from "./screens/Loading";
import { invoke } from '@tauri-apps/api/tauri'
import { deleteUserDetailsFromStore, getUserTokenFromStore } from "./persistent_storage/save_user_details"
import { useNavigate } from "react-router-dom";
import { useUserStore } from "./state/UserAndGameState";
import { UserModel } from "./types/models";
import { WebSocketContext } from "./socket/websocket_provider";





function App() {
  const navigate = useNavigate();
  const {updateUserDetails} = useUserStore()
  const {setConn , conn} = useContext(WebSocketContext)

  useEffect(() => {

    setConn(null)

    const getAndVerifyToken = async () => {

      const userToken =  await getUserTokenFromStore()
      if (userToken === null)  {
        navigate("/auth")
      } else {
        await invoke('verify_token_request', { payload: JSON.stringify( { token: userToken})  }).then(async (message) => {
          let recv_msg = JSON.parse(message as string)
            if(!recv_msg.result.success) {
         
              navigate("/auth")
            } else {
              let user_mod: UserModel = {
                id: recv_msg.user_data.id,
                username: recv_msg.user_data.username,
                email: recv_msg.user_data.email,
                first_name: recv_msg.user_data.first_name,
                last_name: recv_msg.user_data.last_name,
                score: recv_msg.user_data.score,
                verified: recv_msg.user_data.verified
              } 

              await updateUserDetails(user_mod)

              if(recv_msg.user_data.verified) {
             conn?.connect({token: userToken , user_id: user_mod.id, username: user_mod.username})
            //  setConn(socket)
                navigate("/home")
              } else {
                navigate("/verify_user")
              }
            }
  
  
        })
      }  
    }
   
    getAndVerifyToken()


  } , [])


  return (
    <Loading/>
  )
  
 
 
}

export default App;
