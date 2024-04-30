import React, { useEffect, useState } from 'react'
import GameInformation from './componets/UI/GameInformation'
import BoardComponent from './componets/BoardComponent'
import { useChessMainStore } from '../state/UserAndGameState'
import WrappedTimer from './componets/UI/Timer'
import { Color } from '../types/chess_types/constants'
import Cockpit from './componets/UI/Cockpit'


const ChessGame = () => {

  const {restart} = useChessMainStore()

  useEffect(() => {
    restart()
  } , [])
    
  return (
    <>
      <div className="chess_app">
      {/* <GameInformation /> */}
      <div  className='w-2/3 p-5 flex flex-row justify-center'>
      <BoardComponent />
      </div>
      <div  className='flex flex-col w-1/3 mx-10 justify-between'>
        <Cockpit/>
      </div>
    </div>
    </>
  )
}

export default ChessGame