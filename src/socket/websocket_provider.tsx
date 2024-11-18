import { Channel, Socket } from "phoenix"
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";


interface WebSocketProviderProps {
  children: React.ReactNode
}

type V = Socket | null
type S = Channel | null
export const WebSocketContext = React.createContext<{
    conn: V,
    chann: S,
    setConn: (u: Socket | null) => void;
    setChannel: (u: Channel | null) => void;
}>({
    conn: null,
    chann: null,
    setConn: () => {},
    setChannel: () => {}
});


export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
    children
}) => {
    const [conn, setConn] = useState<V>(null);
    const [chann, setChannel] = useState<S>(null);
    const isConnecting = useRef(false);
  
    useEffect(() => {
      if (!conn  && !isConnecting.current) {
        isConnecting.current = true;
        let socket =  new Socket(
            "wss://localhost:4000/socket",
          );
          
          setConn(socket)

        setTimeout(() => {
                isConnecting.current = false;
        }, 200)
      }
    }, [conn]);
  

  
    return (
      <WebSocketContext.Provider
        value={useMemo(
          () => ({
            conn,
            chann,
            setConn,
            setChannel: (u: Channel | null) => {
              if (conn) {
                  setChannel(u)
              }
            },
          }),
          [conn]
        )}
      >
        {children}
      </WebSocketContext.Provider>
    );
}