import React , {useState , useEffect, useContext} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { WebSocketContext } from '../socket/websocket_provider';
import  ChessLogo  from "../assets/chess.svg";
import  ScribbleLogo from "../assets/scribble.svg";
import { useGameStore, useUserStore } from '../state/UserAndGameState';
import usePlayerStore from '../state/chess_store/player';
import { UserGameRelation } from '../types/models';
import { IconLogout, IconPokerChip } from '@tabler/icons-react';
import { ErrorAlert, SuccessAlert } from '../components/ui/AlertMessage';
import StakeMoneyModal from '../components/screens/StakeMoneyModal';
import LeaveSpectateRoomModal from '../components/screens/LeaveSpectateRoomModal';
import GeneralPurposeModal from '../components/screens/GeneralPurposeModal';
import { getUserTokenFromStore } from '../persistent_storage/save_user_details';
import { get_lobby_players, update_player_status } from '../helper_functions/apiCall';
import { useTimer } from 'react-timer-hook';

const MatchScreen = () => {
  const current_time = new Date()
  const {chann , spectatorChannel , setSpectatorChannel} = useContext(WebSocketContext)
  const navigate = useNavigate()
  let {game_id , gameType} = useParams()
  let {user_details} = useUserStore()
  let gameStore = useGameStore()

  const [readyState, setReadyState] = useState(false)
  let [roomUsers , setLobbyUsers] = useState<UserGameRelation[]>([])
  const [updateStatusRequestSent, setUpdateRequestSent] = useState(false)
  const [lobbyRequestSent , setLobbyRequestSent] = useState(false)
  const [disableButton ,setDisableButton] = useState(false)
  //General purpose states
  const [generalPurposeMessage, setGeneralPurposeMessage] = useState("")
  const [generalPurposeTitle, setGeneralPurposeTitle] = useState("")
  

  // alert states
  const [isAlert , setIsAlert] = useState(false)
  const [alertType,setAlertType] = useState<"success" | "error">("success")
  const [alertMessage, setAlertMessage] = useState("")

  //time
      const {
            totalSeconds,
            seconds,
            restart
          } = useTimer({ autoStart: true , expiryTimestamp: current_time , onExpire: () => {
            //Remove Circular clock screen
            
          } });


  // User Player Events
  useEffect(() => {

    if(gameStore.isSpectator)
      return;

         chann?.on("user-status-update", (msg) => {
          let parse_payload = msg
          const updatedUsers = roomUsers.map((user) => user.user_id === parse_payload.user_id ? {...user, player_status: parse_payload.status} : user)
    
    
          setLobbyUsers([...updatedUsers])
         })
    
         chann?.on("remove-all-users" , (msg) => {
          setGeneralPurposeMessage("Host Left the Lobby")
          setGeneralPurposeTitle("Host Left the Lobby. Redirecting to HomeScreen")
          document.getElementById("general_purpose_modal")!.showModal()
    
          setTimeout(() => {
            
          document.getElementById("general_purpose_modal")!.close()
            navigate("/home")
        } , 2000)
         })
    

         chann?.on("start-the-match-for-users" , () => {
          navigate("/" + gameType + "/" + game_id + "/" + "random_host_id")
         })
    
    
        
    
         return () => {
          chann?.off("user-status-update")
          chann?.off("error-event-occured")
          chann?.off("start-the-match-for-users")
         }

  } )


  //User Spectator Events
  useEffect(() => {


    if(!gameStore.isSpectator)
        return;



      spectatorChannel?.on("user-joined-room" , (payload) => {
    
            let new_user: UserGameRelation = {
              user_id: payload.user_id,
              username: payload.username,
              game_id: payload.game_id,
              player_type: "player",
              player_status: 'not-ready'
            }
            setLobbyUsers( (prevState) => {
              let new_ar = [...prevState]
              const isExist = new_ar.filter( (el) => el.user_id === new_user.user_id)
              if (isExist === null || isExist === undefined || isExist.length === 0) {
                new_ar.push(new_user)
              }
              return new_ar
            })
    
          })
    
          spectatorChannel?.on("user-left-room" , (payload) => {
    
            setLobbyUsers( (prevState) => {
              let update_users = prevState.filter((el) => el.user_id !== payload.user_id)
              return update_users
            })
    
          })
    
    
          spectatorChannel?.on("user-status-event" , (payload) => {
    
            setLobbyUsers( (prevState) => {
              const updatedUsers = prevState.map((user) => user.user_id === payload.user_id ? {...user, player_status: payload.status} : user)
              return updatedUsers
              })
          
          })
    
    
          spectatorChannel?.on("game-general-event" , async (payload) => {
    
            if (payload.message === "start-game") {
         
              navigate("/" + gameType + "/" + game_id + "/" + "random_host_id")
            } else if (payload.message === "host-left") {
              setGeneralPurposeMessage("Host Left. Redirecting to home screen")
              setGeneralPurposeTitle("Redirecting")
              document.getElementById("general_purpose_modal")!.showModal()
           
              spectatorChannel.leave().receive("ok" , (msg) => {
                console.log("Successfully left channel")
              }).receive("error" , (msg) => {
                console.log(`Error while leaving channel: ${msg}`)
              })
    
              setSpectatorChannel(null)
    
    
           setTimeout(() => {
            
            document.getElementById("general_purpose_modal")!.close()
            navigate("/home")
           }, 1000)
            }
          
          })

          spectatorChannel?.on("start-the-match-for-spectators" , () => {
            navigate("/" + gameType + "/" + game_id + "/" + "random_host_id")
          })
    
          return () => {
            spectatorChannel?.off("user-joined-room")
            spectatorChannel?.off("user-left-room")
            spectatorChannel?.off("user-status-event")
            spectatorChannel?.off("game-general-event")
            spectatorChannel?.off("start-the-match-for-spectators")
          }


  } )




    const updatePlayerStatus = async (status: string) => {
      setUpdateRequestSent(true)
      let user_token = await getUserTokenFromStore()
      let payload = JSON.stringify({game_id: game_id, user_id: user_details.id, game_name: gameStore.game_name, status: status, is_replay: false   })
      let val = await update_player_status(payload , user_token)
  
      if (!val.status) {
        setAlertMessage(val.error_message)
        setAlertType("error")
        setIsAlert(true)
  
        setTimeout(() => {
  setIsAlert(false)
        }, 2000);
      } else {
        chann?.push("update-user-status-in-room", {user_id: user_details.id , username: user_details.username, game_id: game_id, status: status})
        const updatedUsers = roomUsers.map((user) => user.user_id === user_details.id ? {...user, player_status: status} : user)
  
     
        setLobbyUsers([...updatedUsers])
        setReadyState(!readyState)
        setDisableButton(true)
      }
  
      setUpdateRequestSent(false)
    }

    const getAllLobbyPlayers = async () => {
        setLobbyRequestSent(true)
        let user_token = await getUserTokenFromStore()
        let payload = JSON.stringify({game_id: game_id, host_user_id: "random-host-id"})
        let val = await get_lobby_players( payload,user_token)
    
        if (!val.status) {
    
        } else {
          let parse_models = val.lobby_users.map((el: UserGameRelation) => {
            let model: UserGameRelation ={
              user_id: el.user_id,
              username: el.username,
              game_id: el.game_id,
              player_type: el.player_type,
              player_status: el.player_status
            }
            return model
          })
          setLobbyUsers([...parse_models])

          if(!gameStore.isSpectator) {
            const new_time = new Date()
            new_time.setTime(new_time.getSeconds() + 20)
            restart(new_time)
          }

        }
    
        setLobbyRequestSent(false)
    
      }


    useEffect(() => {
      getAllLobbyPlayers()
    } , [])


  return (
    <>

    {
      lobbyRequestSent ? <div className='h-full w-full flex flex-col justify-center self-center'> <span className="loading loading-ring loading-lg"></span></div>: <div className='h-screen w-screen flex flex-col relative'>

        {
          gameStore.isSpectator ?    <div className='top-4 left-4 z-500 self-center absolute flex flex-row'>
          <button className='ml-2' onClick={() => document.getElementById("leave_spectate_modal")!.showModal()}  >  <IconLogout /> </button>
    
         </div> : <></>
        }

      <div className='h-1/5 w-2/12 p-5 self-center'>
        {gameType === "chess" ? <img src={ChessLogo} alt="chess" />: <img src={ScribbleLogo} alt="scribble" />}
      </div>

      {isAlert ? <div className='my-3'>
        {alertType === "success" ? <SuccessAlert message={alertMessage}/> : <ErrorAlert message={alertMessage} />}
      </div> : <div></div>}

      {
        roomUsers.length === 0 ? <div>No Users Found. Invalid Lobby</div> :     <div className='p-3 grid grid-cols-2 gap-4'>
        {
          roomUsers.map((val , idx) => (
          <div key={idx} className="card w-50 bg-base-100 shadow-xl">
            <figure className="self-center avatar w-20 rounded-full ring ring-black ring-offset-base-100 ring-offset-2 mt-5">
            <img src={`https://robohash.org/${val.username}`} alt={`${val.username}`}/>
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">{val.username}</h2>
              {val.player_status === "ready" ? <h3 className='text-green'>Ready!</h3> : <h3 className='text-red'>Not Ready</h3>}
            </div>
          </div>
          ))
        }
      </div>
      }

  {
    gameStore.isSpectator ? <></> :      <div className='mt-3 self-center'>
   { updateStatusRequestSent ?  <span className="loading loading-spinner loading-md mr-1 ml-1"></span> :
             <button className="btn btn-outline btn-success mr-1 ml-1" onClick={() => updatePlayerStatus("ready")} disabled={disableButton}>Ready!  <span>{seconds}</span></button> }

     </div>
  }
  </div>
    }

<LeaveSpectateRoomModal game_id={game_id!}/>
    <GeneralPurposeModal message={generalPurposeMessage} title={generalPurposeTitle} />
    </>
  )
}

export default MatchScreen