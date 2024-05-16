import React , { useEffect, useState } from "react";
import Loading from "./screens/Loading";
import { invoke } from '@tauri-apps/api/tauri'
import { deleteUserDetailsFromStore, getUserTokenFromStore } from "./persistent_storage/save_user_details"
import { useNavigate } from "react-router-dom";
import { useUserStore } from "./state/UserAndGameState";
import { UserModel } from "./types/models";





function App() {
  const navigate = useNavigate();
  const {updateUserDetails} = useUserStore()

  useEffect(() => {


    const getAndVerifyToken = async () => {
    //  await deleteUserDetailsFromStore()
      const userToken =  await getUserTokenFromStore()
      if (userToken === null)  {
        navigate("/auth")
      } else {
        invoke('verify_token_request', { payload: JSON.stringify( { token: userToken})  }).then((message) => {
          let recv_msg = JSON.parse(message)
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

              updateUserDetails(user_mod)
              navigate("/home")
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
