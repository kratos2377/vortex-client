import React, { useState } from 'react'


interface GeneralPurposeModalProps {
    message: string,
    title: string
}

const GeneralPurposeModal = ({message, title} : GeneralPurposeModalProps) => {


  return (
   <>
          <dialog id="general_purpose_modal" className="modal modal-bottom sm:modal-middle">
  <div className="modal-box">
    <h3 className="py-2">{title}</h3>
    <div className='flex flex-row'>
        <div className='ml-2 text-black'>{message}</div>
        <span className="loading loading-dots loading-lg"></span> 
    </div>

  </div>
</dialog>
   </>
  )
}



  

export default GeneralPurposeModal