import { Channel } from "phoenix"
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "./socket";
import { useChessMainStore, useUserStore } from "../state/UserAndGameState";
import { FriendRequestModel, GameInviteUserModel } from "../types/models";


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
    const {addGameInviteModel , addFriendRequestModel} = useUserStore()
    const {setBlackTimeLeft , setWhiteTimeLeft} = useChessMainStore()
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

               let model: GameInviteUserModel = {
                        game_id: msg.game_id,
                        user_id: msg.user_who_send_request_id,
                        username: msg.user_who_send_request_username,
                        game_name: msg.game_name,
                        game_type: msg.game_type
                      }

            addGameInviteModel(model)
          })

          userChannel.on("friend-request-event", (msg) => {
            console.log("Friend Request Event Recieved")
            console.log(msg)

            let model: FriendRequestModel = {
              friend_request_id: msg.friend_request_id,
              user_who_send_request_id: msg.user_who_send_request_id,
              user_who_send_request_username: msg.user_who_send_request_username,
              user_who_we_are_sending_event: msg.user_who_we_are_sending_event 
            }

            addFriendRequestModel(model)
          })

      }

      if(userChannel !== null && userChannel !== undefined) {
        
        return  () => {
          userChannel.off("game-invite-event")
          userChannel.off("friend-request-event")
        }
    }


 
    })

    // useEffect(() => {

    //   if(spectatorChannel !== null && spectatorChannel !== undefined) {

    //     spectatorChannel.on("game_current_state" , (msg) => {
    //       console.log("Game current state is")
    //       let parsed_data = JSON.parse(msg.data)

    //       setBlackTimeLeft(parsed_data.time_left_for_black_player)
    //       setWhiteTimeLeft(parsed_data.time_left_for_white_player)
        
          
    //     })

    //   }


    //   if(spectatorChannel !== null && spectatorChannel !== undefined) {
    //     spectatorChannel.off("game_current_state")
    //   }

    // })


  
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
          [chann , userChannel , spectatorChannel]
        )}
      >
        {children}
      </WebSocketContext.Provider>
    );
}