import React, { useEffect } from 'react'
import  ChessLogo  from "../assets/chess.svg";
import  ScribbleLogo from "../assets/scribble.svg";
import lobbyUsers from '../data/lobby_users.json'
import { useParams } from 'react-router-dom';



const LobbyScreen = () => {

  //const {currentLobbyUsers} = use

  let {game_id , gameType , host_user_id} = useParams()

  useEffect(() => {
      console.log("PARAM DETAILS ARE")
      console.log(game_id)
      console.log(gameType)
      console.log(host_user_id)
  } , [])

  return (
    <div className='h-full w-full flex flex-col'>
        <div className='h-1/5 w-2/12 p-5 self-center'>
          {gameType === "chess" ? <img src={ChessLogo} alt="chess" />: <img src={ScribbleLogo} alt="scribble" />}
        </div>

        <div className='p-3 grid grid-cols-5 gap-4'>
          {
            lobbyUsers.map((val , idx) => (
            <div key={val.id} className="card w-50 bg-base-100 shadow-xl">
              <figure className="self-center avatar w-20 rounded-full ring ring-black ring-offset-base-100 ring-offset-2 mt-5">
              <img src={`https://robohash.org/${val.username}`} alt={`${val.username}`}/>
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">{val.username}</h2>
              </div>
            </div>
            ))
          }
        </div>

        <div className='mt-3 self-center'>
        <button className="btn btn-outline btn-success mr-1">Start the Game</button>
        <button className="btn btn-outline btn-error ml-1">Leave Lobby</button>
        </div>
    </div>
  )
}

export default LobbyScreen