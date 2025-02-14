
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useContext, useRef, useState } from "react";
import { cn } from "../../utils/cn";
import { IconCurrencySolana } from "@tabler/icons-react";
import GeneralPurposeModal from "../screens/GeneralPurposeModal";
import { useChessMainStore, useGameStore } from "../../state/UserAndGameState";
import { get_game_details } from "../../helper_functions/apiCall";
import { getUserTokenFromStore } from "../../persistent_storage/save_user_details";
import { useNavigate } from "react-router-dom";
import { MQTT_GAME_EVENTS } from "../../utils/mqtt_event_names";
import { invoke } from "@tauri-apps/api/tauri";
import { WebSocketContext } from "../../socket/websocket_provider";
import { socket } from "../../socket/socket";
import useBoardStore from "../../state/chess_store/board";
import { Color } from "../../types/chess_types/constants";

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
    game_name: string,
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
    const {restart , setBlackTimeLeft , setWhiteTimeLeft , setCurrentTurn} = useChessMainStore()
  const { scrollYProgress } = useScroll({
    container: gridRef, // remove this if your container is not fixed height
    offset: ["start start", "end start"], // remove this if your container is not fixed height
  });

  const gameStore = useGameStore()
  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const navigate = useNavigate()
 
  const [subscribeError , setSubscribeError] = useState(false)

  const {spectatorChannel , setSpectatorChannel} = useContext(WebSocketContext)
  const {startGameFromFen} = useBoardStore()

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
      
      restart()

        console.log("Setting spec channel for game_id=" + game_id)
        let spec_chann_new = socket.channel("spectate:chess:" + game_id , {} )

        spec_chann_new.join().receive("ok" , () => {
          gameStore.updateIsSpectator(true)
          gameStore.updateGameId(game_id)

          setSpectatorChannel(spec_chann_new)


          spec_chann_new.on("game_current_state" , (msg) => {
            console.log("Game current state is")
            let parsed_data = JSON.parse(msg.data)
            console.log(parsed_data)
            setBlackTimeLeft(parsed_data.time_left_for_black_player)
            setWhiteTimeLeft(parsed_data.time_left_for_white_player)
            setCurrentTurn(parsed_data.current_turn === "white" ? Color.WHITE : Color.BLACK)
          
            
          })
  

          if(val.game.description === "LOBBY") {
            
          document.getElementById("general_purpose_modal")!.close()
            navigate("/lobby/" + game_id + "/" +  "chess" + "/" + val.game.host_id)
          } else{
            //For now  its right but we will change it in future accoring to the chess state
            gameStore.updateChessState(val.chess_state)
            startGameFromFen(val.chess_state)
            
          document.getElementById("general_purpose_modal")!.close()
          navigate("/" +  "chess" + "/" + game_id + "/" + val.game.host_id)
          }
        }).receive("error" , () => {

          setAlertMessage("Error While Joining Spectate Channel")
          setAlertType("error")
          setIsAlert(true)
    
          document.getElementById("general_purpose_modal")!.close()
    
          setTimeout(() => {
            setIsAlert(false)
          }, 3000)

        })

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