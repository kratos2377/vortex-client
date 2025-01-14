import React, {useEffect, useState} from 'react'
import { ErrorAlert, SuccessAlert } from '../../../components/ui/AlertMessage'
import { invoke } from '@tauri-apps/api/tauri'
import { result } from 'lodash'
import { useGameStore, useUserStore } from '../../../state/UserAndGameState'
import { IconX } from '@tabler/icons-react'

const QRCodeModal = () => {

    const [imageSrc , setImageSrc] = useState("")
      const [isAlert , setIsAlert] = useState(false)
        const [alertMessage , setAlertMessage] = useState("")
        const [alertType , setAlertType] = useState<"success" | "error">("success")
        const [user_betting_on_id , setUserBettingOnId] = useState("")
        const [bet_type , setBetType] = useState<"win" | "lose">("win")
        const [generating_qr , setGeneratingQr] = useState(false)
        const {game_id} = useGameStore()
        const {user_details} = useUserStore()


        const generate_qr_for_bet = async () => {


            if (user_betting_on_id === "" || user_betting_on_id === "none") {
                setAlertType("error")
                setAlertMessage("No User Selected to bet on")
                setIsAlert(true)


                setTimeout(() => {
                        setIsAlert(false)
                }, 2000)

                return

            }

            setGeneratingQr(true)
            let game_room_data = {
              user_betting_on: user_betting_on_id,
              bet_type: bet_type, //win or lose
              game_id: game_id,
              user_who_is_betting: user_details.id
          }
            let res = await invoke('generate_qr_for_bet', {gameRoomData: JSON.stringify(game_room_data)})



            setImageSrc('data:image/jpeg;base64,' + res)
              
            setGeneratingQr(false)


        }


        useEffect(() => {
            generate_qr_for_bet()
        }, [bet_type , user_betting_on_id])


        const handle_user_betting_on = (event: any) => {
                setUserBettingOnId(event.target.value)
        }

        
        const handle_bet_type = (event: any) => {
            setBetType(event.target.value)
    }

  return (
  <>
       <dialog id="qr_bet_modal" className="modal modal-bottom sm:modal-middle">
   <div className="modal-box">
 
   {isAlert ? alertType==="success" ? <SuccessAlert message={alertMessage} /> : <ErrorAlert message={alertMessage} /> : <div></div>}

    <div className='flex flex-row justify-end'>
      <button onClick={() => {
        setImageSrc("")
          document.getElementById("qr_bet_modal")!.close()
      }}>
        <IconX/>
      </button>
    </div>

    <div>

    <div className="mb-4">

        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">Choose the user to bet on:</label>
        <select
          id="type"
          name="type"
          value={user_betting_on_id}
          onChange={handle_user_betting_on}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="none">Select User</option>
          <option value="staked">Staked</option>
          <option value="normal">Normal</option>
        </select>
      </div>


      <div className="mb-4">
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">Choose Bet Type:</label>
        <select
          id="type"
          name="type"
          value={bet_type}
          onChange={handle_bet_type}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="win">Win</option>
          <option value="lose">Lose</option>
        </select>
      </div>


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

export default QRCodeModal