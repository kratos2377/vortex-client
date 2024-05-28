import React, { useState } from 'react'
import { GlowingStarsBackgroundCard, GlowingStarsTitle, GlowingStarsDescription } from '../components/backgrounds/glowing-stars'
import { useNavigate, useParams } from 'react-router-dom'
import { useUserStore } from '../state/UserAndGameState'
import { getUserTokenFromStore } from '../persistent_storage/save_user_details'
import { remove_game_models_call } from '../helper_functions/apiCall'

const InvalidLobbyScreen = () => {
    const navigate = useNavigate()
    let {game_id , game_name , host_user_id} = useParams()
    const {user_details} = useUserStore()

    const [requestSent , setRequestSent] = useState(false)
    const sendRemoveModelRequest = async () => {
        let user_token = await getUserTokenFromStore()
        let payload = JSON.stringify({game_id: game_id, game_name: game_name , host_user_id: host_user_id , user_id: user_details.id})
            await remove_game_models_call(payload , user_token)
    }
  return (
    <div className="flex py-20 items-center justify-center antialiased">
    <GlowingStarsBackgroundCard>
      <GlowingStarsTitle>Invalid Lobby</GlowingStarsTitle>
      <div className="flex flex-col justify-between items-end">
        <GlowingStarsDescription>
         Either the Lobby was deleted or the invite has expired.
        </GlowingStarsDescription>
        <div className="h-8 w-8 mt-3 rounded-full bg-[hsla(0,0%,100%,.1)] flex items-center justify-center">
        {
            requestSent ? <span className="loading loading-spinner loading-lg text-white"></span> :         <button className="btn btn-outline btn-success" onClick={() => {

                setRequestSent(false)
                sendRemoveModelRequest();
                setTimeout(() => {
                    navigate("/home")
                }, 1000)
            }}>Navigate to HomeScreen</button>
        }
        </div>
      </div>
    </GlowingStarsBackgroundCard>
  </div>
  )
}

export default InvalidLobbyScreen