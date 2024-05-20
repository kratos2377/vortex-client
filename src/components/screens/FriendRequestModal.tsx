import React, { useState } from 'react'
import { useUserStore } from '../../state/UserAndGameState'
import FriendRequestsScroll from '../ui/FriendRequestsScroll'


interface FriendReqModalProps {
  setFriendReqCount: React.Dispatch<React.SetStateAction<number>>
}

const FriendRequestModal = ({setFriendReqCount}: FriendReqModalProps) => {

    const [requestSent, setRequestSent] = useState(false)
    const [username , setUsername] = useState("")

    //Alert states
    const [isAlert , setIsAlert] = useState(false)
    const [alertType , setAlertType] = useState<"success" | "error">("success")
    const [alertMessage, setAlertMessage] = useState("")
    const {user_details} = useUserStore()

    const handleUsernameChange = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      setRequestSent(true)
        setTimeout(() => {
            setRequestSent(false)
            document.getElementById('friend_requests_modal')!.close();
        } , 3000)
    }

    const handleValueChanges = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {id , value} = event.target
        if (id === "username") {
            setUsername(value)
        }
      }

  return (
    <div className='h-[60vh]'>
    <dialog id="friend_requests_modal" className="h-full w-full modal modal-bottom sm:modal-middle">
<div className="modal-box">
<div className='text-bold text-2xl'>Friend Requests</div>
{
  requestSent ? <span className="loading loading-dots loading-lg"></span> :     
  <div className='flex flex-col justify-end mt-1'>
    <div className='my-1'> 

    <FriendRequestsScroll  setFriendReqCount={setFriendReqCount}/>

    </div>
  <button type="button" className="btn btn-outline btn-error" onClick={() => document.getElementById('friend_requests_modal')!.close()}>Close</button>
  </div>
}
</div>
</dialog>
</div>
  )
}



export default FriendRequestModal