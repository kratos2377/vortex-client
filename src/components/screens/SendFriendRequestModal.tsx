import { Label } from '@radix-ui/react-label'
import React, { useState } from 'react'
import { cn } from '../../utils/cn'
import { Input } from '../ui/input'
import { ErrorAlert, SuccessAlert } from '../ui/AlertMessage'
import { IconUserSearch } from '@tabler/icons-react'

const SendFriendRequestModal = () => {

  const [requestSent, setRequestSent] = useState(false)
  const [username , setUsername] = useState("")
  const [isAlert , setIsAlert] = useState(false)
  const [alertType, setAlertType] = useState<"success" | "error">("success")
  const [alertMessage, setAlertMessage] = useState("")


  const handleUsernameChange = (e: React.FormEvent<HTMLFormElement>) => {
      setRequestSent(true)
      e.preventDefault();

      setTimeout(() => {
          setRequestSent(false)
          document.getElementById('send_friend_request_modal')!.close();
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
   <Label htmlFor="username" className="text-left" >Search By Username</Label>
   <Input id="username" placeholder="Enter Your Friends Username" type="text" onChange={handleValueChanges} />
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