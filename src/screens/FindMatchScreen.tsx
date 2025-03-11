import React, { useContext, useEffect, useState } from 'react'
import { ErrorAlert, SuccessAlert } from '../components/ui/AlertMessage'
import { create_match_making_ticket } from '../helper_functions/apiCall'
import { getUserIdFromStore, getUserTokenFromStore } from '../persistent_storage/save_user_details'
import { useGameStore, useMatchStore, useUserStore } from '../state/UserAndGameState'
import CircularClock from '../components/ui/CircularClock'
import { WebSocketContext } from '../socket/websocket_provider'
import usePlayerStore from '../state/chess_store/player'
import { Color } from '../types/chess_types/constants'
import { useNavigate } from 'react-router-dom'
import RedirectingToMatchModal from '../components/screens/RedirectingToMatchModal'
import { socket } from '../socket/socket'
import CircularClockModal from '../components/ui/CircularClockModal'

const FindMatchScreen = ({ setCurrentScreen } : { setCurrentScreen:  React.Dispatch<React.SetStateAction<string>> }) => {


  const {userChannel , setChannel} = useContext(WebSocketContext)
  const {updateGameId, updateGameName, updateGameType , updateUserPlayerCountId , updateIsSpectator , resetGameState} = useGameStore()
  const [isOpen , setIsOpen] = useState(true)
  const [isAlert , setIsAlert] = useState(false)
  const [alertType , setAlertType] = useState<"error" | "success">("success")
  const [alertMessage , setAlertMessage] = useState("")
  const [redirecting , setRedirecting] = useState(false)
  const [requestSent , setRequestSent] = useState(false)
  const [startClock , setStartClock] = useState(false)
  const [time , setTime] = useState(new Date())
  const [selectedType, setSelectedType] = useState('');
  const {user_details} = useUserStore()
  const [matchFound , setMatchFound] = useState(false)
  const {setPlayerColor} = usePlayerStore()
  const navigate = useNavigate()
  const {updateOpponentUserId , updateOpponentUsername} = useMatchStore()

  const handleTypeChange = (event: any) => {
    setSelectedType(event.target.value);
  };

  const handleCreateMatchTicket = async () => {
    resetGameState()
    setRequestSent(true)
    
    setIsAlert(false)
    const token = await getUserTokenFromStore()
    let payload = JSON.stringify({user_id: user_details.id , username: user_details.username , score: user_details.score , game_type: selectedType})
    let res = await create_match_making_ticket(payload , token)

    setRequestSent(false)

    if(!res.status) {


      setStartClock(false)
      setAlertMessage(res.error_message)
      setAlertType("error")

      setRequestSent(false)
      setIsAlert(true)

      setTimeout(() => {
        setIsAlert(false)
      }, 2000)

    } else {


      setRedirecting(true)
      setAlertMessage("Started Matchmaking")
      setAlertType("success")

      setRequestSent(false)
      setIsAlert(true)

      const new_time = new Date()
      new_time.setTime(new_time.getSeconds() + 300)
      setTime(new_time)
      setStartClock(true)
      setTimeout(() => {
       
      document.getElementById("find_a_match_circular_modal")!.showModal()
      } , 200)



      setTimeout(() => {
      setIsAlert(false)
      } , 200)

    }

  }

  useEffect(() => {


    userChannel?.on("match-found-for-users" , (msg) => {
      if(msg.index == 0) {
     setPlayerColor(Color.WHITE)
      } 

      if(msg.index == 1) {
             setPlayerColor(Color.BLACK)
      }
      document.getElementById("find_a_match_circular_modal")!.close()
      
      setStartClock(false)
      setMatchFound(true)

     setTimeout(() => {
      document.getElementById("redirecting_to_match_modal")!.showModal()
     } , 100)
      
    })

    userChannel?.on("match-found-detail-for-users" , (msg) => {
        
      if(msg.index == 0) {
        setPlayerColor(Color.WHITE)
         } 
   
         if(msg.index == 1) {
                setPlayerColor(Color.BLACK)
         }


         updateOpponentUserId(msg.opponent_details.user_id)
         updateOpponentUsername(msg.opponent_details.username)
    
   
         let chann_new = socket.channel("game:chess:" + msg.game_id , {})
   
         chann_new.join().receive("ok" , () => {
   
          setChannel(chann_new)
   
          updateIsSpectator(false)
          updateGameId(msg.game_id)
          updateGameName("chess")
          //will update this accordingly
          updateGameType(msg.game_type)
          updateUserPlayerCountId(msg.index + 1)
          
         setTimeout(() => {
          document.getElementById("redirecting_to_match_modal")!.close()
          setMatchFound(false)
   
          navigate("/match/" + msg.game_id + "/chess")
         } , 200)
   
         }).receive("error" , () => {
   
   
          setAlertMessage("Error While connection to Game Channel")
          setAlertType("error")
          setIsAlert(false)
   
          document.getElementById("redirecting_to_match_modal")!.close()
          setMatchFound(false)
   
          setTimeout(() => {
            setIsAlert(false)
          } , 200)
   
   
         })

       

    })


    userChannel?.on("match-game-error-for-users" , (msg) => {

      setAlertType("error")
      setAlertMessage("Some Error Occured While making the game model for the match")
      setIsAlert(true)

      setTimeout(() => {
        setIsAlert(false)
        setCurrentScreen("ongoing-games")
      } , 3000)
    })





    return () => {
      userChannel?.off("match-found-for-users")
      userChannel?.off("match-found-detail-for-users")
      userChannel?.off("match-game-error-for-users")
    }

  })


  return (
      <>
      
   {startClock ? <div className='flex flex-col justify-center align-center items-center'>
       
<CircularClockModal setCircularClock={setStartClock} setCurrentScreen={setCurrentScreen}/>

    </div> :       <div className="fixed inset-0 flex items-center justify-center self-center z-50">
    <RedirectingToMatchModal/> 
    <div className="absolute inset-0 bg-black opacity-50"></div>
    <div className="bg-white rounded-lg p-8 z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Game Options</h2>
      
        <button onClick={() => {
          setIsOpen(false)
          setCurrentScreen("ongoing-games")
        }} className="text-gray-500 hover:text-gray-700 focus:outline-none" disabled={requestSent || redirecting} >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {isAlert ? alertType === "success" ? <SuccessAlert message={alertMessage} /> : <ErrorAlert message={alertMessage}/> : <div></div>}
      { requestSent ? <span className="loading loading-dots loading-lg"></span> : <div className='mt-2'> 

      <div className="mb-4">
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">Choose Match type:</label>
        <select
          id="type"
          name="type"
          value={selectedType}
          onChange={handleTypeChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="type-select">Select</option>
          <option value="staked">Staked</option>
          <option value="normal">Normal</option>
        </select>
      </div>
      <div className="flex justify-end">
        <button    disabled={requestSent || redirecting} onClick={() => {
          setIsOpen(false)
          setCurrentScreen("ongoing-games")
          }} className="mr-2 px-4 py-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
          Cancel
        </button>
        <button
        disabled={requestSent || redirecting}
          onClick={handleCreateMatchTicket}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Find Match
        </button>
      </div>
      </div> }
    </div>
  </div>
   }
      
      </>
  )
}

export default FindMatchScreen
