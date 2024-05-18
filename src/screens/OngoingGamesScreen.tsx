import React, { useEffect, useState } from 'react'
import { OngoingGameCard } from '../components/ui/HoverCards'
import ongoingGames from '../data/ongoing_games_data.json'
import ScreenLoading from '../components/ui/ScreenLoading'
import { get_ongoing_games_for_user } from '../helper_functions/apiCall'
import { useUserStore } from '../state/UserAndGameState'
import { getUserTokenFromStore } from '../persistent_storage/save_user_details'


const OngoingGamesScreen = () => {

  const [ongoingGamesData , setOngoingGamesData] = useState([])
  const [loading, setLoading] = useState(true)
  const {user_details} = useUserStore.getState()

  const get_ongoing_games = async () => {
    let user_token = await getUserTokenFromStore()
    let payload = JSON.stringify({user_id: user_details.id})
    let val = await get_ongoing_games_for_user(payload , user_token as string)

      // setOngoingGamesData([...val.games])
    setTimeout(() => {
      setLoading(false)
    }, 2000)

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