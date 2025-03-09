import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { WebSocketContext } from '../../../socket/websocket_provider'


interface DefaultUserWinModalProps {
    user_id_who_left: string,
    user_username_who_left: string,
    user_id_who_won: string,
    user_username_who_won: string,
    game_id: string,
    user_id: string,
}

const DefaultUserWinModal: React.FC<DefaultUserWinModalProps> = ({ user_id_who_left , user_username_who_left , user_id_who_won , user_username_who_won,  game_id , user_id}) => {

    const {setChannel , setSpectatorChannel , chann , spectatorChannel} = useContext(WebSocketContext)
      const navigator = useNavigate()
          const currentTime = new Date();
          currentTime.setTime(currentTime.getSeconds() + 30)
          const [time , setTime] = useState(currentTime)
    


  return (
     <>
       <dialog id="default_user_win_modal" className="modal modal-bottom sm:modal-middle">
   <div className="modal-box">
   <h2>{user_username_who_won} won!</h2>
  
    <div className='flex flex-col space-x-2 h-1/2 justify-center mt-1'>


      <div className='flex flex-row space-x-2 h-1/2 justify-center mt-1'>
      <div key={"winner-card-" + Math.floor(Math.random() * 1000)}  className="card w-30 bg-base-90 shadow-xl">
            <div>Won</div>
            <figure className="self-center avatar w-20 rounded-full ring ring-black ring-offset-base-100 ring-offset-2 mt-5">
            <img src={`https://robohash.org/${user_username_who_won}`} alt={`${user_username_who_won}`}/>
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">{user_username_who_won}</h2>
            </div>
          </div>


          <div key={"loser-card-" + Math.floor(Math.random() * 1000)}  className="card w-30 bg-base-90 shadow-xl">
            <div>Lost </div>
            <figure className="self-center avatar w-20 rounded-full ring ring-black ring-offset-base-100 ring-offset-2 mt-5">
            <img src={`https://robohash.org/${user_username_who_left}`} alt={`${user_username_who_left}`}/>
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">{user_username_who_left}</h2>
            </div>
          </div>
      </div>


          <div className='my-3 mx-1'>
                It looks like {user_username_who_left} got disconnected/left. If the game was staked all the spectators will be given their money back if they placed a bet.
                The winner will get the original staked amount.
          </div>


          <button type="submit" className="btn btn-outline btn-success" onClick={() => {
            if(chann !== undefined && chann !== null) {
              chann.leave()
              setChannel(null)
            } 

            if(spectatorChannel !== undefined && spectatorChannel !== null) {
              spectatorChannel.leave()
            setSpectatorChannel(null)
            }
          
            document.getElementById("default_user_win_modal")!.close()
            navigator("/home")
          }} >Redirect to HomeScreen</button>


    </div>

   </div>
   </dialog>
   </>
  )
}

export default DefaultUserWinModal