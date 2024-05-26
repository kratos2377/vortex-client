import React, { useState } from 'react'

const JoiningLobbyModal = () => {



  return (
   <>
          <dialog id="joining_lobby_modal" className="modal modal-bottom sm:modal-middle">
  <div className="modal-box">
    <h3 className="py-2">Request Sent to Join Lobby</h3>
    <div className='mt-5 mr-3'>
    <span className="loading loading-dots loading-lg"></span>
    </div>
  </div>
</dialog>
   </>
  )
}



  

export default JoiningLobbyModal