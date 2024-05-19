import { Label } from '@radix-ui/react-label'
import React, { useState } from 'react'
import { cn } from '../../utils/cn'
import { Input } from '../ui/input'
import { ErrorAlert, SuccessAlert } from '../ui/AlertMessage'
import { getUserTokenFromStore } from '../../persistent_storage/save_user_details'
import { useUserStore } from '../../state/UserAndGameState'
import { send_friend_request } from '../../helper_functions/apiCall'

const SendFriendRequestModal = () => {

  const [requestSent, setRequestSent] = useState(false)
  const [username , setUsername] = useState("")
  const [isAlert , setIsAlert] = useState(false)
  const [alertType, setAlertType] = useState<"success" | "error">("success")
  const [alertMessage, setAlertMessage] = useState("")
  const {user_details} = useUserStore.getState()

  const handleUsernameChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();



      setRequestSent(true)
      let token = await getUserTokenFromStore()
      let payload = JSON.stringify({user_id: user_details.id , friend_username: username , user_username: user_details.username })
      let val = await send_friend_request(payload , token)

      if (!val.status) {
        setRequestSent(false)
        setAlertMessage(val.error_message)
        setAlertType("error")
        setIsAlert(true)

        setTimeout(() => {
          setIsAlert(false)
          setAlertMessage("")
          setAlertType("success")
        } , 3000)

        return
      }

      setRequestSent(false)

      setAlertMessage("Request Sent")
      setAlertType("success")
      setIsAlert(true)

      setTimeout(() => {
        setIsAlert(false)
        setAlertMessage("")
        setAlertType("success")
   //     document.getElementById("send_friend_request_modal")!.close();
      } , 2000)

  }

  const handleValueChanges = (event: React.ChangeEvent<HTMLInputElement>) => {

      const {id , value} = event.target
  
      if (id === "friendsusername") {
          setUsername(value)
      }
    }

return (
  <>
  <dialog id="send_friend_request_modal" className="modal modal-bottom sm:modal-middle">
<div className="modal-box">
<h3>Send Friend Requests</h3>
{isAlert ? alertType==="success" ? <SuccessAlert message={alertMessage} /> : <ErrorAlert message={alertMessage} /> : <div></div>}
{
requestSent ? <div className='flex flex-row'>Searching <span className="loading loading-dots loading-lg"></span> </div> :     
<div className="modal-action">
 <form className='w-full' onSubmit={handleUsernameChange}>
  <div className='flex flex-row'>
  <LabelInputContainer className="mb-1">
   <Label htmlFor="friendsusername" className="text-left" >Search By Username</Label>
   <Input id="friendsusername" placeholder="Enter Your Friends Username" type="text" onChange={handleValueChanges} />
 </LabelInputContainer>

  </div>

   <div className='my-1 flex flex-row'>

   </div>

  <div className='flex flex-row justify-end mt-2'>
  <button type="button" className="btn btn-outline btn-error" onClick={() => document.getElementById('send_friend_request_modal')!.close()}>Close</button>
   <button type="submit" className="ml-2 btn btn-outline btn-success" >Send Request</button>
  </div>
 </form>
</div>
}
</div>
</dialog>
</>
)
}



const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};


export default SendFriendRequestModal