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
import { update_player_status } from '../helper_functions/apiCall';

const MatchScreen = () => {

  const {setChannel, chann , spectatorChannel , setSpectatorChannel} = useContext(WebSocketContext)
  const navigate = useNavigate()
  let {game_id , gameType , host_user_id} = useParams()
  let {user_details} = useUserStore()
  let gameStore = useGameStore()
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


  // User Player Events
  useEffect(() => {

    if(gameStore.isSpectator)
      return;

  } , [])


  //User Spectator Events
  useEffect(() => {

  } , [])


    const updatePlayerStatus = async (status: string) => {
      setUpdateRequestSent(true)
      let user_token = await getUserTokenFromStore()
      let payload = JSON.stringify({game_id: game_id, user_id: user_details.id, game_name: gameStore.game_name, status: status   })
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
      }
  
      setUpdateRequestSent(false)
    }



  return (
    <>

    {
      lobbyRequestSent ? <div className='h-full w-full flex flex-col justify-center self-center'> <span className="loading loading-ring loading-lg"></span></div>: <div className='h-screen w-screen flex flex-col relative'>

        {
          gameStore.isSpectator ?    <div className='top-4 left-4 z-500 self-center absolute flex flex-row'>
          <button onClick={() => document.getElementById("stake_money_modal")!.showModal()} >  <IconPokerChip /> </button>
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
              {val.user_id === host_user_id ? <h3 className="">(Host)</h3> : <div></div>}
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
        !readyState ?        <button className="btn btn-outline btn-success mr-1 ml-1" onClick={() => updatePlayerStatus("ready")} disabled={disableButton}>Ready!</button> :        <button className="btn btn-outline btn-error mr-1 ml-1" onClick={() => updatePlayerStatus("not-ready")} disabled={disableButton}>Not Ready</button> }

     </div>
  }
  </div>
    }

    <StakeMoneyModal/>
<LeaveSpectateRoomModal game_id={game_id!}/>
    <GeneralPurposeModal message={generalPurposeMessage} title={generalPurposeTitle} />
    </>
  )
}

export default MatchScreen