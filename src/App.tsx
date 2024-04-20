import React , { useEffect, useState } from "react";
import AuthScreen from "./screens/AuthScreen";
import Loading from "./screens/Loading";
import UserHomeScreen from "./screens/UserHomeScreen";


function App() {

  const [loading , setLoading] = useState(true);
  const [userState , setUserState] = useState("");


  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    } , 5000)

    setTimeout(() => {
      setUserState("new-state")
    }, 8000)
  } , [])


  return (
    // Add Login , registration screens and game screens
   <div>
    
   {loading ?  <Loading/> : userState === "" ? <AuthScreen /> : <UserHomeScreen/>}
   </div>
 
  );
}

export default App;
