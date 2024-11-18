import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AuthScreen from "./screens/AuthScreen";
import LobbyScreen from "./screens/LobbyScreen";
import UserHomeScreen from "./screens/UserHomeScreen";
import VerifyUserScreen from "./screens/VerifyUserScreen";
import InvalidLobbyScreen from "./screens/InvalidLobbyScreen";
import ChessGame from "./chess";
import ScribbleGame from "./scribble";
import PokerGame from "./poker";
import { WebSocketProvider } from "./socket/websocket_provider";



let router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/verify_user",
    element: <VerifyUserScreen />
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
    path: "/invalid_lobby/:game_id/:game_name/:host_user_id",
    element: <InvalidLobbyScreen/>
  },
  {
    path: "/lobby/:game_id/:gameType/:host_user_id",
    element: <LobbyScreen />
  },
  {
    path: "/chess/:game_id/:host_user_id",
    element: <ChessGame/>
  },
  {
    path: "/scribble/:game_id/:host_user_id",
    element: <ScribbleGame/>
  },
  {
    path: "/poker/:game_id/:host_user_id",
    element: <PokerGame/>
  }
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(

   <WebSocketProvider>
     <RouterProvider router={router} />
   </WebSocketProvider>
);
