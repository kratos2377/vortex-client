import React, { useState } from 'react'
import { CardContainer, CardBody, CardItem } from '../components/ui/3d-card'
import ChangePasswordModal from '../components/screens/ChangePasswordModal'
import ChangeUsernameModal from '../components/screens/ChangeUsernameModal'

const ProfileScreen = () => {

  return (
   <div className='flex flex-row mt-5'>

<div className='ml-2 flex flex-col w-1/4 justify-center'>
      <button className="w-1/2 btn btn-outline btn-error mb-5" onClick={()=>document.getElementById('change_password_modal')!.showModal()}>Change Password</button>
        <button className="w-1/2 btn btn-outline btn-error mb-5" onClick={() => document.getElementById("change_username_modal")!.showModal()}>Change Username</button>
        <button className="w-1/2 btn btn-outline btn-error mb-5">Send Friend Request</button>
        <button className="w-1/2 btn btn-outline btn-error">Friend Requests</button>
      </div>
    
      <div className='w-3/4 flex flex-col justify-center items-center'>
 
      <div className='w-1/3 flex flex-col justify-center items-center'>
      <figure className={`avatar  w-1/2 p-4 self-center rounded-xl ring ring-primary ring-offset-base-100 ring-offset-2`}>
        <img src={`https://robohash.org/randomseed`} alt='random-seed'/>
        </figure>
      </div>


<CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-md font-bold text-neutral-600 dark:text-white"
        >
          Username: {"username"}
        </CardItem>

        <CardItem
          translateZ="50"
          className="text-md font-bold text-neutral-600 dark:text-white"
        >
          Name: {"name"}
        </CardItem>


        <CardItem
          translateZ="50"
          className="text-md font-bold text-neutral-600 dark:text-white"
        >
          Total Score: {"score"}
        </CardItem>


      
      </CardBody>
    </CardContainer>
      </div>


    <ChangePasswordModal />

    <ChangeUsernameModal />


   </div>
  )
}

export default ProfileScreen