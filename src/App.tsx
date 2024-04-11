import React , { useState } from "react";
import Login from "./screens/login";
import AuthScreen from "./screens/AuthScreen";


function App() {

  const [loading , setLoading] = useState(true);

  return (
    // Add Login , registration screens and game screens
   <div>
    
    <AuthScreen/>
   </div>
 
  );
}

export default App;
