import { Channel } from "phoenix"
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";


interface WebSocketProviderProps {
  children: React.ReactNode
}

type S = Channel | null
export const WebSocketContext = React.createContext<{
    chann: S,
    setChannel: (u: Channel | null) => void;
}>({
    chann: null,
    setChannel: () => {}
});


export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
    children
}) => {
    const [chann, setChannel] = useState<S>(null);
  
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
  

  
    return (
      <WebSocketContext.Provider
        value={useMemo(
          () => ({
            chann,
            setChannel,
          }),
          [chann]
        )}
      >
        {children}
      </WebSocketContext.Provider>
    );
}