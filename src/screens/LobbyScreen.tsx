import React from 'react'
import  ChessLogo  from "../assets/chess.svg";
import  ScribbleLogo from "../assets/scribble.svg";
import lobbyUsers from '../data/lobby_users.json'

interface LobbyScreenProps {
  gameType: string,
  game_id: string,
  host_user_id: string
}

const LobbyScreen = ({  gameType , game_id , host_user_id}: LobbyScreenProps) => {

  //const {currentLobbyUsers} = use

  return (
    <div className='h-full w-full flex flex-col'>
        <div className='h-1/5 w-2/12 p-5 self-center'>
          {gameType === "chess" ? <img src={ChessLogo} alt="chess" />: <img src={ScribbleLogo} alt="scribble" />}
        </div>

        <div className='p-3 grid grid-cols-5 gap-4'>
          {
            lobbyUsers.map((val , idx) => (
            <div className="card w-50 bg-base-100 shadow-xl">
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