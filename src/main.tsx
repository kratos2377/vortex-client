import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AuthScreen from "./screens/AuthScreen";
import Loading from "./screens/Loading";
import LobbyScreen from "./screens/LobbyScreen";
import UserHomeScreen from "./screens/UserHomeScreen";



let router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/auth",
    element: <AuthScreen/>
  },
  {
    path: "/home",
    element: <UserHomeScreen/>
  },
  {
    path: "/lobby",
    element: <LobbyScreen gameType={"asdasd"} game_id={"asdasd"} host_user_id={"dsad"}/>
  }
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
