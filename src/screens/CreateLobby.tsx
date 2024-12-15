import React, { useState } from 'react'
import { ErrorAlert, SuccessAlert } from '../components/ui/AlertMessage';
import { useGameStore, useUserStore } from '../state/UserAndGameState';
import { getUserTokenFromStore } from '../persistent_storage/save_user_details';
import { create_lobby_call } from '../helper_functions/apiCall';
import { useNavigate } from 'react-router-dom';



const CreateLobby = ( { setCurrentScreen } : { setCurrentScreen:  React.Dispatch<React.SetStateAction<string>> }) => {

  const navigate = useNavigate()
  const [isOpen , setIsOpen] = useState(true)
  const [selectedGame, setSelectedGame] = useState('chess');
  const [selectedType, setSelectedType] = useState('');
  const [isAlert, setIsAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState<"success" | "error">("success")
  const [requestSent, setRequestSent] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const {user_details} = useUserStore()
  const {updateGameId, updateGameName, updateGameType , updateUserPlayerCountId , updateIsSpectator} = useGameStore()
  const handleGameChange = (event: any) => {
    setSelectedGame(event.target.value);
  };

  const handleTypeChange = (event: any) => {
    setSelectedType(event.target.value);
  };

  const handleCreateGame = async () => {

    if(selectedGame.length === 0 || selectedType.length===0) {
      setAlertMessage("Game or Type not selected. Please select game and type")
      setAlertType("error")
      setIsAlert(true)
      
      setTimeout(() => {
        setIsAlert(false)
        setAlertMessage("")
        setAlertType("success")
      } , 3000)

      return 
    }

    if (selectedGame === "game-select" || selectedType === "type-select") {
      setAlertMessage("Game or Type not selected. Please select game and type")
      setAlertType("error")
      setIsAlert(true)
      
      setTimeout(() => {
        setIsAlert(false)
        setAlertMessage("")
        setAlertType("success")
      } , 3000)

      return 
    }

    setRequestSent(true)
    let payload = JSON.stringify({ user_id: user_details.id , game_type: selectedType , game_name: selectedGame, username: user_details.username })
    let token = await getUserTokenFromStore()

    let val = await create_lobby_call(payload , token)

    if (!val.status) {
      setAlertMessage(val.error_message)
      setAlertType("error")
      setIsAlert(true)
      setRequestSent(false)
      setTimeout(() => {
        setIsAlert(false)
        setAlertMessage("")
        setAlertType("success")
      } , 3000)

    } else {
      updateIsSpectator(false)
      updateGameId(val.game_id)
      updateGameName(selectedGame)
      updateGameType(selectedType)
      updateUserPlayerCountId("1")
      setRedirecting(true)
      setAlertMessage("Redirecting to Lobby Screen")
      setAlertType("success")
      setIsAlert(true)
      setRequestSent(false)
      setTimeout(() => {
        setIsAlert(false)
        setAlertMessage("")
        setAlertType("success")
        navigate("/lobby/" + val.game_id + "/" +  selectedGame + "/" + user_details.id)
      } , 1000)
    }

  

  }

  return (

    
    <>
    {isOpen && (
      <div className="fixed inset-0 flex items-center justify-center self-center z-50">
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
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">Choose a type:</label>
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
              onClick={handleCreateGame}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create Game
            </button>
          </div>
          </div> }
        </div>
      </div>
    )}
  </>
  )
}

export default CreateLobby