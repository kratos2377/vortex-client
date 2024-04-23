import React, { useState } from 'react'



const CreateLobby = () => {

  const [isOpen , setIsOpen] = useState(true)
  const [selectedGame, setSelectedGame] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const handleGameChange = (event: any) => {
    setSelectedGame(event.target.value);
  };

  const handleTypeChange = (event: any) => {
    setSelectedType(event.target.value);
  };
  return (

    
    <>
    {isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="bg-white rounded-lg p-8 z-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Game Options</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mb-4">
            <label htmlFor="game" className="block text-sm font-medium text-gray-700 mb-2">Choose a game:</label>
            <select
              id="game"
              name="game"
              value={selectedGame}
              onChange={handleGameChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select</option>
              <option value="chess">Chess</option>
              <option value="poker">Poker</option>
              <option value="scribble">Scribble</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">Choose a type:</label>
            <select
              id="type"
              name="type"
              value={selectedType}
              onChange={handleTypeChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select</option>
              <option value="staked">Staked</option>
              <option value="normal">Normal</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button onClick={() => setIsOpen(false)} className="mr-2 px-4 py-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle create game logic here
               setIsOpen(false)
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create Game
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  )
}

export default CreateLobby