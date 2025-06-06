import React, { useContext, useEffect, useState } from 'react'
import BoardComponent from './componets/BoardComponent'
import { useChessMainStore, useGameStore, useUserStore } from '../state/UserAndGameState'
import Cockpit from './componets/UI/Cockpit'
import { useNavigate, useParams } from 'react-router-dom'
import GameInformation from './componets/UI/GameInformation'
import useBoardStore from '../state/chess_store/board'
import { GAME_GENERAL_EVENT, MQTT_GAME_EVENTS } from '../utils/mqtt_event_names'
import { invoke } from '@tauri-apps/api/tauri'
import { listen } from '@tauri-apps/api/event'
import { MQTTPayload } from '../types/models'
import GeneralPurposeModal from '../components/screens/GeneralPurposeModal'
import { IconLogout, IconQrcode } from '@tabler/icons-react'
import { WebSocketContext } from '../socket/websocket_provider'
import QRCodeModal from './componets/UI/QRCodeModal'
import LeaveSpectateRoomModal from '../components/screens/LeaveSpectateRoomModal'
import { Color } from './models/Piece/types'
import PlayersInfoCockPit from './componets/UI/PlayersInfoCockpit'


const ChessGame = () => {

  const {chann , spectatorChannel} = useContext(WebSocketContext)

  const [generalPurposeMessage, setGeneralPurposeMessage] = useState("")
  const [generalPurposeTitle, setGeneralPurposeTitle] = useState("")
  const navigate = useNavigate()
  const {restart , setGameCurrentStatus , currentTurn} = useChessMainStore()
  const [loading, setLoading] = useState(true)
  const gameStore = useGameStore()
  const {game_id} = useParams()

  const {user_details} = useUserStore()


  // Player Events
  useEffect(() => {
   
    if(gameStore.isSpectator)
      return;

    chann?.on(GAME_GENERAL_EVENT , async (msg) => {

      console.log("General game event recieved")
      console.log(msg)

      if(msg.message ===  "host-left") {
            setGeneralPurposeMessage("Host Left. Redirecting to home screen")
            setGeneralPurposeTitle("Redirecting")
            document.getElementById("general_purpose_modal")!.showModal()
          let payload = JSON.stringify({topic_name: MQTT_GAME_EVENTS + game_id});
          await invoke('unsubscribe_to_game_topic', {payload:  payload})
        setTimeout(() => {
          
          document.getElementById("general_purpose_modal")!.close()
          navigate("/home")
        }, 1000)
      }

    })


    return () => {
      chann?.off(GAME_GENERAL_EVENT)
    }

  })

  // Spectator events
  useEffect(() => {

    if(!gameStore.isSpectator)
      return;


    spectatorChannel?.on(GAME_GENERAL_EVENT , async (msg) => {

      if(msg.message ===  "host-left") {
        setGeneralPurposeMessage("Host Left. Redirecting to home screen")
        setGeneralPurposeTitle("Redirecting")
        document.getElementById("general_purpose_modal")!.showModal()
      // let payload = JSON.stringify({topic_name: MQTT_GAME_EVENTS + game_id});
      // await invoke('unsubscribe_to_game_topic', {payload:  payload})
    setTimeout(() => {
      
      document.getElementById("general_purpose_modal")!.close()
      navigate("/home")
    }, 1000)
  }



    })


    return () => {
      spectatorChannel?.off(GAME_GENERAL_EVENT)
    }

  })




  useEffect(() => {
    if (!gameStore.isSpectator) {
    restart()
    }
    setGameCurrentStatus("IN-PROGRESS")
    setLoading(false)
  } , [])


    
  return (
    <>
    {
      loading ? <div className='h-screen w-screen flex justify-center'>
        <span className="loading loading-dots loading-lg"></span>
      </div> :    <div className="chess_app">

      <div className="absolute top-8">
          {currentTurn === Color.WHITE ? "White's Turn" : "Black's Turn"}
        </div>

      {/* <GameInformation /> */}

        <>
        
        {
                gameStore.isSpectator ?         <div className='absolute top-5 left-5'>
                <button className='justify-start' onClick={() => 

      document.getElementById("leave_spectate_modal")!.showModal()

        }>
        <IconLogout />
        </button>
        </div> : <></>
        }
        
        
        <div className='w-[100vh] p-2 flex flex-row justify-center'>
        <GameInformation />

          <PlayersInfoCockPit/>
              <BoardComponent game_id={game_id!} user_id={user_details.id}/>
    
      
            <Cockpit />

            </div>
        </>



        {
                gameStore.isSpectator && gameStore.game_type === "staked" ?         <div className='absolute top-5 right-5'>
                <button className='justify-start' onClick={() => 

        document.getElementById("qr_bet_modal")!.showModal()

        }>
        <IconQrcode/>
        </button>
        </div> : <></>
        }

    
              <GeneralPurposeModal message={generalPurposeMessage} title={generalPurposeTitle}/>


          

          <QRCodeModal/>

          <LeaveSpectateRoomModal game_id={gameStore.game_id}/>
    </div>
    }
    </>
  )
}

export default ChessGame