import React, { useState } from 'react'
import { Label } from '@radix-ui/react-label';
import { cn } from '../../utils/cn';
import { Input } from '../ui/input';

const ChangePasswordModal = () => {

    const [requestSent, setRequestSent] = useState(false)

    const [currentPassword, setCurrentPassword] = useState("")
    const [password, setPassword] = useState("")
    const [confirmpassword, setConfirmPassword] = useState("")

    const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
        setRequestSent(true)
        e.preventDefault();
        console.log("EVENT IS")


        console.log(e)
        setTimeout(() => {
            setRequestSent(false)
            document.getElementById('change_password_modal')!.close();
        } , 3000)
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
  

export default ChangePasswordModal