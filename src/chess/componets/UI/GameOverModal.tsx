import React, { useContext, useEffect, useState } from 'react'
import { ErrorAlert, SuccessAlert } from '../../../components/ui/AlertMessage'
import { WebSocketContext } from '../../../socket/websocket_provider'
import { replay_game } from '../../../helper_functions/apiCall'
import { getUserTokenFromStore } from '../../../persistent_storage/save_user_details'
import { useTimer } from 'react-timer-hook'
import { useChessMainStore, useGameStore } from '../../../state/UserAndGameState'
import useChessGameStore from '../../../state/chess_store/game'
import { useNavigate } from 'react-router-dom'
import { Color } from '../../models/Piece/types'
import StakeMoneyModal from '../../../components/screens/StakeMoneyModal'


interface GameOverModalProps {
    winner_username: string,
    winner_user_id: string,
    loser_username: string,
    loser_user_id: string,
    game_id: string,
    user_id: string,
}

const GameOverModal: React.FC<GameOverModalProps> = ({ winner_username , winner_user_id , loser_username , loser_user_id , game_id , user_id}) => {

    const {chann , spectatorChannel , setChannel , setSpectatorChannel} = useContext(WebSocketContext)

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

    const [isAlert , setIsAlert] = useState(false)
    const [alertMessage , setAlertMessage] = useState("")
    const gameStore = useGameStore()
    const {restart , setGameCurrentStatus , setCurrentTurn} = useChessMainStore()
    const [alertType , setAlertType] = useState<"success" | "error">("success")
    const [requestSent , setRequestSent] = useState(false)
    const [lost_user_replay , setLostUserReplay] = useState(false)
    const [won_user_replay , setWonUserReplay] = useState(false)
    const [replay_req_success , setReplayReqSuccess] = useState(false)
    const [leave_req_sent , setLeaveReqSent] = useState(false)
    const [stakingAvailable , setStakingAvailable] = useState(false)
    const [won_user_staked , setWonUserStaked] = useState(false)
    const [lost_player_staked , setLostPlayerStaked] = useState(false)
    

    const replayMatchAgainCall = async () => {

            setRequestSent(true)
            
            let token = await getUserTokenFromStore()
            let payload = JSON.stringify({user_id: user_id , game_id: game_id , status: "ready"})
            let res = await replay_game(payload ,token)


            if (!res.status) {

                setAlertMessage(res.error_message)
                setAlertType("error")
                setIsAlert(true)

                setTimeout(() => {
                        setIsAlert(false)
                } , 2000)

            } else {
                setReplayReqSuccess(true)
                setAlertMessage("Successfully Applied for Replay")
                setAlertType("success")
                setIsAlert(true)

                chann?.push("replay-req-accepted" , {user_id: user_id , game_id: game_id})

                setTimeout(() => {
                        setIsAlert(false)
                } , 2000)

            }

            setRequestSent(false)
    }



    // Player Calls
    useEffect(() => {

        if(gameStore.isSpectator)
            return;


        chann?.on("start-the-replay-match-for-users" , (msg) => {
            restart()
            setGameCurrentStatus("IN-PROGRESS")
            setCurrentTurn(Color.WHITE)
            document.getElementById('game_over_modal')!.close()
        })


        chann?.on("replay-false-event" , (msg) => {
    
          setLeaveReqSent(true)
          setAlertMessage("Redirecting to Homescreen")
          setAlertType("success")
          setIsAlert(true)
  
  
          setTimeout(() => {
            chann.leave()
            setChannel(null)
            setIsAlert(false)
            document.getElementById('game_over_modal')!.close()
            navigator("/home")
          } , 2000)

        })


        chann?.on("replay-accepted-by-user" , (data) => {
          if(loser_user_id === data.user_id) {
            setLostUserReplay(true)
          }

          if(winner_user_id === data.user_id) {
            setWonUserReplay(true)
          }
        })

        chann?.on("player-staking-available-user" , async (msg) => {
            setStakingAvailable(true)
        })

        chann?.on("player-stake-complete-user" , async (msg) => {
          setStakingAvailable(false)
          })


          chann?.on("user-game-bet-event-user" , async (msg) => {

            if (msg.user_betting_on === loser_user_id) {
              setLostPlayerStaked(true)
            } else if(msg.user_betting_on === winner_user_id) {
              setWonUserStaked(true)
            }

          })
        

        return () => {
          chann?.off("start-the-replay-match-for-users")
          chann?.off("replay-false-event")
          chann?.off("replay-accepted-by-user")
          chann?.off("player-staking-available-user")
          chann?.off("player-stake-complete-user")
          chann?.off("user-game-bet-event-user")
        }

    })


    //Spectator Calls
    useEffect(() => {


        if(!gameStore.isSpectator)
            return



        spectatorChannel?.on("start-the-replay-match-for-spectators" , (msg) => {
             restart()
             setGameCurrentStatus("IN-PROGRESS")
             setCurrentTurn(Color.WHITE)
             document.getElementById('game_over_modal')!.close()
        })


        spectatorChannel?.on("replay-false-event-for-spectators" , (msg) => {
          spectatorChannel.leave()
          setSpectatorChannel(null)
          setLeaveReqSent(true)
          setAlertMessage("Redirecting to Homescreen")
          setAlertType("success")
          setIsAlert(true)
  
  
          setTimeout(() => {
            setIsAlert(false)
            document.getElementById('game_over_modal')!.close()
            navigator("/home")
          } , 2000)

        })

        spectatorChannel?.on("replay-accepted-by-user-for-spectators" , (data) => {
          if(loser_user_id === data.user_id) {
            setLostUserReplay(true)
          }

          if(winner_user_id === data.user_id) {
            setWonUserReplay(true)
          }
        })
        

        spectatorChannel?.on("user-game-bet-spectator-event" , async (msg) => {

          if (msg.user_betting_on === loser_user_id) {
            setLostPlayerStaked(true)
          } else if(msg.user_betting_on === winner_user_id) {
            setWonUserStaked(true)
          }

        })
        


        return () => {
          spectatorChannel?.off("start-the-replay-match-for-spectators")
          spectatorChannel?.off("replay-false-event-for-spectators")
          spectatorChannel?.off("replay-accepted-by-user-for-spectators")
          spectatorChannel?.off("user-game-bet-spectator-event")
        }
    })


    useEffect(() => {
      const new_time = new Date()
      new_time.setTime(new_time.getSeconds() + 20)
      timeRestart(new_time)
    } , [])


  return (
     <>
       <dialog id="game_over_modal" className="modal modal-bottom sm:modal-middle">
   <div className="modal-box">
   <h3>{winner_username} won!</h3>
   {isAlert ? alertType==="success" ? <SuccessAlert message={alertMessage} /> : <ErrorAlert message={alertMessage} /> : <div></div>}

    <div className='flex flex-row space-x-2 h-1/2 justify-center mt-1'>


        <div key={"winner-card-" + Math.floor(Math.random() * 1000)}  className="card w-30 bg-base-90 shadow-xl">
            <div>Won</div>
            <figure className="self-center avatar w-20 rounded-full ring ring-black ring-offset-base-100 ring-offset-2 mt-5">
            <img src={`https://robohash.org/${winner_username}`} alt={`${winner_username}`}/>
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">{winner_username}</h2>
              {won_user_replay ? <h3 className='text-green-700'>Ready!</h3> : <h3 className='text-red-700'>Not Ready</h3>}

              {gameStore.game_type === "staked" ? 
              won_user_staked ? <h3 className='text-green-700'>Staked!</h3> : <h3 className='text-red-700'>Not Staked Yet</h3> : <></>}
            </div>
          </div>


          <div key={"loser-card-" + Math.floor(Math.random() * 1000)}  className="card w-30 bg-base-90 shadow-xl">
            <div>Lost </div>
            <figure className="self-center avatar w-20 rounded-full ring ring-black ring-offset-base-100 ring-offset-2 mt-5">
            <img src={`https://robohash.org/${loser_username}`} alt={`${loser_username}`}/>
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">{loser_username}</h2>
              {lost_user_replay ? <h3 className='text-green-700'>Ready!</h3> : <h3 className='text-red-700'>Not Ready</h3>}
              {gameStore.game_type === "staked" ? 
              lost_player_staked ? <h3 className='text-green-700'>Staked!</h3> : <h3 className='text-red-700'>Not Staked Yet</h3> : <></>}
            </div>
          </div>


    </div>

{
  !gameStore.isSpectator ?    
    requestSent ? <span className="loading loading-dots loading-lg"></span> :     
    <div className="modal-action">
      <div className='flex flex-row justify-end mt-2'>


     {
       gameStore.game_type === "staked" ? 
       <button type="submit" className="btn btn-outline btn-success" disabled={!stakingAvailable}
       onClick={() => 
         document.getElementById("stake_money_modal")!.showModal()
       }
       
       >Stake</button> : <></>
     }

       <button type="submit" className="btn btn-outline btn-success" onClick={replayMatchAgainCall} disabled={replay_req_success || leave_req_sent} >Replay Match  <span>{seconds}</span></button>
      <button type="button" className="ml-2 btn btn-outline btn-error" onClick={() => {
       setLeaveReqSent(true)
       chann?.push("replay-false" , {game_id: game_id , user_id: user_id})
       setAlertMessage("Redirecting to Homescreen")
       setAlertType("success")
       setIsAlert(true)


       setTimeout(() => {
        chann?.leave()
         setChannel(null)
         setIsAlert(false)
         document.getElementById('game_over_modal')!.close()
         navigator("/home")
       } , 2000)

      }}  disabled={replay_req_success || leave_req_sent}>Leave</button>
      </div>
   </div> : <></>
  
}
   </div>
   </dialog>
   <StakeMoneyModal is_replay={true}/>
   </>
  )
}

export default GameOverModal