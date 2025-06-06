import React, { useEffect, useState } from 'react'
import { useUserStore } from '../../state/UserAndGameState'
import FriendRequestsScroll from '../ui/FriendRequestsScroll'
import { FriendListScroll } from '../ui/ParallaxScroll'
import { get_user_online_friends } from '../../helper_functions/apiCall'
import { getUserTokenFromStore } from '../../persistent_storage/save_user_details'
import { MQTTPayload, OnlineUserFriendModel } from '../../types/models'
import { listen } from '@tauri-apps/api/event'
import { USER_ONLINE_EVENT } from '../../utils/mqtt_event_names'



const OnlineFriendInviteModal = () => {
    const [requestSent, setRequestSent] = useState(true)
    const [friendsList , setFriendsList] = useState<OnlineUserFriendModel[]>([])

    //Alert states
    const [isAlert , setIsAlert] = useState(false)
    const [alertType , setAlertType] = useState<"success" | "error">("success")
    const [alertMessage, setAlertMessage] = useState("")
    const {user_details} = useUserStore()

    const getUserOnlineFriends = async () => {
    
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
          let friends_list: OnlineUserFriendModel[] = val.friends.map((ele: OnlineUserFriendModel) => {
            let friend: OnlineUserFriendModel = {
              user_id: ele.user_id,
              username: ele.username,
              first_name: ele.first_name,
              last_name: ele.last_name,
              is_user_online: ele.is_user_online
            }
            return friend
          })

          setFriendsList([...friends_list])
       }


       setRequestSent(false)
    }

    const startListeningToUserOnlineUserEvents = async () => {
     const unlisten = listen<MQTTPayload>(USER_ONLINE_EVENT, (event) => {
        let parsed_payload = JSON.parse(event.payload.message) as OnlineUserFriendModel
        let model: OnlineUserFriendModel = {
          user_id: parsed_payload.user_id,
          username: parsed_payload.username,
          first_name: parsed_payload.last_name,
          last_name: parsed_payload.last_name,
          is_user_online: true
        }
        setFriendsList([model, ...friendsList])
              })

              return () => {
                unlisten.then(f => f())
              }
    }

    useEffect(() => {
      
      getUserOnlineFriends()
    } , [])

    useEffect(() => {
        startListeningToUserOnlineUserEvents()
      
    }, [])

  return (
    <div className='h-[60vh]'>
    <dialog id="online_friend_invite_modal" className="h-full w-full modal modal-bottom sm:modal-middle">
<div className="modal-box">
<div className='text-bold text-2xl'>Send Game Invite To Users</div>
{
  requestSent ? <span className="loading loading-dots loading-lg mt-5 text-black"></span> :     
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