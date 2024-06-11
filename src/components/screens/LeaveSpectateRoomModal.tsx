import React, { useState } from 'react'
import { ErrorAlert, SuccessAlert } from '../ui/AlertMessage'
import { MQTT_GAME_EVENTS } from '../../utils/mqtt_event_names'
import { invoke } from '@tauri-apps/api/tauri'
import { useNavigate } from 'react-router-dom'

interface LeaveSpectateRoomModalProps {
  game_id: string,
}
const LeaveSpectateRoomModal = ({game_id}: LeaveSpectateRoomModalProps) => {

    const [requestSent, setRequestSent] = useState(false)
    const navigate = useNavigate()
    //Alert states
    const [isAlert, setIsAlert] = useState(false)
    const [alertType, setAlertType] = useState<"success" | "error">("success")
    const [alertMessage, setAlertMessage] = useState("")


    const leaveTheSpectateRoom = async () => {
      setRequestSent(true)
      let payload = JSON.stringify({topic_name: MQTT_GAME_EVENTS + game_id});
      await invoke('unsubscribe_to_game_topic', {payload:  payload})

      setTimeout(() => {
        setRequestSent(false)
        navigate("/home")
      })
    }

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
     <button type="submit" className="btn btn-outline btn-error" onClick={leaveTheSpectateRoom} >Leave Spectate Room</button>
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