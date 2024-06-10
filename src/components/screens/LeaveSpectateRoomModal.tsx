import React, { useState } from 'react'
import { ErrorAlert, SuccessAlert } from '../ui/AlertMessage'


const LeaveSpectateRoomModal = () => {

    const [requestSent, setRequestSent] = useState(false)
    
    //Alert states
    const [isAlert, setIsAlert] = useState(false)
    const [alertType, setAlertType] = useState<"success" | "error">("success")
    const [alertMessage, setAlertMessage] = useState("")

  return (
    <>
    <dialog id="leave_spectate_modal" className="modal modal-bottom sm:modal-middle">
<div className="modal-box">
<h3>Leave Spectate Room</h3>
{isAlert ? alertType==="success" ? <SuccessAlert message={alertMessage} /> : <ErrorAlert message={alertMessage} /> : <div></div>}
{
  requestSent ? <span className="loading loading-dots loading-lg"></span> :     
  <div className="modal-action">
    <div className='flex flex-row justify-end mt-2'>
     <button type="submit" className="btn btn-outline btn-error" >Leave Spectate Room</button>
    <button type="button" className="ml-2 btn btn-outline btn-success" onClick={() => document.getElementById('leave_spectate_modal')!.close()}>Close</button>
    </div>
 </div>
}
</div>
</dialog>
</>
  )
}

export default LeaveSpectateRoomModal