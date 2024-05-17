import React, { useState } from 'react'
import { deleteUserDetailsFromStore } from '../../persistent_storage/save_user_details'
import { exit } from '@tauri-apps/api/process';
import { useUserStore } from '../../state/UserAndGameState';

const QuitAppModal = () => {
    
    const [quitPressed, setQuitPressed] = useState(false)
    const {resetUserModelState} = useUserStore()

    const exitVortexApp = async () => {
        await exit(1);
    }

    const deleteUserDetailsAndExitApp = async () => {
      await deleteUserDetailsFromStore().then(async (msg) => {

        resetUserModelState()
    
        exitVortexApp()
       
      })
    }

  return (
    <>
    <dialog id="quit_app_modal" className="modal modal-bottom sm:modal-middle">
<div className="modal-box">
<h2>Quit App</h2>
  
  <div className="modal-action">
    <div className='flex flex-row justify-end mt-2'>
    <button type="button" className="btn btn-outline btn-success" onClick={() => document.getElementById('quit_app_modal')!.close()} disabled={quitPressed}>Close</button>

    <button type="submit" className="ml-2 btn btn-outline btn-error" onClick={async () => {
        setQuitPressed(true)
        await exitVortexApp()
     }}>Quit App</button>

     <button type="submit" className="ml-2 btn btn-outline btn-error" onClick={() => {
        setQuitPressed(true)
        deleteUserDetailsAndExitApp()
     }}>Quit App and Logout</button>
    </div>
   
 </div>

</div>
</dialog>
</>
  )
}

export default QuitAppModal