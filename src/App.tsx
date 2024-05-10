import React , { useEffect, useState } from "react";
import AuthScreen from "./screens/AuthScreen";
import Loading from "./screens/Loading";
import UserHomeScreen from "./screens/UserHomeScreen";
import './App.css'
import { invoke } from '@tauri-apps/api/tauri'
import { getUserTokenFromStore, saveUserDetails } from "./persistent_storage/save_user_details";


function App() {

  const [loading , setLoading] = useState(true);
  const [userState , setUserState] = useState<"valid" | "invalid">("invalid");

  const getUserToken = async () => {
    
  }

  useEffect(() => {

    const getAndVerifyToken = async () => {
  //    await saveUserDetails("new_id", "new_token")
      const userToken =  await getUserTokenFromStore()
      invoke('verify_token_request', { payload: JSON.stringify( { token: userToken})  }).then((message) => {
        console.log("Response message is")
        console.log(message)
        setLoading(false)
      })
  
    }
   
    getAndVerifyToken()
  } , [])


  return (
    // Add Login , registration screens and game screens
   <div>
    
   {loading ?  <Loading/> : userState === "invalid" ? <AuthScreen /> : <UserHomeScreen/>}
   </div>
 
  );
}

export default App;
