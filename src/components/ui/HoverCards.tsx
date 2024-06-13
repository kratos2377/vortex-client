
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "../../utils/cn";
import { IconCurrencySolana } from "@tabler/icons-react";
import GeneralPurposeModal from "../screens/GeneralPurposeModal";
import { useGameStore } from "../../state/UserAndGameState";
import { get_game_details } from "../../helper_functions/apiCall";
import { getUserTokenFromStore } from "../../persistent_storage/save_user_details";
import { useNavigate } from "react-router-dom";
import { MQTT_GAME_EVENTS } from "../../utils/mqtt_event_names";
import { invoke } from "@tauri-apps/api/tauri";

export const OngoingGameCard = ({
  items,
  className,
  setIsAlert,
  setAlertType,
  setAlertMessage
}: {
  items: {
    game_id: string;
    game_type: string;
    game_image_url: string | null | undefined;
    is_staked: boolean;
    total_money_staked?: number | null;
    usernames_playing: string[] | null | undefined
  }[];
  className?: string;
  setIsAlert: React.Dispatch<React.SetStateAction<boolean>>,
  setAlertType:  React.Dispatch<React.SetStateAction<"success" | "error">>,
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>
}) => {

  const [generalTitle, setGeneralTitle] = useState("")
  const [generalMessage , setGeneralMessage] = useState("")
  const gridRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    container: gridRef, // remove this if your container is not fixed height
    offset: ["start start", "end start"], // remove this if your container is not fixed height
  });

  const gameStore = useGameStore()
  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const navigate = useNavigate()
 
  const [subscribeError , setSubscribeError] = useState(false)

  const subscribeInTheGame = async (game_id: string) => {
    let payload = JSON.stringify({topic_name: MQTT_GAME_EVENTS + game_id});
    let game_sub_rsp = await invoke('subscribe_to_game_topic', {payload:  payload})
      if (game_sub_rsp === "error") {
        setSubscribeError(true)
        setAlertMessage("Error While subscribing to game")
        setAlertType("error")
        setIsAlert(true)
  
        document.getElementById("general_purpose_modal")!.close()
  
        setTimeout(() => {
          setIsAlert(false)
        }, 2000)

        return
  
      }
  }

  const startListeningToGameGeneralEvents = async () => {
    let event_sub = await invoke('listen_to_game_event');
    if (event_sub === "error") {
      setSubscribeError(true)
      setAlertMessage("Error While subscribing to game")
      setAlertType("error")
      setIsAlert(true)

      document.getElementById("general_purpose_modal")!.close()

      setTimeout(() => {
        setIsAlert(false)
      }, 2000)

      return
    }
  }

  const startSpectatingGame = async (game_id: string ) => {
    setSubscribeError(false)
    setGeneralTitle("Verifying Details")
    setGeneralMessage("Redirecting To Spectating Screen")

    document.getElementById("general_purpose_modal")!.showModal()
    let user_token = await getUserTokenFromStore()
    let get_game_payload = JSON.stringify({game_id: game_id})
    let val = await get_game_details(get_game_payload, user_token)

    if (!val.status) {
      setAlertMessage(val.error_message)
      setAlertType("error")
      setIsAlert(true)

      document.getElementById("general_purpose_modal")!.close()

      setTimeout(() => {
        setIsAlert(false)
      }, 2000)


    } else {
   subscribeInTheGame(game_id)
    startListeningToGameGeneralEvents()

    gameStore.updateIsSpectator(true)
      document.getElementById("general_purpose_modal")!.close()
        navigate("/spectate/" + game_id + "/" + val.game.name + "/" + val.game.host_id, {state: { game_model: val.game  }})

    }
    
  } 
  return (
    <>
    { items.length === 0 ? <div className="h-[calc(100vh-10rem)] text-white text-2xl flex flex-col justify-center items-center self-center"> No Ongoing Games. You can add more friends or start your own Game! </div> :
   <div  className={cn("h-[calc(100vh-10rem)] items-start overflow-y-auto w-full ")} ref={gridRef}>
     <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-5 overflow-y-auto",
        className
      )}
      ref={gridRef}
    >
    {items.map((item, idx) => (
        <motion.div
        style={{ y: translateFirst }} // Apply the translateY motion value here
        key={"grid-1" + idx}
        >
                 <div className="p-2 h-full w-full">

          <Card key={item.game_id} className=" hover:cursor-pointer">
            <img className="w-20 h-20 mr-4 rounded-full self-center" src={`${item.game_image_url}`}/>
        
            <div>
            <CardDescription className="w-8/10 lg:text-2xl mb-1 md:text-xl sm:text-md">{item.game_type.toUpperCase()}</CardDescription>
            <CardDescription className="w-8/10 lg:text-2xl md:text-xl sm:text-md">{joinAndTrimUsernames(item.usernames_playing!) + "... " + "are playing"}</CardDescription>
            <div className="flex flex-col mt-1">

            <div className="flex flex-row">
            <div className="mr-3 text-zinc-100 font-bold">
              {item.is_staked ? "Staked Game" : "Normal"}
            </div>

            {item.is_staked ? <div className="flex flex-row text-zinc-100">
              <span className="mr-0.5">{item.total_money_staked}</span>
              <span><IconCurrencySolana/></span>
               </div> : <div></div>}

           
            </div>

            <div className="w-30 h-15 mt-1 items-end">
               <button className="btn btn-outline btn-error" onClick={() => startSpectatingGame(item.game_id)}>Spectate game</button>
               </div>

            </div>
            </div>
         
          </Card>
       </div>
        </motion.div>
      ))
    }
    </div>
    <GeneralPurposeModal message={generalMessage} title={generalTitle} />
   </div> }
   </>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-xl h-full w-full p-1 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700",
        className
      )}
    >
      <div>
        <div className="p-1 w-full flex flex-row">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold  mt-4", className)}>
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-3 text-zinc-400  text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};


const joinAndTrimUsernames = (usernames: string []) => {
  if (usernames === null || usernames === undefined || usernames.length === 0) {
    return ""
  }
  return usernames.join(', ').trim().slice(0,10)
}