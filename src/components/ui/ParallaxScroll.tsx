import { useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import { useGameStore, useUserStore } from "../../state/UserAndGameState";
import { send_game_invite } from "../../helper_functions/apiCall";
import { getUserTokenFromStore } from "../../persistent_storage/save_user_details";

export const FriendListScroll = ({
  items,
    className,
  }: {
    items: {
      user_id: string;
      username: string;
      first_name: string;
      last_name: string;
      is_user_online: boolean;
    }[];
    className?: string;
  }) => {


    const {user_details} = useUserStore()
    const {game_id , game_name , game_type} = useGameStore()

    const gridRef = useRef<any>(null);
    const { scrollYProgress } = useScroll({
      container: gridRef, // remove this if your container is not fixed height
      offset: ["start start", "end start"], // remove this if your container is not fixed height
    });
   
    const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
   

    const sendGameInviteToUser = async (payload: string) => {
      let user_token = await getUserTokenFromStore()
        let val = await send_game_invite(payload, user_token)
        return val;
    }
   
    return (
      <div>
      {
        items.length === 0 ? <div className="h-[calc(100vh-20rem)] flex flex-col items-center justify-center text-black text-xl">Add Friends From Profile Section
        {/* <button className="btn btn-outline btn-success mt-2">Go to Profile Section</button> */}
        </div> :   <div
        className={cn("h-[calc(100vh-10rem)] items-start overflow-y-auto w-9/10", className)}
        ref={gridRef}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 items-start  mx-auto gap-10 py-10 px-10"
          ref={gridRef}
        >
          <div className="grid gap-10">
            {items.map((el, idx) => {
              
              const [inviteSend , setInviteSent] = useState(false)
              const [sendSuccess , setSendSuccess] = useState(false)

              return (
              <motion.div
                style={{ y: translateFirst }} // Apply the translateY motion value here
                key={"grid-1" + idx}
              >
   <div className="card card-side bg-slate-700 shadow-xl" key={el.user_id}>
    <div className="flex flex-col item-center justify-center">
  <figure className={`ml-2 my-2 avatar w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2`}><img src={`https://robohash.org/${el.username}`} alt={`${el.username}`}/></figure>
  </div>
  <div className="card-body">
    <div className="text-white w-full text-lg">{el.first_name + " " + el.last_name}</div>
    <p className="text-white">{el.username}</p>
  </div>

  <div className="flex flex-row justify-end self-center mr-1">
                {
                  inviteSend ?  <span className="loading loading-spinner loading-md tex-white"></span> :  sendSuccess ? <button className="btn btn-error text-white">Invite Sent</button>  : <button className="btn btn-success text-white" onClick={() => {
                   let payload = JSON.stringify({game_id: game_id , game_name: game_name , game_type: game_type, user_sending_username: user_details.username, user_sending_id: user_details.id, user_receiving_id: el.user_id })
                  setInviteSent(true)
                   sendGameInviteToUser(payload).then((msg) => {
                        if(msg.status) {
                          setSendSuccess(true)
                        } 

                        setInviteSent(false)
                    })
                  }}>Send Invite</button>
                }
  </div>

</div>
              </motion.div>
            )})}
          </div>
        </div>
      </div>
      }
      </div>
    );
  };