import React , { useEffect, useState } from "react";
import Loading from "./screens/Loading";
import { invoke } from '@tauri-apps/api/tauri'
import { deleteUserDetailsFromStore, getUserTokenFromStore } from "./persistent_storage/save_user_details"
import { useNavigate } from "react-router-dom";





function App() {
  const navigate = useNavigate();

  useEffect(() => {


    const getAndVerifyToken = async () => {
      await deleteUserDetailsFromStore()
      const userToken =  await getUserTokenFromStore()
      if (userToken === null)  {
        navigate("/auth")
      } else {
        invoke('verify_token_request', { payload: JSON.stringify( { token: userToken})  }).then((message) => {
          let recv_msg = JSON.parse(message)
            if(!recv_msg.result.success) {
         
              navigate("/auth")
            } else {
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
