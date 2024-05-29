import React, { useEffect, useState } from 'react'
import  ChessLogo  from "../assets/chess.svg";
import  ScribbleLogo from "../assets/scribble.svg";
import { useParams } from 'react-router-dom';
import { useGameStore, useUserStore } from '../state/UserAndGameState';
import OnlineFriendInviteModal from '../components/screens/OnlineFriendInviteModal';
import { ErrorAlert, SuccessAlert } from '../components/ui/AlertMessage';
import { getUserTokenFromStore } from '../persistent_storage/save_user_details';
import { update_player_status } from '../helper_functions/apiCall';
import { UserGameRelation } from '../types/models';



const LobbyScreen = () => {

  //const {currentLobbyUsers} = use

  let {game_id , gameType , host_user_id} = useParams()
  let {user_details} = useUserStore()
  let {game_name} = useGameStore()
  const [readyState, setReadyState] = useState(false)
  let [roomUsers , setLobbyUsers] = useState<UserGameRelation[]>([])
  const [updateStatusRequestSent, setUpdateRequestSent] = useState(false)

  // alert states
  const [isAlert , setIsAlert] = useState(false)
  const [alertType,setAlertType] = useState<"success" | "error">("success")
  const [alertMessage, setAlertMessage] = useState("")

  const startTheGame = async () => {

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
      setReadyState(!readyState)
    }

    setUpdateRequestSent(false)
  }

  useEffect(() => {
  
  } , [])

  return (
    <>

<div className='h-full w-full flex flex-col'>
        <div className='h-1/5 w-2/12 p-5 self-center'>
          {gameType === "chess" ? <img src={ChessLogo} alt="chess" />: <img src={ScribbleLogo} alt="scribble" />}
        </div>

        {isAlert ? <div className='my-3'>
          {alertType === "success" ? <SuccessAlert message={alertMessage}/> : <ErrorAlert message={alertMessage} />}
        </div> : <div></div>}

        <div className='p-3 grid grid-cols-5 gap-4'>
          {
            roomUsers.map((val , idx) => (
            <div key={val.id} className="card w-50 bg-base-100 shadow-xl">
              <figure className="self-center avatar w-20 rounded-full ring ring-black ring-offset-base-100 ring-offset-2 mt-5">
              <img src={`https://robohash.org/${val.username}`} alt={`${val.username}`}/>
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">{val.username}</h2>
                {user_details.id === host_user_id ? <h3 className="">(Host)</h3> : <div></div>}
                {readyState ? <h3 className='text-green'>Ready!</h3> : <h3 className='text-red'>Not Ready</h3>}
              </div>
            </div>
            ))
          }
        </div>

        <div className='mt-3 self-center'>
       {user_details.id === host_user_id ?  <button className="btn btn-outline btn-success mr-1">Start the Game</button> : <div></div>}
      { updateStatusRequestSent ?  <span className="loading loading-spinner loading-md mr-1 ml-1"></span> :
           !readyState ?        <button className="btn btn-outline btn-success mr-1 ml-1" onClick={() => updatePlayerStatus("ready")}>Ready!</button> :        <button className="btn btn-outline btn-error mr-1 ml-1" onClick={() => updatePlayerStatus("not-ready")}>Not Ready</button> }
       <button className="btn btn-outline btn-info mr-1 ml-1" onClick={() => document.getElementById("online_friend_invite_modal")!.showModal()}>Invite Friends</button>
        <button className="btn btn-outline btn-error ml-1">Leave Lobby</button>
        </div>
    </div>

    <OnlineFriendInviteModal/>

    </>
  )
}

export default LobbyScreen