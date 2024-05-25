import { IconCheck, IconX } from '@tabler/icons-react'
import React, { useState } from 'react'
import { accept_or_reject_request_call } from '../../helper_functions/apiCall'
import { getUserTokenFromStore } from '../../persistent_storage/save_user_details'


interface FriendRequestCardProps {
    username: string,
    user_id: string,
    friend_req_id: string,
    deleteIdFromArray: (id: string) => Promise<void>
}

const FriendRequestCard = ({ username , user_id, friend_req_id , deleteIdFromArray  } : FriendRequestCardProps) => {

  const [reqSent , setReqSent] = useState(false)
  const acceptOrRejectRequest = async (value: string) => {
    setReqSent(true)
    let payload = JSON.stringify({value: value,friend_request_relation_id: friend_req_id })
    let user_token = await getUserTokenFromStore()
    let val = await accept_or_reject_request_call(payload , user_token)
    

    if(!val.status) {
      return
    } 

    deleteIdFromArray(friend_req_id)
    setReqSent(false)
  }


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
 {reqSent ? <span className="loading loading-spinner loading-md text-white"></span> :
     <div>
       <button className="btn btn-success text-white" onClick={() => acceptOrRejectRequest("1")}><IconCheck/></button>
      <button className="btn btn-error text-white" onClick={() => acceptOrRejectRequest("-1")}><IconX/></button>
       </div> }
    </div>

</div>
    </div>
  )
}

export default FriendRequestCard