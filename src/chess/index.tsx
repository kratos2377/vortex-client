import React, { useEffect, useState } from 'react'
import GameInformation from './componets/UI/GameInformation'
import BoardComponent from './componets/BoardComponent'
import { useChessMainStore } from '../state/UserAndGameState'


const ChessGame = () => {

  const {restart} = useChessMainStore()

  useEffect(() => {
    restart()
  } , [])
    
  return (
    <>
      <div className="App">
      <GameInformation />
      <BoardComponent />
    </div>
    </>
  )
}

export default ChessGame