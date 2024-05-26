import React, { useEffect, useState } from 'react'
import { OngoingGameCard } from '../components/ui/HoverCards'
import ScreenLoading from '../components/ui/ScreenLoading'
import { get_ongoing_games_for_user } from '../helper_functions/apiCall'
import { useUserStore } from '../state/UserAndGameState'
import { getUserTokenFromStore } from '../persistent_storage/save_user_details'
import { GameModel, getGameImageUrl } from '../types/models'


const OngoingGamesScreen = () => {

  const [ongoingGamesData , setOngoingGamesData] = useState<GameModel[]>([])
  const [loading, setLoading] = useState(true)
  const {user_details} = useUserStore()
  
  //Alert states
  const [isAlert, setIsAlert] = useState(false)
  const [alertType , setAlertType] = useState<"success" | "error">("success")
  const [alertMessage  , setAlertMessage] = useState("")

  const get_ongoing_games = async () => {
    let user_token = await getUserTokenFromStore()
    let payload = JSON.stringify({user_id: user_details.id})
    let val = await get_ongoing_games_for_user(payload , user_token as string)

      // setOngoingGamesData([...val.games])
    if(!val.status) {
      setAlertMessage(val.error_message)
      setAlertType("error")
      setIsAlert(true)

      setTimeout(() => {
        setIsAlert(false)
      }, 4000)
    } else {
      let games_array  = val.games.map((el: GameModel) => {
        let model: GameModel = {
          game_id: el.game_id,
          game_type: el.game_type,
          is_staked: el.is_staked,
          total_money_staked: el.total_money_staked,
          game_image_url: getGameImageUrl(el.game_type)
        }

        return model
      })

      setOngoingGamesData([...games_array])
    }
        
        setLoading(false)

  }

  useEffect(() => {

    get_ongoing_games()

  }, [])

  return (
    <div className="px-2">
      {loading ? <ScreenLoading/> :   <OngoingGameCard items={ongoingGamesData} />}
    </div>
  )
}

export default OngoingGamesScreen