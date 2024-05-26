import React, { useState } from 'react'
import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/input';
import { LabelInputContainer } from '../ui/LabelInputContainer';

const RedirectingToLobbyModal = () => {



  return (
   <>
          <dialog id="redirecting_to_lobby_modal" className="modal modal-bottom sm:modal-middle">
  <div className="modal-box">
    <h3 className="py-2">Redirecting to Lobby</h3>
    <div className='mt-5 mr-3'>
    <div className='flex flex-row'> 
    Successfully Joined the Lobby
    <span className="loading loading-dots loading-lg mr-2"></span>
    </div>
    </div>
  </div>
</dialog>
   </>
  )
}



  

export default RedirectingToLobbyModal