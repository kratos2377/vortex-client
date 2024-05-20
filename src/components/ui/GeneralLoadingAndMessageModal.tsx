import React from 'react'
import { SuccessAlert, ErrorAlert } from './AlertMessage'


interface GeneralLoadingAndMessageModalProps {
    type: "loading" | "alert",
    message: string,
    alertType: "success" | "error",
    
}

const GeneralLoadingAndMessageModal = ({type, message, alertType}: GeneralLoadingAndMessageModalProps) => {

  return (
       <>
    <dialog id="general_loading_and_message_modal" className="z-100 modal modal-bottom sm:modal-middle">
<div className="modal-box m-1">
{type === "alert" ? alertType==="success" ? <SuccessAlert message={message} /> : <ErrorAlert message={message} /> : <div className='flex flex-row'>
    {message}
    <span className="m-1 loading loading-dots loading-lg"></span>
    </div>}

</div>
</dialog>
</>
  )
}

export default GeneralLoadingAndMessageModal