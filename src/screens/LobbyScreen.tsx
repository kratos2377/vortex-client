import React, { useEffect, useState } from 'react'
import  ChessLogo  from "../assets/chess.svg";
import  ScribbleLogo from "../assets/scribble.svg";
import lobbyUsers from '../data/lobby_users.json'
import { useParams } from 'react-router-dom';
import { useUserStore } from '../state/UserAndGameState';



const LobbyScreen = () => {

  //const {currentLobbyUsers} = use

  let {game_id , gameType , host_user_id} = useParams()
  let {user_details} = useUserStore()

  const [readyState, setReadyState] = useState(false)
  let [roomUsers , setLobbyUsers] = useState([...lobbyUsers])

  const startTheGame = async () => {

  }

  useEffect(() => {
  
  } , [])

  return (
    <>

<div className='h-full w-full flex flex-col'>
        <div className='h-1/5 w-2/12 p-5 self-center'>
          {gameType === "chess" ? <img src={ChessLogo} alt="chess" />: <img src={ScribbleLogo} alt="scribble" />}
        </div>

        <div className='p-3 grid grid-cols-5 gap-4'>
          {
            roomUsers.map((val , idx) => (
            <div key={val.id} className="card w-50 bg-base-100 shadow-xl">
              <figure className="self-center avatar w-20 rounded-full ring ring-black ring-offset-base-100 ring-offset-2 mt-5">
              <img src={`https://robohash.org/${val.username}`} alt={`${val.username}`}/>
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">{val.username}</h2>
                {user_details.id === host_user_id ? <h3 className="">(Host)</h3> : <div></div>}
                {readyState ? <h3 className='text-green'>Ready!</h3> : <h3 className='text-red'>Not Ready</h3>}
              </div>
            </div>
            ))
          }
        </div>

        <div className='mt-3 self-center'>
       {user_details.id === host_user_id ?  <button className="btn btn-outline btn-success mr-1">Start the Game</button> : <div></div>}
     
          { !readyState ?        <button className="btn btn-outline btn-success mr-1 ml-1">Ready!</button> :        <button className="btn btn-outline btn-error mr-1 ml-1">Not Ready</button>}
       <button className="btn btn-outline btn-info mr-1 ml-1">Invite Friends</button>
        <button className="btn btn-outline btn-error ml-1">Leave Lobby</button>
        </div>
    </div>

    </>
  )
}

export default LobbyScreen