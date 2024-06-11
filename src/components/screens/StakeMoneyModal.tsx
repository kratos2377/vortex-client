import React, { useState } from 'react'
import { LabelInputContainer } from '../ui/LabelInputContainer'
import { ErrorAlert, SuccessAlert } from '../ui/AlertMessage'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

const StakeMoneyModal = () => {
    const [requestSent, setRequestSent] = useState(false)
    
    //Alert states
    const [isAlert, setIsAlert] = useState(false)
    const [alertType, setAlertType] = useState<"success" | "error">("success")
    const [alertMessage, setAlertMessage] = useState("")
  return (
    <>
    <dialog id="stake_money_modal" className="modal modal-bottom sm:modal-middle">
<div className="modal-box">
<h3>Stake Money Modal</h3>
{isAlert ? alertType==="success" ? <SuccessAlert message={alertMessage} /> : <ErrorAlert message={alertMessage} /> : <div></div>}
{
  requestSent ? <span className="loading loading-dots loading-lg"></span> :     
  <div className="modal-action">
      Under Development
   {/* <form className='w-full' onSubmit={() => {}}>
   <LabelInputContainer className="mb-1">
     <Label htmlFor="moneystaked" className="text-left" >New Username</Label>
     <Input id="moneystaked" placeholder="Enter Amout of Sols You want to Stake" type="text" className='text-white' onChange={() => {}} />
   </LabelInputContainer>

     <div className='my-1 flex flex-row'>

     </div>

    <div className='flex flex-row justify-end mt-2'>
     <button type="submit" className="btn btn-outline btn-success" >Stake Money</button>
    <button type="button" className="ml-2 btn btn-outline btn-error" onClick={() => document.getElementById('stake_money_modal')!.close()}>Close</button>
    </div>
   </form> */}
   <button type="button" className="ml-2 btn btn-outline btn-error" onClick={() => document.getElementById('stake_money_modal')!.close()}>Close</button>
 </div>
}
</div>
</dialog>
</>
  )
}

export default StakeMoneyModal