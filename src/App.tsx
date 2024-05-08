import React , { useEffect, useState } from "react";
import AuthScreen from "./screens/AuthScreen";
import Loading from "./screens/Loading";
import UserHomeScreen from "./screens/UserHomeScreen";
import ChessGame from "./chess";
import './App.css'
import ScribbleGame from "./scribble";
import { invoke } from '@tauri-apps/api/tauri'
import { getUserTokenFromStore, saveUserDetails } from "./persistent_storage/save_user_details";
import Walletscreen from "./screens/walletscreen";


function App() {

  const [loading , setLoading] = useState(true);
  const [userState , setUserState] = useState("");

  const getUserToken = async () => {
    
  }

  useEffect(() => {

    const newFunc = async () => {
  //    await saveUserDetails("new_id", "new_token")
      const userToken =  await getUserTokenFromStore()
      invoke('verify_token_request', { payload: JSON.stringify( { token: userToken})  }).then((message) => {
        console.log("Response message is")
        console.log(message)
        setLoading(false)
      })
  
    }




setTimeout(() => {
  setLoading(false)
} , 4000)
   // newFunc()
  } , [])


  return (
    // Add Login , registration screens and game screens
   <div>
    
   {/* {loading ?  <Loading/> : userState === "" ? <AuthScreen /> : <UserHomeScreen/>} */}
   {/* {loading ? <Loading/> : <ChessGame/>} */}
   {loading ? <Loading/> : <Walletscreen/>}
   </div>
 
  );
}

export default App;
