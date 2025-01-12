import { useScroll, useTransform } from "framer-motion";
import {  useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import { IconCheck, IconX } from "@tabler/icons-react";
import { GameInviteUserModel, MQTTPayload } from "../../types/models";
import { useChessMainStore, useGameStore, useUserStore } from "../../state/UserAndGameState";
import { join_lobby_call, verify_game_status_call } from "../../helper_functions/apiCall";
import { getUserTokenFromStore } from "../../persistent_storage/save_user_details";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket/socket";
import { WebSocketContext } from "../../socket/websocket_provider";



interface GameInviteScrollProps  {
  setIsAlert: React.Dispatch<React.SetStateAction<boolean>>,
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>,
  setAlertType: React.Dispatch<React.SetStateAction<"success" | "error">>
}

export const GameInvitesScroll = ({setIsAlert , setAlertMessage , setAlertType}: GameInviteScrollProps) => {

  const {setChannel} = useContext(WebSocketContext)
    const gridRef = useRef<any>(null);
    const { scrollYProgress } = useScroll({
      container: gridRef,
      offset: ["start start", "end start"], 
    });
    const {restart} = useChessMainStore()
    const navigate = useNavigate()
    const [requestSent , setRequestSent] = useState(false)
    const {game_invites} = useUserStore()
   
    const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const {user_details} = useUserStore()
    const [sortedUsers, setSortedUsers] = useState<GameInviteUserModel[]>([...game_invites]);
    const {updateGameId, updateGameName, updateGameType , updateUserPlayerCountId , updateIsSpectator} = useGameStore()

    // const startGameInviteListener = async () => {
    //   const unlisten =  listen<MQTTPayload>(GAME_INVITE_EVENT, (event) => {
    //       let parsed_payload = JSON.parse(event.payload.message) 
    //       let model: GameInviteUserModel = {
    //         game_id: parsed_payload.game_id,
    //         user_id: parsed_payload.user_who_send_request_id,
    //         username: parsed_payload.user_who_send_request_username,
    //         game_name: parsed_payload.game_name,
    //         game_type: parsed_payload.game_type
    //       }
    //       setSortedUsers([model, ...sortedUsers])
    //       addGameInviteModel(model)
    // });

    // return () => {
    //   unlisten.then(f => f())
    // }
    // }


    const updateGameInvites = (invites: GameInviteUserModel[]) => {
        setSortedUsers([...invites])
    }



    useEffect(() => {
       
      useUserStore.subscribe( (state) => state.game_invites , updateGameInvites)
    }, [])

    const acceptAndJoinLobby = async (game_id: string , game_name: string, game_type: string) => {
      setRequestSent(true)
      document.getElementById("joining_lobby_modal")!.showModal()
      let user_token = await getUserTokenFromStore()
      let payload = JSON.stringify({user_id: user_details.id, game_id: game_id, game_name: game_name, username: user_details.username})
      let val = await join_lobby_call( payload,user_token)

      if (!val.status) {
        document.getElementById('joining_lobby_modal')!.close()
        setAlertMessage(val.error_message)
        setAlertType("error")
        setIsAlert(true)

        setTimeout(() => {
          setIsAlert(false)
        }, 3000)
      } else {

        restart()

        let chann_new = socket.channel("game:chess:" + game_id , {})

        chann_new.join().receive("ok" , async () => {


          document.getElementById('joining_lobby_modal')!.close()
          document.getElementById("redirecting_to_lobby_modal")!.showModal()
          let verify_call_payload = JSON.stringify({game_id: game_id , game_name: game_name, host_user_id: val.game_host_id, user_id: user_details.id})
          let verify_rsp = await verify_game_status_call( verify_call_payload,user_token)
  
          if (!verify_rsp.status) {
            document.getElementById("redirecting_to_lobby_modal")!.close()
            navigate("/invalid_lobby/"  + game_id + "/" + game_name + "/" + val.game_host_id)
          }
          // Add Game subscription
          else {
        //    chann_new.push("joined-room" , {user_id: user_details.id , username: user_details.username , game_id: game_id})
            setChannel(chann_new)
            updateIsSpectator(false)
            updateGameId(game_id)
            updateGameName(game_name)
            updateGameType(game_type)
            updateUserPlayerCountId(val.user_count_id)
            setTimeout(() => {
              document.getElementById("redirecting_to_lobby_modal")!.close()
              navigate("/lobby/" + game_id + "/" + game_name + "/" + val.game_host_id)
            }, 100)
          }

        }).receive("error" , async () => {

          setAlertMessage("Error While Joining the Game channel")
          setAlertType("error")
          setIsAlert(true)
  
          setTimeout(() => {
            setIsAlert(false)
          }, 3000)

        })


      }


      setRequestSent(false)
    }

    // Game Fix
    const removeGameInvite = async (invite_id: string) => {
      setRequestSent(true)
        let new_array = sortedUsers.filter((el) => el.game_id !== invite_id)
        setSortedUsers([...new_array])
        setRequestSent(false)
    }

   
    return (
      <div>
      {
        sortedUsers.length === 0 ? <div className="h-[calc(100vh-20rem)] flex flex-col items-center justify-center text-white text-xl">Add Friends From Profile Section
        {/* <button className="btn btn-outline btn-success mt-2">Go to Profile Section</button> */}
        </div> :   <div
        className={cn("h-[calc(100vh-10rem)] items-start overflow-y-auto w-9/10")}
        ref={gridRef}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 items-start  mx-auto gap-10 py-10 px-10"
          ref={gridRef}
        >
          <div className="grid gap-10">
            {sortedUsers.map((el, idx) => (
              <motion.div
                style={{ y: translateFirst }} // Apply the translateY motion value here
                key={"grid-1" + idx}
              >
   <div key={el.game_id + "-" + el.user_id} className="card card-side bg-slate-700 shadow-xl">
    <div className="flex flex-col item-center justify-center">
  <figure className={`ml-2 my-2 avatar w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2`}><img src={`https://robohash.org/${el.username}`} alt={`${el.username}`}/></figure>
  </div>
  <div className="card-body">
    <p className="text-white w-full text-lg">{el.username} has invite you to play {el.game_name}</p>
    <p className="text-white">{el.game_type} Game</p>
  </div>


  <div className="card-actions justify-end flex flex-row self-center mr-1">
     {
      requestSent ? <span className="loading loading-spinner loading-md text-white"></span> :  <div>
         <button className="btn btn-success text-white" onClick={() => {
          acceptAndJoinLobby(el.game_id, el.game_name, el.game_type)
            removeGameInvite(el.game_id)
   
         }}><IconCheck/></button>
      <button className="btn btn-error text-white" onClick={() => removeGameInvite(el.game_id)}><IconX/></button>
         </div>
     }
    </div>

</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      }
      </div>
    );
  };