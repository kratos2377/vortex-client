import React, { useEffect, useState } from 'react'
import { LabelInputContainer } from '../ui/LabelInputContainer'
import { ErrorAlert, SuccessAlert } from '../ui/AlertMessage'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useGameStore, useUserStore } from '../../state/UserAndGameState'
import { IconX } from '@tabler/icons-react'
import { invoke } from '@tauri-apps/api/tauri'

const StakeMoneyModal = () => {
    const [requestSent, setRequestSent] = useState(false)
    
    //Alert states
    const [isAlert, setIsAlert] = useState(false)
    const [alertType, setAlertType] = useState<"success" | "error">("success")
    const [alertMessage, setAlertMessage] = useState("")
 const [imageSrc , setImageSrc] = useState("")

        const [generating_qr , setGeneratingQr] = useState(true)
            const {game_id} = useGameStore()
            const {user_details} = useUserStore()
    

            const generate_qr_for_bet = async () => {

  
              setGeneratingQr(true)
              let game_room_data = {
                user_betting_on: user_details.id,
                bet_type: "win", //win or lose // by default keeping it win for now
                game_id: game_id,
                user_who_is_betting: user_details.id,
                is_player: true
            }
              let res = await invoke('generate_qr_for_bet', {gameRoomData: JSON.stringify(game_room_data)})
  
  
  
              setImageSrc('data:image/jpeg;base64,' + res)
                
              setGeneratingQr(false)
  
  
          }
  
  
          useEffect(() => {
              generate_qr_for_bet()
          }, [])

  return (
    <>
    <dialog id="stake_money_modal" className="modal modal-bottom sm:modal-middle">
    <div className="modal-box">
 
 {isAlert ? alertType==="success" ? <SuccessAlert message={alertMessage} /> : <ErrorAlert message={alertMessage} /> : <div></div>}

  <div className='flex flex-row justify-end'>
    <button onClick={() => {
      setImageSrc("")
        document.getElementById("stake_money_modal")!.close()
    }}>
      <IconX/>
    </button>
  </div>

  <div>

      {
      generating_qr ? <span>Generating QR: <span className="loading loading-dots loading-lg"></span></span>  :    
      
      <div className='flex flex-row space-x-2 h-1/2 justify-center mt-1'>

      
            <img src={imageSrc}  />

      </div>
  }

  </div>

 </div>
</dialog>
</>
  )
}

export default StakeMoneyModal