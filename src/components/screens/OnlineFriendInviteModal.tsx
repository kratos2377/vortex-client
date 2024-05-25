import React, { useEffect, useState } from 'react'
import { useUserStore } from '../../state/UserAndGameState'
import FriendRequestsScroll from '../ui/FriendRequestsScroll'
import { FriendListScroll } from '../ui/ParallaxScroll'
import { get_user_online_friends } from '../../helper_functions/apiCall'
import { getUserTokenFromStore } from '../../persistent_storage/save_user_details'
import { OnlineUserFriendModel } from '../../types/models'



const OnlineFriendInviteModal = () => {

    const [requestSent, setRequestSent] = useState(false)
    const [friendsList , setFriendsList] = useState<OnlineUserFriendModel[]>([])

    //Alert states
    const [isAlert , setIsAlert] = useState(false)
    const [alertType , setAlertType] = useState<"success" | "error">("success")
    const [alertMessage, setAlertMessage] = useState("")
    const {user_details} = useUserStore()

    const getUserOnlineFriends = async () => {
    
      setRequestSent(true)
      let payload = {user_id: user_details.id}
      let user_token = await getUserTokenFromStore()
       let val = await get_user_online_friends(JSON.stringify(payload), user_token)

       if (!val.status) {
         setAlertMessage(val.error_message)
         setAlertType("error")
        setIsAlert(true)

        setTimeout(() => {
            setIsAlert(false)
        }, 4000)
       } else {
          let friends_list: OnlineUserFriendModel[] = val.friends.map((ele) => {
            let parsed_value = JSON.parse(ele) as OnlineUserFriendModel
            let friend: OnlineUserFriendModel = {
              user_id: parsed_value.user_id,
              username: parsed_value.username,
              first_name: parsed_value.first_name,
              last_name: parsed_value.last_name,
              is_user_online: parsed_value.is_user_online
            }
          })

          setFriendsList([...friends_list])
       }


       setRequestSent(false)
    }

    useEffect(() => {
      getUserOnlineFriends()
    }, [])

  return (
    <div className='h-[60vh]'>
    <dialog id="online_friend_invite_modal" className="h-full w-full modal modal-bottom sm:modal-middle">
<div className="modal-box">
<div className='text-bold text-2xl'>Send Game Invite To Users</div>
{
  requestSent ? <span className="loading loading-dots loading-lg"></span> :     
  <div className='flex flex-col justify-end mt-1'>
    <div className='my-1'> 

    <FriendListScroll items={friendsList}  />

    </div>
  <button type="button" className="btn btn-outline btn-error" onClick={() => document.getElementById('online_friend_invite_modal')!.close()}>Close</button>
  </div>
}
</div>
</dialog>
</div>
  )
}



export default OnlineFriendInviteModal