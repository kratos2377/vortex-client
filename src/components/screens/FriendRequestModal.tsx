import React, { useState } from 'react'
import { cn } from '../../utils/cn'
import { Label } from '@radix-ui/react-label'
import { Input } from '../ui/input'

const FriendRequestModal = () => {

    const [requestSent, setRequestSent] = useState(false)
    const [username , setUsername] = useState("")


    const handleUsernameChange = (e: React.FormEvent<HTMLFormElement>) => {
        setRequestSent(true)
        e.preventDefault();
        console.log("EVENT IS")


        console.log(e)
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
    <>
    <dialog id="friend_requests_modal" className="modal modal-bottom sm:modal-middle">
<div className="modal-box">
<h3>Friend Requests</h3>
{
  requestSent ? <span className="loading loading-dots loading-lg"></span> :     
  <div className='flex flex-row justify-end mt-2'>
  <button type="button" className="btn btn-outline btn-error" onClick={() => document.getElementById('friend_requests_modal')!.close()}>Close</button>
  </div>
}
</div>
</dialog>
</>
  )
}



export default FriendRequestModal