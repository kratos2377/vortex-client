import React, { useContext, useEffect, useState } from 'react'
import { useTimer } from 'react-timer-hook'
import { useNavigate } from 'react-router-dom'


interface DefaultUserWinModalProps {
    user_id_who_left: string,
    user_username_who_left: string,
    user_id_who_won: string,
    user_username_who_won: string,
    game_id: string,
    user_id: string,
}

const DefaultUserWinModal: React.FC<DefaultUserWinModalProps> = ({ user_id_who_left , user_username_who_left , user_id_who_won , user_username_who_won,  game_id , user_id}) => {

      const navigator = useNavigate()
          const currentTime = new Date();
          currentTime.setTime(currentTime.getSeconds() + 30)
          const [time , setTime] = useState(currentTime)
    
          const {
            totalSeconds,
            seconds,
            restart: timeRestart
          } = useTimer({ autoStart: true , expiryTimestamp: time , onExpire: () => {
            //Remove Circular clock screen
           // replayMatchAgainCall()
          } });
  

    useEffect(() => {
      const new_time = new Date()
      new_time.setTime(new_time.getSeconds() + 20)
      timeRestart(new_time)
    } , [])


  return (
     <>
       <dialog id="default_user_win_modal" className="modal modal-bottom sm:modal-middle">
   <div className="modal-box">
   <h2>{user_username_who_won} won!</h2>
  
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


          <div className='mt-2'>
                It looks like {user_username_who_left} got disconnected/left. If the game was staked all the spectators will be given their money back if they placed a bet.
                The winner will get the original staked amount.
          </div>


          <button type="submit" className="btn btn-outline btn-success" onClick={() => {
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