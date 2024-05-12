import React , { useEffect, useState } from "react";
import AuthScreen from "./screens/AuthScreen";
import Loading from "./screens/Loading";
import UserHomeScreen from "./screens/UserHomeScreen";
import { RouterProvider, createBrowserRouter, useNavigate} from "react-router-dom"
import { invoke } from '@tauri-apps/api/tauri'
import { getUserTokenFromStore, saveUserDetails } from "./persistent_storage/save_user_details"
import LobbyScreen from "./screens/LobbyScreen"





function App() {
  const navigate = useNavigate();

  useEffect(() => {

    const getAndVerifyToken = async () => {
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
