import { Channel } from "phoenix"
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "./socket";


interface WebSocketProviderProps {
  children: React.ReactNode
}

type S = Channel | null
export const WebSocketContext = React.createContext<{
    chann: S,
    userChannel: S,
    spectatorChannel: S,
    setChannel: (u: Channel | null) => void;
    setUserChannel: (u: Channel | null) => void;
    setSpectatorChannel: (u: Channel | null) => void;
}>({
    chann: null,
    userChannel: null,
    spectatorChannel: null,
    setChannel: () => {},
    setUserChannel: () => {},
    setSpectatorChannel: () => {},
});


export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
    children
}) => {
    const [chann, setChannel] = useState<S>(null);
    const [userChannel , setUserChannel] = useState<S>(null);
    const [spectatorChannel , setSpectatorChannel] = useState<S>(null);
    // useEffect(() => {
    //   if (!conn  && !isConnecting.current) {
    //     isConnecting.current = true;
    //     let socket =  new Socket(
    //         "ws://localhost:4001/socket",
    //       );
          
    //       setConn(socket)

    //     setTimeout(() => {
    //             isConnecting.current = false;
    //     }, 200)
    //   }
    // }, [conn]);

    useEffect(() => {

      if(userChannel !== null && userChannel !== undefined) {
          userChannel.on("game-invite-event", (msg) => {
            console.log("Game Invite Event Recieved")
            console.log(msg)
          })

          userChannel.on("friend-request-event", (msg) => {
            console.log("Friend Request Event Recieved")
            console.log(msg)
          })
      }

      if(userChannel !== null && userChannel !== undefined) {
        
        return  () => {
          userChannel.off("game-invite-event")
          userChannel.off("friend-request-event")
        }
    }


 
    })


  
    return (
      <WebSocketContext.Provider
        value={useMemo(
          () => ({
            chann,
            userChannel,
            spectatorChannel,
            setChannel,
            setUserChannel,
            setSpectatorChannel
          }),
          [chann]
        )}
      >
        {children}
      </WebSocketContext.Provider>
    );
}