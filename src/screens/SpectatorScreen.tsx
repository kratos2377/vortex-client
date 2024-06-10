import { IconDotsCircleHorizontal, IconLogout, IconPokerChip } from '@tabler/icons-react'
import React from 'react'
import Iframe from 'react-iframe'
import { useParams } from 'react-router-dom'
import StakeMoneyModal from '../components/screens/StakeMoneyModal'
import LeaveSpectateRoomModal from '../components/screens/LeaveSpectateRoomModal'
const SpectatorScreen = () => {
  const { game_id , game_name, host_user_id} = useParams()
  console.log("VALUES ARE")
  console.log(game_id)
  console.log(game_name)
  console.log(host_user_id)
  const iframe_url = "http://localhost:1420/" + game_name + "/" + game_id + "/" + host_user_id

  console.log("IFRAME URL IS")
  console.log(iframe_url)
  return (
    <div className='h-screen w-screen fixed'>
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
  <LeaveSpectateRoomModal/>
       
    </div>
  )
}

export default SpectatorScreen