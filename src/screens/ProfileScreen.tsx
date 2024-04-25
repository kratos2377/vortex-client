import React, { useState } from 'react'
import { CardContainer, CardBody, CardItem } from '../components/ui/3d-card'

const ProfileScreen = () => {

  const [changePasswordModal , setChangePasswordModal] = useState(false)
  const [changeUsernameModal , setChangeUsernameModal] = useState(false)

  return (
   <div className='flex flex-row'>
    
      <div className='w-1/4 justify-center items-center'>
 

      <div className='flex flex-col justify-center items-center'>
      <figure className={`avatar  w-1/2 p-6 self-center rounded-full ring ring-primary ring-offset-base-100 ring-offset-2`}>
        <img className="" src={`https://robohash.org/randomseed`}/>
        </figure>
      </div>

      <div className='flex flex-col w-1/2 mt-5 justify-center items-center'>
      <button className="btn btn-outline btn-error mb-5">Change Password</button>
        <button className="btn btn-outline btn-error">Change Username</button>
      </div>
      </div>

      <div className='w-3/4 mr-2 self-center'>

      <CardContainer className="inter-var w-full">
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full p-5 sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          Make things float in air
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          Hover over this card to unleash the power of CSS perspective
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="flex justify-between items-center mt-20">
          <CardItem
            translateZ={20}
            as="button"
            href="https://twitter.com/mannupaaji"
            target="__blank"
            className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
          >
            Try now →
          </CardItem>
          <CardItem
            translateZ={20}
            as="button"
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
          >
            Sign up
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>

      </div>

   </div>
  )
}

export default ProfileScreen