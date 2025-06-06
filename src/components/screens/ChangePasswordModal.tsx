import React, { useState } from 'react'
import { Label } from '@radix-ui/react-label';
import { cn } from '../../utils/cn';
import { Input } from '../ui/input';
import { change_user_password } from '../../helper_functions/apiCall';
import { useUserStore } from '../../state/UserAndGameState';
import { getUserTokenFromStore } from '../../persistent_storage/save_user_details';
import { ErrorAlert, SuccessAlert } from '../ui/AlertMessage';
import { LabelInputContainer } from '../ui/LabelInputContainer';

const ChangePasswordModal = () => {

    const [requestSent, setRequestSent] = useState(false)

    const [currentPassword, setCurrentPassword] = useState("")
    const [password, setPassword] = useState("")
    const [confirmpassword, setConfirmPassword] = useState("")


    //Alert states
    const [isAlert , setIsAlert] = useState(false)
    const [alertType , setAlertType] = useState<"success" | "error">("success")
    const [alertMessage, setAlertMessage] = useState("")
    const {user_details} = useUserStore()


    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (confirmpassword !== password) {

        setAlertMessage("Confirm Password and New Password Fields don't Match")
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
        let paylaod = JSON.stringify({user_id: user_details.id , password: currentPassword , new_password: password })
        let val = await change_user_password( paylaod , token );

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
          setAlertMessage("Password Changed")
          setAlertType("success")
          setIsAlert(true)

          setTimeout(() => {
            setIsAlert(false);
            setAlertMessage("")
            setAlertType("success")

            document.getElementById('change_password_modal')!.close()
    
          } , 1000)
        }
       



        
    }


    const handleValueChanges = (event: React.ChangeEvent<HTMLInputElement>) => {

        const {id , value} = event.target

        if (id === "currentpassword") {
          setCurrentPassword(value)
        }
    
        if (id === "newpassword") {
          setPassword(value)
        }
    
        if (id === "confirmpassword") {
          setConfirmPassword(value)
        }
      }
  return (
   <>
          <dialog id="change_password_modal" className="modal modal-bottom sm:modal-middle">
  <div className="modal-box">
    <h3 className="py-2">Change Password Modal</h3>
    {isAlert ? alertType === "success" ? <SuccessAlert message={alertMessage} /> : <ErrorAlert message={alertMessage} /> : <div></div>}
    {
        requestSent ? <span className="loading loading-dots loading-lg"></span> :     
        <div className="modal-action">
         <form className='w-full' onSubmit={handleChangePassword}>
         <LabelInputContainer className="mb-1">
           <Label htmlFor="currentpassword" className="text-left" >Current Password</Label>
           <Input id="currentpassword" placeholder="current_password" type="password" onChange={handleValueChanges} />
         </LabelInputContainer>
         <LabelInputContainer className="mb-1">
           <Label htmlFor="newpassword" className="text-left">Password</Label>
           <Input id="newpassword" placeholder="••••••••" type="password" onChange={handleValueChanges}/>
         </LabelInputContainer>
         <LabelInputContainer className="mb-1">
           <Label htmlFor="confirmpassword" className="text-left">Confirm Password</Label>
           <Input id="confirmpassword" placeholder="••••••••" type="password" onChange={handleValueChanges} />
         </LabelInputContainer>
   
           <div className='my-1 flex flex-row'>
   
           </div>
   
          <div className='flex flex-row justify-end mt-2'>
          <button type="button" className="btn btn-outline btn-error" onClick={() => document.getElementById('change_password_modal')!.close()}>Close</button>
           <button type="submit" className="ml-2 btn btn-outline btn-success" >Change Password</button>
          </div>
         </form>
       </div>
}
  </div>
</dialog>
   </>
  )
}



  

export default ChangePasswordModal