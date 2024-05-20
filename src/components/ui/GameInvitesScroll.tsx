import { useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import { listen } from "@tauri-apps/api/event";
import { IconCheck, IconX } from "@tabler/icons-react";
import { GameInviteUserModel, MQTTPayload } from "../../types/models";
import { GAME_INVITE_EVENT } from "../../utils/mqtt_event_names";
import { useUserStore } from "../../state/UserAndGameState";

export const GameInvitesScroll = ({
    className,
  }: {
    className?: string;
  }) => {
    const gridRef = useRef<any>(null);
    const { scrollYProgress } = useScroll({
      container: gridRef,
      offset: ["start start", "end start"], 
    });
    const {addGameInviteModel, game_invites} = useUserStore()
    const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
   
    const [sortedUsers, setSortedUsers] = useState<GameInviteUserModel[]>([...game_invites]);
    

    const startGameInviteListener = async () => {
      await listen<MQTTPayload>(GAME_INVITE_EVENT, (event) => {
          let parsed_payload = JSON.parse(event.payload.message) 
          let model: GameInviteUserModel = {
            game_id: parsed_payload.game_id,
            user_id: parsed_payload.user_who_send_request_id,
            username: parsed_payload.user_who_send_request_username,
            game_name: parsed_payload.game_name,
            game_type: parsed_payload.game_type
          }
          setSortedUsers([model, ...sortedUsers])
          addGameInviteModel(model)
    });
    }
    useEffect(() => {
        startGameInviteListener()
    }, [])


   
    return (
      <div>
      {
        sortedUsers.length === 0 ? <div className="h-[calc(100vh-20rem)] flex flex-col items-center justify-center text-white text-xl">Add Friends From Profile Section
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
            {sortedUsers.map((el, idx) => (
              <motion.div
                style={{ y: translateFirst }} // Apply the translateY motion value here
                key={"grid-1" + idx}
              >
   <div key={el.game_id + "-" + el.user_id} className="card card-side bg-slate-700 shadow-xl">
    <div className="flex flex-col item-center justify-center">
  <figure className={`ml-2 my-2 avatar w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2`}><img src={`https://robohash.org/${el.username}`} alt={`${el.username}`}/></figure>
  </div>
  <div className="card-body">
    <p className="text-white w-full text-lg">{el.username} has invite you to play {el.game_name}</p>
    <p className="text-white">The game type is- {el.game_type}</p>
  </div>


  <div className="card-actions justify-end flex flex-row self-center mr-1">
      <button className="btn btn-success text-white"><IconCheck/></button>
      <button className="btn btn-error text-white"><IconX/></button>
    </div>

</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      }
      </div>
    );
  };