import { IconCheck, IconX } from '@tabler/icons-react'
import React from 'react'


interface FriendRequestCardProps {
    username: string,
    user_id: string,
    first_name: string,
    last_name: string,
}

const FriendRequestCard = ({ username , user_id , first_name , last_name  } : FriendRequestCardProps) => {
  return (
    <div key={user_id}>

<div className="card card-side bg-slate-700 shadow-xl py-2 px-1">
    <div className="flex flex-col item-center justify-center">
  <figure className={`ml-4 my-2 avatar w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2`}><img src={`https://robohash.org/${username}`} alt={`${username}`}/></figure>
  </div>
  <div className="card-body">
    <p className="text-white w-full text-lg">{username}</p>
  </div>

  <div className="card-actions justify-end flex flex-row self-center mr-1">
      <button className="btn btn-success text-white"><IconCheck/></button>
      <button className="btn btn-error text-white"><IconX/></button>
    </div>

</div>
    </div>
  )
}

export default FriendRequestCard