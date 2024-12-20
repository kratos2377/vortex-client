import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '../../utils/cn';
import FriendRequestCard from './FriendRequestCard';
import { FriendRequestModel, MQTTPayload } from '../../types/models';
import { useUserStore } from '../../state/UserAndGameState';
import { getUserTokenFromStore } from '../../persistent_storage/save_user_details';
import { get_user_friend_requests } from '../../helper_functions/apiCall';

interface FriendReqModalScrollProps {
  setFriendReqCount: React.Dispatch<React.SetStateAction<number>>
}

const FriendRequestsScroll = ({setFriendReqCount}: FriendReqModalScrollProps) => {

    const gridRef = useRef<any>(null);
    const { scrollYProgress } = useScroll({
      container: gridRef, // remove this if your container is not fixed height
      offset: ["start start", "end start"], // remove this if your container is not fixed height
    });
    
    const [loading, setLoading] = useState(true)
    const {addFriendRequestModel , user_details} = useUserStore()
    const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);

    const [friendRequests, setFriendRequests] = useState<FriendRequestModel[]>([]);
    
    const getUsersFriendRequests = async () => {
      let token = await getUserTokenFromStore()
      let payload = JSON.stringify({user_id: user_details.id})
      let val = await get_user_friend_requests(payload , token);

      if (val.status) {
          let friend_requests: FriendRequestModel[] = val.friends.map((el) => {
         
            let new_req: FriendRequestModel = {
              friend_request_id: el.id ,
              user_who_send_request_id: el.user_sent_id,
              user_who_send_request_username: el.user_sent_username,
              user_who_we_are_sending_event: el.user_recieved_id
            }
            addFriendRequestModel(new_req)
            
            return new_req
          })

         // setFriendRequests([...friend_requests])
      }
      setTimeout(() => {
        setFriendReqCount(friendRequests.length)
      }, 1000)
      setLoading(false)
    }



    //Replace this function with some zustand global state fn. This is just temp fix
    const deleteIdFromArray = async (id: string) => {
      let new_array = friendRequests.filter((el) => el.friend_request_id !== id)
      setFriendRequests([...new_array])
    }


    const listenToFriendRequestsCount = (invites: FriendRequestModel[]) => {
      setFriendRequests([...invites])
      setFriendReqCount(invites.length)
    }

        
    
      useEffect(() => { 
        getUsersFriendRequests()
        useUserStore.subscribe( (state) => state.friend_invites , listenToFriendRequestsCount)
      }, [])


  
    return (
    <div>
        {
          loading ? <span className="loading loading-dots loading-lg mt-5"></span> : 
            friendRequests.length === 0 ? <div className="h-[calc(100vh-50rem)] flex flex-col items-center justify-center text-black text-xl my-6">No Friend Requests Here
            {/* <button className="btn btn-outline btn-success mt-2">Go to Profile Section</button> */}
            </div> :   <div
            className={cn("h-[calc(100vh-20rem)] items-start overflow-y-auto w-full")}
            ref={gridRef}
          >
            <div
              className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 items-start py-2"
              ref={gridRef}
            >
              <div className="grid gap-10">
                {friendRequests.map((el, idx) => (
                  <motion.div
                    style={{ y: translateFirst }} // Apply the translateY motion value here
                    key={"grid-1-" + idx}
                  >
                        <FriendRequestCard key={el.friend_request_id} username={el.user_who_send_request_username} user_id={el.user_who_send_request_id} friend_req_id={el.friend_request_id} deleteIdFromArray={deleteIdFromArray}  />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
        }
      </div>
  )
}

export default FriendRequestsScroll