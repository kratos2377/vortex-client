import React, { useEffect, useState } from 'react'
import GameInformation from './componets/UI/GameInformation'
import BoardComponent from './componets/BoardComponent'
import { useChessMainStore } from '../state/UserAndGameState'
import WrappedTimer from './componets/UI/Timer'
import { ChessStates, Color } from '../types/chess_types/constants'
import Cockpit from './componets/UI/Cockpit'
import usePlayerStore from '../state/chess_store/player'


const ChessGame = () => {

  const [startGame , setStartGame] = useState(false)
  const [colorType, setColorType] = useState(Color.WHITE)
  const {restart , setGameCurrentStatus} = useChessMainStore()
  const {setCurrentPlayer} = usePlayerStore()

  useEffect(() => {
    restart()
  } , [])
    
  return (
    <>
      <div className="chess_app">
      {/* <GameInformation /> */}
      {
       !startGame ? <div> 

<button onClick={() => {
  
  setCurrentPlayer(colorType)
        setGameCurrentStatus(ChessStates.IN_PROGRESS)
        setStartGame(true)
       }}>Start the fooking game</button>

      <br/>

       <button onClick={() => setColorType(Color.WHITE)}>Set color white</button>
       <button onClick={() => setColorType(Color.BLACK)}>Set color black</button>

       </div> :  (
        <><div className='w-2/3 p-5 flex flex-row justify-center'>
              <BoardComponent />
            </div><div className='flex flex-col w-1/3 mx-10 justify-between'>
                <Cockpit />
              </div></>
       )
      }
    </div>
    </>
  )
}

export default ChessGame