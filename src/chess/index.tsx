import React, { useEffect, useState } from 'react'
import BoardComponent from './componets/BoardComponent'
import { useChessMainStore, useUserStore } from '../state/UserAndGameState'
import Cockpit from './componets/UI/Cockpit'
import { useParams } from 'react-router-dom'


const ChessGame = () => {

  const {restart , setGameCurrentStatus} = useChessMainStore()
  const {game_id, host_user_id} = useParams()
  const {user_details} = useUserStore()
  useEffect(() => {
    restart()
  } , [])
    
  return (
    <>
      <div className="chess_app">
      {/* <GameInformation /> */}

        <><div className='w-2/3 p-5 flex flex-row justify-center'>
              <BoardComponent game_id={game_id!} user_id={user_details.id}/>
            </div><div className='flex flex-col w-1/3 mx-10 justify-between'>
                <Cockpit />
              </div></>
    
    </div>
    </>
  )
}

export default ChessGame