import React, { useState } from 'react'
import { cn } from '../../utils/cn'
import { Label } from '@radix-ui/react-label'
import { Input } from '../ui/input'
import { useUserStore } from '../../state/UserAndGameState'
import { getUserTokenFromStore } from '../../persistent_storage/save_user_details'
import { change_user_username } from '../../helper_functions/apiCall'
import { SuccessAlert, ErrorAlert } from '../ui/AlertMessage'

const ChangeUsernameModal = () => {

    const [requestSent, setRequestSent] = useState(false)
    const [username , setUsername] = useState("")
    
        //Alert states
        const [isAlert , setIsAlert] = useState(false)
        const [alertType , setAlertType] = useState<"success" | "error">("success")
        const [alertMessage, setAlertMessage] = useState("")
        const {user_details} = useUserStore.getState()
        const {changeUserUsername} = useUserStore()

    const handleUsernameChange = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      if (username.includes("@")) {
        setAlertMessage("Username cannot contain @ character")
        setAlertType("error")
        setIsAlert(true);


        setTimeout(() => {
          setIsAlert(false);
          setAlertMessage("")
          setAlertType("success")
  
        } , 3000)

        return;
      }

      if (username.trim().length < 5) {
        setAlertMessage("Username should have atleast 5 characters")
        setAlertType("error")
        setIsAlert(true);


        setTimeout(() => {
          setIsAlert(false);
          setAlertMessage("")
          setAlertType("success")
  
        } , 3000)

        return;
      }

      setRequestSent(true)


        
      let token = await getUserTokenFromStore()
      let paylaod = JSON.stringify({user_id: user_details.id , username: username })
      let val = await change_user_username( paylaod , token );

      setRequestSent(false)

      if (!val.status) {
        setAlertMessage(val.error_message)
        setAlertType("error")
        setIsAlert(true)

        setTimeout(() => {
          setIsAlert(false);
          setAlertMessage("")
          setAlertType("success")
  
        } , 1000)
        
      } else {
        setAlertMessage("Username Changed")
        setAlertType("success")
        setIsAlert(true)
        changeUserUsername(username)
        setTimeout(() => {
          setIsAlert(false);
          setAlertMessage("")
          setAlertType("success")

          document.getElementById('change_username_modal')!.close()
  
        } , 1000)
      }
     

    }

    const handleValueChanges = (event: React.ChangeEvent<HTMLInputElement>) => {

        const {id , value} = event.target
    
        if (id === "username") {
            setUsername(value)
        }
      }

  return (
    <>
    <dialog id="change_username_modal" className="modal modal-bottom sm:modal-middle">
<div className="modal-box">
<h3>Change Username Modal</h3>
{isAlert ? alertType==="success" ? <SuccessAlert message={alertMessage} /> : <ErrorAlert message={alertMessage} /> : <div></div>}
{
  requestSent ? <span className="loading loading-dots loading-lg"></span> :     
  <div className="modal-action">
   <form className='w-full' onSubmit={handleUsernameChange}>
   <LabelInputContainer className="mb-1">
     <Label htmlFor="username" className="text-left" >New Username</Label>
     <Input id="username" placeholder="new username" type="text" className='text-white' onChange={handleValueChanges} />
   </LabelInputContainer>

     <div className='my-1 flex flex-row'>

     </div>

    <div className='flex flex-row justify-end mt-2'>
    <button type="button" className="btn btn-outline btn-error" onClick={() => document.getElementById('change_username_modal')!.close()}>Close</button>
     <button type="submit" className="ml-2 btn btn-outline btn-success" >Change Username</button>
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
  

export default ChangeUsernameModal