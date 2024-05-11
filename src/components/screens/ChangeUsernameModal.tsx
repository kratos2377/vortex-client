import React, { useState } from 'react'
import { cn } from '../../utils/cn'
import { Label } from '@radix-ui/react-label'
import { Input } from '../ui/input'

const ChangeUsernameModal = () => {

    const [requestSent, setRequestSent] = useState(false)
    const [username , setUsername] = useState("")


    const handleUsernameChange = (e: React.FormEvent<HTMLFormElement>) => {
        setRequestSent(true)
        e.preventDefault();
        console.log("EVENT IS")


        console.log(e)
        setTimeout(() => {
            setRequestSent(false)
            document.getElementById('change_username_modal')!.close();
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
    <dialog id="change_username_modal" className="modal modal-bottom sm:modal-middle">
<div className="modal-box">
<h3>Change Username Modal</h3>
{
  requestSent ? <span className="loading loading-dots loading-lg"></span> :     
  <div className="modal-action">
   <form className='w-full' onSubmit={handleUsernameChange}>
   <LabelInputContainer className="mb-1">
     <Label htmlFor="username" className="text-left" >New Username</Label>
     <Input id="username" placeholder="new username" type="text" onChange={handleValueChanges} />
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