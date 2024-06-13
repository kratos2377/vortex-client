import { IconDotsCircleHorizontal, IconLogout, IconPokerChip } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import Iframe from 'react-iframe'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import StakeMoneyModal from '../components/screens/StakeMoneyModal'
import LeaveSpectateRoomModal from '../components/screens/LeaveSpectateRoomModal'
import { useGameStore, useUserStore } from '../state/UserAndGameState'
import { GAME_GENERAL_EVENT, MQTT_GAME_EVENTS } from '../utils/mqtt_event_names'
import { listen } from '@tauri-apps/api/event'
import { MQTTPayload } from '../types/models'
import GeneralPurposeModal from '../components/screens/GeneralPurposeModal'
import { invoke } from '@tauri-apps/api/tauri'
const SpectatorScreen = () => {
  const base_url = "http://localhost:1420/"
  const { game_id , game_name, host_user_id} = useParams()
  const {state} = useLocation();
  const {game_model} = state
  const navigate = useNavigate()
  const [loading , setLoading] = useState(true)
  const [iframe_url, setIframeUrl] = useState(base_url + "lobby/" + game_id + "/" +  game_name + "/" + host_user_id)
  const [generalTitle , setGeneralTitle] = useState("")
  const [generalMessage , setGeneralMessage] = useState("")
  const gameStore = useGameStore()


  const startListeningToGameEvents = async () => {
    console.log("STARTED LISTENING TO GAME GENERAL EVENTS")
    await  listen<MQTTPayload>(GAME_GENERAL_EVENT, async (event) => {
      let parsed_payload = JSON.parse(event.payload.message)
      if (parsed_payload.message === "start-game") {
        setLoading(true)
        setIframeUrl(base_url + game_name + "/" + game_id + "/" + host_user_id)
        setLoading(false)
      } else if (parsed_payload.message === "host-left") {
        setGeneralMessage("Host Left. Redirecting to home screen")
        setGeneralTitle("Redirecting")
        document.getElementById("general_purpose_modal")!.showModal()
      let payload = JSON.stringify({topic_name: MQTT_GAME_EVENTS + game_id});
       await invoke('unsubscribe_to_game_topic', {payload:  payload})
     setTimeout(() => {
      
      document.getElementById("general_purpose_modal")!.close()
      navigate("/home")
     }, 1000)
      }
            })
  }

  useEffect(() => {

    if(game_model.name === "chess") {
      gameStore.updateChessState(game_model.current_state)
    }

    if (game_model.description === "LOBBY") {
      setIframeUrl(base_url + "lobby/" + game_id + "/" +  game_name + "/" + host_user_id)
    } else {
      setIframeUrl(base_url + game_name + "/" + game_id + "/" + host_user_id)
    }
    
    setLoading(false)
  }, [])

  const subToGameTopic = async () => {
    let payload = JSON.stringify({topic_name: MQTT_GAME_EVENTS + game_id});
    await invoke('subscribe_to_game_topic', {payload:  payload})
    console.log("SUBSCRIBED TO GAME TOPIC FROM SPECTATOR GAME")

  }

  useEffect(() => {
    if(gameStore.isSpectator) {
      subToGameTopic()
      startListeningToGameEvents()
    }
  }, [])

  return (
    <div className='h-screen w-screen fixed'>
     {
      loading ? <span className="loading loading-ring loading-lg self-center"></span> :   <div className='h-full w-full'> 
        <div className='top-4 left-4 z-500 self-center absolute flex flex-row'>
      <button onClick={() => document.getElementById("stake_money_modal")!.showModal()} >  <IconPokerChip /> </button>
      <button className='ml-2' onClick={() => document.getElementById("leave_spectate_modal")!.showModal()}  >  <IconLogout /> </button>

     </div>
     
<Iframe url={iframe_url}
      width="w-screen"
      height="h-screen"
      id={game_id}
      className="w-screen h-screen flex"/>

<StakeMoneyModal/>
<LeaveSpectateRoomModal game_id={game_id!}/>
<GeneralPurposeModal message={generalMessage} title={generalTitle} />
      </div>
     
     }
    </div>
  )
}

export default SpectatorScreen