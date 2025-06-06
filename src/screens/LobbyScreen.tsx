import React, { useCallback, useContext, useEffect, useState } from 'react'
import  ChessLogo  from "../assets/chess.svg";
import { useNavigate, useParams } from 'react-router-dom';
import { useGameStore, useUserStore } from '../state/UserAndGameState';
import OnlineFriendInviteModal from '../components/screens/OnlineFriendInviteModal';
import { ErrorAlert, SuccessAlert } from '../components/ui/AlertMessage';
import { getUserTokenFromStore } from '../persistent_storage/save_user_details';
import { destroy_lobby_and_game, get_lobby_players, get_user_turn_mappings, leave_lobby_call, start_game, update_player_status } from '../helper_functions/apiCall';
import { PlayerTurnMappingModel, TurnModel, UserGameRelation } from '../types/models';
import GeneralPurposeModal from '../components/screens/GeneralPurposeModal';
import { IconLogout } from '@tabler/icons-react';
import LeaveSpectateRoomModal from '../components/screens/LeaveSpectateRoomModal';
import { WebSocketContext } from '../socket/websocket_provider';
import StakeMoneyModal from '../components/screens/StakeMoneyModal';
import {  useTimer } from 'react-timer-hook';


const LobbyScreen = () => {
  const currentTime = new Date();
  currentTime.setSeconds(currentTime.getSeconds() + 60)


  const {setChannel, chann , spectatorChannel , setSpectatorChannel} = useContext(WebSocketContext)
  const navigate = useNavigate()
  let {game_id , gameType , host_user_id} = useParams()
  let {user_details} = useUserStore()
  let gameStore = useGameStore()
  const [readyState, setReadyState] = useState(false)
  const [time , setTime] = useState(currentTime)
  
  let [roomUsers , setLobbyUsers] = useState<UserGameRelation[]>([])
  const [updateStatusRequestSent, setUpdateRequestSent] = useState(false)
  const [lobbyRequestSent , setLobbyRequestSent] = useState(false)

  //Disbale Button states
  const [disableUpdateStatusButton , setDisableUpdateStatusButton] = useState(false)
  const [disableInviteFriendsButton, setDisableInviteFriendsButton] = useState(false)
  const [disableLeaveLobbyButton , setDisableLeaveLobbyButton] = useState(false)
  const [disableButton ,setDisableButton] = useState(false)
  const [disbaleStakeButton , setDisbaleStakeButton] = useState(true)
  //General purpose states
  const [generalPurposeMessage, setGeneralPurposeMessage] = useState("")
  const [generalPurposeTitle, setGeneralPurposeTitle] = useState("")

  // alert states
  const [isAlert , setIsAlert] = useState(false)
  const [alertType,setAlertType] = useState<"success" | "error">("success")
  const [alertMessage, setAlertMessage] = useState("")


  
  // Ready Status timer
  const {
    start,
    minutes,
    seconds,
    restart: timeRestart
  } = useTimer({ autoStart: true, expiryTimestamp: time , onExpire: async () => {

    if (gameStore.game_type === "staked") {

      await updatePlayerStatus("ready")
      setDisableButton(true)
    } else {
      await updatePlayerStatus("ready")
    }

  } });


  
//Stake timer
const {
  pause: stakePause,
  start: stakeStart,
  minutes: stakeMinutes,
  seconds: stakeSeconds,
  restart: stakeTimeRestart
} = useTimer({ autoStart: false , expiryTimestamp: time , onExpire: () => {
setDisbaleStakeButton(true)
} });



  const startTheGame = async () => {
    setGeneralPurposeMessage("")
    setGeneralPurposeTitle("Verifying and Starting Game")
    document.getElementById("general_purpose_modal")!.showModal()
    //Getting tokens and call start_game API
    let user_token = await getUserTokenFromStore()
    chann?.push("verifying-game-status" , {user_id: host_user_id , game_id: game_id})

    let start_game_payload = JSON.stringify({game_id: game_id , game_name: gameType})
    let val = await start_game(start_game_payload , user_token)

    if (!val.status) {
     // chann?.push("error-event", {game_id: game_id , error_message: val.error_message} )
      setAlertMessage(val.error_message)
      setAlertType("error")
      setIsAlert(true)
      document.getElementById("general_purpose_modal")!.close()
      setTimeout(() => {
        setIsAlert(false)
      } , 4000)
    } else {

        chann?.push("start-game-event" , {admin_id: host_user_id , game_id: game_id, game_name: gameStore.game_name})
        document.getElementById("general_purpose_modal")!.close()
        navigate("/" + gameStore.game_name + "/" + game_id  + "/" + host_user_id)
    //  }

     
    }
  }

  const updatePlayerStatus = async (status: string) => {
    setUpdateRequestSent(true)
    let user_token = await getUserTokenFromStore()
    let payload = JSON.stringify({game_id: game_id, user_id: user_details.id, game_name: gameStore.game_name, status: status , is_replay: false , is_match: false  })
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

      if(gameStore.game_type === "staked") {
        setDisableUpdateStatusButton(true)
      }
    }

    setUpdateRequestSent(false)
  }

  const getAllLobbyPlayers = async () => {
    gameStore.resetPlayerTurnModel()
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
          player_status: el.player_status,
          has_staked: false
        }
        return model
      })

      let turn_models = val.lobby_users.map((el: UserGameRelation , ind: number) => {
        let model: TurnModel ={
          count_id: ind,
          user_id: el.user_id,
          username: el.username,
        }
        gameStore.updatePlayerTurnModel(model)
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
    let payload = JSON.stringify({ user_id: user_details.id, username: user_details.username, game_id: game_id, game_name: gameStore.game_name })
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
      gameStore.updateGameId("")
      gameStore.updateGameName("")
      gameStore.updateGameType("")
      chann?.push("leaved-room", {game_id: game_id, user_id: user_details.id , username: user_details.username, player_type: isHost ? "host" : "player"})
     
      if(isHost) {
        let delete_payload = JSON.stringify({game_id: game_id , game_name: gameType})
        await destroy_lobby_and_game(delete_payload ,user_token)
      }

      chann?.leave()
      setChannel(null)

      setTimeout(() => {
        document.getElementById("general_purpose_modal")!.close()
        navigate("/home")
      }, 1000)
    }
  }

  //Spectator calls (This needs to be fixed)



  // Having chann? calls
  useEffect(() => {

    if (gameStore.isSpectator)
      return;

       console.log(`listening to chann? events value is, isSpectator: ${gameStore.isSpectator}`)

       console.log("Game Chann is")
       console.log(chann)

    chann?.on("user-left-room" , (msg) => {
      let parsed_payload = msg
      let update_users = roomUsers.filter((el) => el.user_id !== parsed_payload.user_id)
      
      gameStore.removeGamePlayer(parsed_payload.user_id)
      setLobbyUsers([...update_users])
     })

     chann?.on("new-user-joined", (msg) => {
      let parsed_payload = msg
      gameStore.updatePlayerTurnModel({count_id: 2 , user_id: parsed_payload.user_id, username: parsed_payload.username })
      let new_user: UserGameRelation = {
        user_id: parsed_payload.user_id,
        username: parsed_payload.username,
        game_id: parsed_payload.game_id,
        player_type: "player",
        player_status: 'not-ready',
        has_staked: false
      }
      setLobbyUsers( (prevState) => [...prevState , new_user])
     })

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
        chann.leave()
        setChannel(null)
      document.getElementById("general_purpose_modal")!.close()
        navigate("/home")
    } , 2000)
     })

     chann?.on("verifying-game" , (msg) => {
      setGeneralPurposeMessage("")
      setGeneralPurposeTitle("Verifying and Starting Game")
     // document.getElementById("general_purpose_modal")!.showModal()
     })

     chann?.on("start-game-for-all" , (msg) => {
      
      document.getElementById("general_purpose_modal")!.close()
      navigate("/" + gameStore.game_name + "/" + game_id  + "/" + host_user_id)
     })

     chann?.on("error-event-occured" , (msg) => {
      let parsed_payload = msg
      setAlertMessage(parsed_payload.error_message)
setAlertType("error")
setIsAlert(true)

setTimeout(() => {
  setIsAlert(false)
}, 3000)
     })


     chann?.on("player-staking-available-user" , async (msg) => {
      let new_time = new Date()
      new_time.setSeconds(new_time.getSeconds() + 180)
        setDisbaleStakeButton(false)
        setDisableLeaveLobbyButton(true)
        setDisableInviteFriendsButton(true)
        setDisableUpdateStatusButton(true)

        stakeStart()
        stakeTimeRestart(new_time)
     })

     chann?.on("player-stake-complete-user" , async (msg) => {
      setDisbaleStakeButton(true)
      setDisableInviteFriendsButton(true)
      setDisableLeaveLobbyButton(true)
      
      })

      chann?.on("user-game-bet-event-user" , async (msg) => {
        if(msg.user_betting_on === user_details.id) {
          stakePause()
          setDisbaleStakeButton(true)
        }
        const updatedUsers = roomUsers.map((user) => user.user_id === msg.user_betting_on ? {...user, has_staked: true} : user)
          setLobbyUsers([...updatedUsers])
      })

      chann?.on("player-did-not-staked-within-time-user" , async (msg) => {

        setGeneralPurposeMessage("Players did not staked in time. Game is invalid now")
        setGeneralPurposeTitle("Player Staking Failed")
        document.getElementById("general_purpose_modal")!.showModal()
  
        setTimeout(() => {
          
        document.getElementById("general_purpose_modal")!.close()
          navigate("/home")
      } , 2000)


      })


      chann?.on("send-user-left-event" , (data) => {
        setGeneralPurposeMessage("A Player left the lobby")
        setGeneralPurposeTitle("A Player left the lobby. Redirecting to HomeScreen")
        document.getElementById("general_purpose_modal")!.showModal()
  
        setTimeout(() => {
          
        document.getElementById("general_purpose_modal")!.close()
          navigate("/home")
      } , 2000)
      })
  

     return () => {
      chann?.off("user-left-room")
      chann?.off("new-user-joined")
      chann?.off("user-status-update")
      chann?.off("remove-all-users")
      chann?.off("verifying-game")
      chann?.off("start-game-for-all")
      chann?.off("error-event-occured")
      chann?.off("player-staking-available-user")
      chann?.off("player-stake-complete-user")
      chann?.off("user-game-bet-event-user")
      chann?.off("player-did-not-staked-within-time-user")
      chann?.off("send-user-left-event")
     }
  })


  // isSpecator Events Listen
  useEffect(() => {
    if (!gameStore.isSpectator)
      return;


      spectatorChannel?.on("user-joined-room" , (payload ) => {

        gameStore.updatePlayerTurnModel({count_id: 2 , user_id: payload.user_id, username: payload.username })

        let new_user: UserGameRelation = {
          user_id: payload.user_id,
          username: payload.username,
          game_id: payload.game_id,
          player_type: "player",
          player_status: 'not-ready',
          has_staked: false
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

      spectatorChannel?.on("some-user-left" , (payload) => {

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



      spectatorChannel?.on("start-game-for-spectators" , (msg) => {
        //document.getElementById("general_purpose_modal")!.close()

          console.log("Start game for all event recieved. The data is")
          console.log(msg)
        navigate("/chess/" + msg.game_id  + "/" + msg.admin_id)
      })


      spectatorChannel?.on("remove-all-users-for-spectators" , (msg) => {
        setGeneralPurposeMessage("Host Left the Lobby")
        setGeneralPurposeTitle("Host Left the Lobby. Redirecting to HomeScreen")
        document.getElementById("general_purpose_modal")!.showModal()
  
        setTimeout(() => {
          spectatorChannel.leave()
          setSpectatorChannel(null)
        document.getElementById("general_purpose_modal")!.close()
          navigate("/home")
      } , 2000)
       })

      

       spectatorChannel?.on("user-game-bet-spectator-event" , async (msg) => {
        const updatedUsers = roomUsers.map((user) => user.user_id === msg.user_betting_on ? {...user, has_staked: true} : user)
          setLobbyUsers([...updatedUsers])
      })


      
      spectatorChannel?.on("player-did-not-staked-within-time-spectator" , async (msg) => {

        setGeneralPurposeMessage("Players did not staked in time. Game is invalid now")
        setGeneralPurposeTitle("Player Staking Failed")
        document.getElementById("general_purpose_modal")!.showModal()
  
        setTimeout(() => {
          
        document.getElementById("general_purpose_modal")!.close()
          navigate("/home")
      } , 2000)


      })


      spectatorChannel?.on("send-spectator-left-event" , (data) => {
        setGeneralPurposeMessage("A Player left the lobby")
        setGeneralPurposeTitle("A Player left the lobby. Redirecting to HomeScreen")
        document.getElementById("general_purpose_modal")!.showModal()
  
        setTimeout(() => {
          
        document.getElementById("general_purpose_modal")!.close()
          navigate("/home")
      } , 2000)
      })
  

      return () => {
        spectatorChannel?.off("user-joined-room")
        spectatorChannel?.off("some-user-left")
        spectatorChannel?.off("user-status-event")
      //  spectatorChannel?.off("game-general-event")
        spectatorChannel?.off("start-game-for-spectators")
        spectatorChannel?.off("remove-all-users-for-spectators")
        spectatorChannel?.off("verifying-game-for-spectators")
        spectatorChannel?.off("user-game-bet-spectator-event")
        spectatorChannel?.off("player-did-not-staked-within-time-spectator")
        spectatorChannel?.off("send-spectator-left-event")
      }
   
    
  })




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
        <img src={ChessLogo} alt="chess" />
      </div>

      {isAlert ? <div className='my-3'>
        {alertType === "success" ? <SuccessAlert message={alertMessage}/> : <ErrorAlert message={alertMessage} />}
      </div> : <div></div>}

      {
        roomUsers.length === 0 ? <div>No Users Found. Invalid Lobby</div> :     <div className='mt-4 p-5 flex flex-row space-x-5'>
        {
          roomUsers.map((val , idx) => (
          <div key={idx} className="card w-30 bg-base-100 shadow-xl">
            <figure className="self-center avatar w-30 rounded-full ring ring-black ring-offset-base-100 ring-offset-2 mt-5">
            <img src={`https://robohash.org/${val.username}`} alt={`${val.username}`}/>
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">{val.username}</h2>
              {val.user_id === host_user_id ? <h3 className="">(Host)</h3> : <div></div>}
              {val.player_status === "ready" ? <h3 className='text-green-700'>Ready!</h3> : <h3 className='text-red-700'>Not Ready</h3>}
              {gameStore.game_type === "staked" ? val.has_staked ? <h3 className='text-green-700'>Staked!</h3> : <h3 className='text-red-700'>Not Staked</h3>  : <></>}
            </div>
          </div>
          ))
        }
      </div>
      }

  {
    gameStore.isSpectator ? <></> :      <div className='mt-3 self-center'>
    {user_details.id === host_user_id ?  <button className="btn btn-outline btn-success mr-1" disabled={false} onClick={startTheGame}>Start the Game</button> : <div></div>}
   { updateStatusRequestSent ?  <span className="loading loading-spinner loading-md mr-1 ml-1"></span> :
        !readyState ?        <button className="btn btn-outline btn-success mr-1 ml-1" onClick={() => updatePlayerStatus("ready")} disabled={disableUpdateStatusButton}>Ready! <><span>{minutes}</span>:{seconds === 0?<span>00</span>:<span>{seconds}</span>} </> </button>  : <button className="btn btn-outline btn-error mr-1 ml-1" onClick={() => updatePlayerStatus("not-ready")} disabled={disableUpdateStatusButton}>Not Ready</button> }
   
   {gameStore.game_type === "staked" ?   <button className="btn btn-outline btn-success mr-1" disabled={disbaleStakeButton} onClick={() => document.getElementById("stake_money_modal")!.showModal()}>Stake in the game <> <span className='ml-2'>{stakeMinutes}</span>: {stakeSeconds < 10 ? <span>0:{stakeSeconds}</span> :  <span>{stakeSeconds}</span>} </></button> : <></>}
    <button className="btn btn-outline btn-info mr-1 ml-1" onClick={() => document.getElementById("online_friend_invite_modal")!.showModal()} disabled={disableInviteFriendsButton}>Invite Friends</button>
     <button className="btn btn-outline btn-error ml-1" onClick={leaveLobby} disabled={disableLeaveLobbyButton}>Leave Lobby</button>
     </div>
  }
  </div>
    }

    <OnlineFriendInviteModal/>
<LeaveSpectateRoomModal game_id={game_id!}/>
<StakeMoneyModal is_replay={false} is_match={false}/>
    <GeneralPurposeModal message={generalPurposeMessage} title={generalPurposeTitle} />
    </>
  )
}

export default LobbyScreen