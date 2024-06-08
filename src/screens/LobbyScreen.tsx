import React, { useCallback, useEffect, useState } from 'react'
import  ChessLogo  from "../assets/chess.svg";
import  ScribbleLogo from "../assets/scribble.svg";
import { useNavigate, useParams } from 'react-router-dom';
import { useGameStore, useUserStore } from '../state/UserAndGameState';
import OnlineFriendInviteModal from '../components/screens/OnlineFriendInviteModal';
import { ErrorAlert, SuccessAlert } from '../components/ui/AlertMessage';
import { getUserTokenFromStore } from '../persistent_storage/save_user_details';
import { destroy_lobby_and_game, get_lobby_players, get_user_turn_mappings, leave_lobby_call, start_game, update_player_status } from '../helper_functions/apiCall';
import { PlayerTurnMappingModel, TurnModel, UserGameRelation } from '../types/models';
import { socket } from '../socket/socket';
import GeneralPurposeModal from '../components/screens/GeneralPurposeModal';
import usePlayerStore from '../state/chess_store/player';
import { Color } from '../types/chess_types/constants';



const LobbyScreen = () => {

  //const {currentLobbyUsers} = use
  const navigate = useNavigate()
  let {game_id , gameType , host_user_id} = useParams()
  let {user_details} = useUserStore()
  let {game_name , updateGameId , updateGameName , updateGameType, updatePlayerTurnModel , user_player_count_id} = useGameStore()
  const {setPlayerColor} = usePlayerStore()
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

  const startTheGame = async () => {
    setGeneralPurposeMessage("")
    setGeneralPurposeTitle("Verifying and Starting Game")
    document.getElementById("general_purpose_modal")!.showModal()
    //Getting tokens and call start_game API
    let user_token = await getUserTokenFromStore()
    let verify_socket_payload = JSON.stringify({user_id: host_user_id , game_id: game_id})
    socket.emit("verifying-game-status" , verify_socket_payload)

    let start_game_payload = JSON.stringify({game_id: game_id , game_name: gameType})
    let val = await start_game(start_game_payload , user_token)

    if (!val.status) {
      let error_payload = JSON.stringify({game_id: game_id , error_message: val.error_message})
      socket.emit("error-event", error_payload )
      setAlertMessage(val.error_message)
      setAlertType("error")
      setIsAlert(true)
      document.getElementById("general_purpose_modal")!.close()
      setTimeout(() => {
        setIsAlert(false)
      } , 4000)
    } else {
      socket.emit("get-turn-mappings" , JSON.stringify({game_id: game_id}))
      let turn_mapping_call = await get_user_turn_mappings( JSON.stringify({game_id: game_id}),user_token) 

      if (!turn_mapping_call.status) {
        let error_payload = JSON.stringify({game_id: game_id , error_message: val.error_message})
        socket.emit("error-event", error_payload )
        setAlertMessage(val.error_message)
        setAlertType("error")
        setIsAlert(true)
        document.getElementById("general_purpose_modal")!.close()
        setTimeout(() => {
          setIsAlert(false)
        } , 4000)
      } else {
        let new_player_turn: PlayerTurnMappingModel ={
          game_id: game_id!,
          turn_mappings: turn_mapping_call.user_turns.turn_mappings.map((el: string) => {
            let parse_el = JSON.parse(el) as TurnModel
            let new_mapping_model: TurnModel = {
              count_id: parse_el.count_id,
              user_id: parse_el.user_id,
              username: parse_el.username
            }
            return new_mapping_model
          })
        }
        updatePlayerTurnModel(new_player_turn)
        let start_game_payload = JSON.stringify({admin_id: host_user_id , game_id: game_id, game_name: game_name})
        socket.emit("start-game-event" , start_game_payload)
        document.getElementById("general_purpose_modal")!.close()
        navigate("/" + game_name + "/" + game_id  + "/" + host_user_id)
      }

     
    }
  }

  const updatePlayerStatus = async (status: string) => {
    setUpdateRequestSent(true)
    let user_token = await getUserTokenFromStore()
    let payload = JSON.stringify({game_id: game_id, user_id: user_details.id, game_name: game_name, status: status   })
    let val = await update_player_status(payload , user_token)

    if (!val.status) {
      setAlertMessage(val.error_message)
      setAlertType("error")
      setIsAlert(true)

      setTimeout(() => {
setIsAlert(false)
      }, 2000);
    } else {
      socket.emit("update-user-status-in-room", JSON.stringify({user_id: user_details.id , username: user_details.username, game_id: game_id, status: status}))
      const updatedUsers = roomUsers.map((user) => user.user_id === user_details.id ? {...user, player_status: status} : user)

   
      setLobbyUsers([...updatedUsers])
      setReadyState(!readyState)
    }

    setUpdateRequestSent(false)
  }

  const getAllLobbyPlayers = async () => {
    setLobbyRequestSent(true)
    let user_token = await getUserTokenFromStore()
    let payload = JSON.stringify({game_id: game_id, host_user_id: host_user_id})
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
    }

    setLobbyRequestSent(false)

  }

  const leaveLobby = async () => {
    setGeneralPurposeMessage("Leaving the lobby and redirecting to home screen")
    setGeneralPurposeTitle("Leaving Lobby")
    document.getElementById("general_purpose_modal")!.showModal()
    let user_token = await getUserTokenFromStore()
    let payload = JSON.stringify({ user_id: user_details.id, username: user_details.username, game_id: game_id, game_name: game_name })
    let val = await leave_lobby_call( payload, user_token)
    if(!val.status) {
setAlertMessage(val.error_message)
setAlertType("error")
document.getElementById("general_purpose_modal")!.close()
setIsAlert(true)

setTimeout(() => {
  setIsAlert(false)
}, 3000)
    } else {
      let isHost = user_details.id === host_user_id
      updateGameId("")
      updateGameName("")
      updateGameType("")
      socket.emit("leaved-room", JSON.stringify({game_id: game_id, user_id: user_details.id , username: user_details.username, player_type: isHost ? "host" : "player"}))
      let delete_payload = JSON.stringify({game_id: game_id})
      await destroy_lobby_and_game(delete_payload ,user_token)
      setTimeout(() => {
        document.getElementById("general_purpose_modal")!.close()
        navigate("/home")
      }, 1000)
    }
  }

  const sendJoinedRoomSocketEvent = useCallback(() => {
    socket.emit("joined-room", JSON.stringify({game_id: game_id, user_id: user_details.id , username: user_details.username}))


    return () => {
      socket.off("joined-room")
    }
  }, [])



  useEffect(() => {
    if (gameType==="chess" && user_player_count_id !== "1") {
      setPlayerColor(Color.BLACK)
    }
    getAllLobbyPlayers()
  } , [])

  useEffect(() => {
    
      sendJoinedRoomSocketEvent()
   
  } , [sendJoinedRoomSocketEvent])


  // Having socket calls
  useEffect(() => {

    socket.on("user-left-room" , (msg) => {
      let parsed_payload = JSON.parse(msg)
      let update_users = roomUsers.filter((el) => el.user_id !== parsed_payload.user_id)
      setLobbyUsers([...update_users])
     })

     socket.on("new-user-joined", (msg) => {
      let parsed_payload = JSON.parse(msg)
      let new_user: UserGameRelation = {
        user_id: parsed_payload.user_id,
        username: parsed_payload.username,
        game_id: parsed_payload.game_id,
        player_type: "player",
        player_status: 'not-ready'
      }
      setLobbyUsers( (prevState) => [...prevState , new_user])
     })

     socket.on("user-status-update", (msg) => {
      let parse_payload = JSON.parse(msg)
      const updatedUsers = roomUsers.map((user) => user.user_id === parse_payload.user_id ? {...user, player_status: parse_payload.status} : user)


      setLobbyUsers([...updatedUsers])
     })

     socket.on("remove-all-users" , (msg) => {
      setGeneralPurposeMessage("Host Left the Lobby")
      setGeneralPurposeTitle("Host Left the Lobby. Redirecting to HomeScreen")
      document.getElementById("general_purpose_modal")!.showModal()

      setTimeout(() => {
        
      document.getElementById("general_purpose_modal")!.close()
        navigate("/home")
    } , 2000)
     })

     socket.on("verifying-game" , (msg) => {
      setGeneralPurposeMessage("")
      setGeneralPurposeTitle("Verifying and Starting Game")
      document.getElementById("general_purpose_modal")!.showModal()
     })

     socket.on("start-game-for-all" , (msg) => {
      
      document.getElementById("general_purpose_modal")!.close()
      navigate("/" + game_name + "/" + game_id  + "/" + host_user_id)
     })

     socket.on("error-event-occured" , (msg) => {
      let parsed_payload = JSON.parse(msg as string)
      setAlertMessage(parsed_payload.error_message)
setAlertType("error")
setIsAlert(true)

setTimeout(() => {
  setIsAlert(false)
}, 3000)
     })


     socket.on("fetch-user-turn-mappings", async (msg) => {
      let user_token = await getUserTokenFromStore()
      let turn_mapping_call = await get_user_turn_mappings( JSON.stringify({game_id: game_id}),user_token) 
      let new_player_turn: PlayerTurnMappingModel ={
        game_id: game_id!,
        turn_mappings: JSON.parse(turn_mapping_call.user_turns)
      }
      updatePlayerTurnModel(new_player_turn)
     })

     return () => {
      socket.off("user-left-room")
      socket.off("new-user-joined")
      socket.off("user-status-update")
      socket.off("remove-all-users")
      socket.off("verifying-game")
      socket.off("start-game-for-all")
      socket.off("error-event-occured")
      socket.off("fetch-user-turn-mappings")
     }
  })

  return (
    <>

    {
      lobbyRequestSent ? <div className='h-full w-full flex flex-col justify-center self-center'> <span className="loading loading-ring loading-lg"></span></div>: <div className='h-full w-full flex flex-col'>
      <div className='h-1/5 w-2/12 p-5 self-center'>
        {gameType === "chess" ? <img src={ChessLogo} alt="chess" />: <img src={ScribbleLogo} alt="scribble" />}
      </div>

      {isAlert ? <div className='my-3'>
        {alertType === "success" ? <SuccessAlert message={alertMessage}/> : <ErrorAlert message={alertMessage} />}
      </div> : <div></div>}

      {
        roomUsers.length === 0 ? <div>No Users Found. Invalid Lobby</div> :     <div className='p-3 grid grid-cols-5 gap-4'>
        {
          roomUsers.map((val , idx) => (
          <div key={idx} className="card w-50 bg-base-100 shadow-xl">
            <figure className="self-center avatar w-20 rounded-full ring ring-black ring-offset-base-100 ring-offset-2 mt-5">
            <img src={`https://robohash.org/${val.username}`} alt={`${val.username}`}/>
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">{val.username}</h2>
              {val.user_id === host_user_id ? <h3 className="">(Host)</h3> : <div></div>}
              {val.player_status === "ready" ? <h3 className='text-green'>Ready!</h3> : <h3 className='text-red'>Not Ready</h3>}
            </div>
          </div>
          ))
        }
      </div>
      }

      <div className='mt-3 self-center'>
     {user_details.id === host_user_id ?  <button className="btn btn-outline btn-success mr-1" disabled={disableButton} onClick={startTheGame}>Start the Game</button> : <div></div>}
    { updateStatusRequestSent ?  <span className="loading loading-spinner loading-md mr-1 ml-1"></span> :
         !readyState ?        <button className="btn btn-outline btn-success mr-1 ml-1" onClick={() => updatePlayerStatus("ready")} disabled={disableButton}>Ready!</button> :        <button className="btn btn-outline btn-error mr-1 ml-1" onClick={() => updatePlayerStatus("not-ready")} disabled={disableButton}>Not Ready</button> }
     <button className="btn btn-outline btn-info mr-1 ml-1" onClick={() => document.getElementById("online_friend_invite_modal")!.showModal()} disabled={disableButton}>Invite Friends</button>
      <button className="btn btn-outline btn-error ml-1" onClick={leaveLobby} disabled={disableButton}>Leave Lobby</button>
      </div>
  </div>
    }

    <OnlineFriendInviteModal/>
    <GeneralPurposeModal message={generalPurposeMessage} title={generalPurposeTitle} />
    </>
  )
}

export default LobbyScreen