import React, { useState } from 'react'
import { OngoingGameCard } from '../components/ui/HoverCards'
import ongoingGames from '../data/ongoing_games_data.json'


const OngoingGamesScreen = () => {

  const [ongoingGamesData , setOngoingGamesData] = useState([...ongoingGames])

  return (
    <div className="px-2">
      <OngoingGameCard items={ongoingGamesData} />
    </div>
  )
}

export default OngoingGamesScreen