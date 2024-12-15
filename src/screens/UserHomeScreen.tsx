import React, { useContext, useEffect, useState } from 'react'
import { Menu, MenuItem } from '../components/ui/MenuComponents';
import { cn } from '../utils/cn';
import { BackgroundGradient } from '../components/backgrounds/background-gradient';
import OngoingGamesScreen from './OngoingGamesScreen';
import ProfileScreen from './ProfileScreen';
import CreateLobby from './CreateLobby';
import { socket } from '../socket/socket';
import { useUserStore } from '../state/UserAndGameState';
import { GameInvitesScroll } from '../components/ui/GameInvitesScroll';
import {  MQTT_USER_EVENTS } from '../utils/mqtt_event_names';
import { invoke } from '@tauri-apps/api/tauri';
import { ErrorAlert, SuccessAlert } from '../components/ui/AlertMessage';
import RedirectingToLobbyModal from '../components/screens/RedirectingToLobbyModal';
import JoiningLobbyModal from '../components/screens/JoiningLobbyModal';
import { WebSocketContext } from '../socket/websocket_provider';
import { getUserTokenFromStore } from '../persistent_storage/save_user_details';
import FindMatchScreen from './FindMatchScreen';
import SocketConnectionLoading from '../components/ui/SocketConnectionLoading';

const UserHomeScreen = () => {

  const {userChannel , setUserChannel} = useContext(WebSocketContext)
  const [currentScreen , setCurrentScreen] = useState<string>("ongoing-games")
  const {user_details} = useUserStore()
  

  const [isAlert, setIsAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState<"success" | "error">("success")
  const [socketLoading , setSocketLoading] = useState(true)
  const connectToSocket = async () => {

    const token = getUserTokenFromStore()

    for(var i = 0 ; i<3 ; i++) {
      if(!socket.isConnected()) {
  
        socket.connect({token: token , user_id: user_details.id, username: user_details.username})


        let user_notif_channel = socket.channel("user:notifications:" + user_details.id , {token: token , user_id: user_details.id})
        user_notif_channel.join().receive("ok" , (msg) => {
          console.log("successfully joined user channel")
          setUserChannel(user_notif_channel)
        }).receive("error" , (msg) => {
          console.log("Error while joining user notifications channel")
          console.log(msg)
        })


        user_notif_channel.onError((response) => {
          console.log("Some error occured on the user notificaations channel")
          console.log(response)
        })
        
  
  
      } else {
        console.log("Connection Already Established to pub sub server")
        break;
      }
    }

  }

  


  useEffect(() => {

    connectToSocket().then(() => {
      if(socket.isConnected() && userChannel !== null && userChannel !== undefined) {
        setIsAlert(true)
        setAlertType("success")
        setAlertMessage("Successfully Connected to socket server")
        setSocketLoading(false)
        setTimeout(() => {
          setIsAlert(false)
        } , 1000)
      } else {
        setSocketLoading(false)
        setIsAlert(true)
        setAlertType("error")
        setAlertMessage("Error While Connecting to Socket Server. Please close the app and try again later")

        setTimeout(() => {
          setIsAlert(false)
        } , 1000)
      }
    })

  }, [socketLoading])

  return (
    <>
    <div className="h-screen w-screen dark:bg-black bg-white  dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative">
        
  
      
    {
      socketLoading ? <SocketConnectionLoading/> :     <div className='flex flex-row divide-x '>
      <div className='w-4/5 items-center justify-center'>
            <UserHomeScreenNavbar className="top-2 flex space-x-5"  setCurrentScreen={setCurrentScreen} />
  
  
            {isAlert ?  alertType === "success" ? <SuccessAlert message={alertMessage}/> : <ErrorAlert message={alertMessage}/> : <div></div>}
          
  
          {
            
            {
              "ongoing-games": <OngoingGamesScreen/>,
              "create-lobby": <CreateLobby setCurrentScreen={setCurrentScreen}/>,
              "profile": <ProfileScreen/>,
              "find-match": <FindMatchScreen/>,
            }[currentScreen]
      
          }
           </div>
        
             <div className="w-1/5 divide-y h-screen dark:bg-black bg-white  dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2]">
             <div className=" h-1/2 text-xs font-bold relative bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
              <p className=' text-lg sm:text-md font-bold relative bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 flex items-center justify-center'>
              Game Invites
              </p>
  
              <div >
              <GameInvitesScroll setIsAlert={setIsAlert} setAlertMessage={setAlertMessage} setAlertType={setAlertType}/>
              </div>
             </div>
    
             </div>
      </div>
    }

   <RedirectingToLobbyModal/>
   <JoiningLobbyModal />

  </div>
  </>
  )
}

function UserHomeScreenNavbar({ className , setCurrentScreen }: { className?: string, setCurrentScreen:  React.Dispatch<React.SetStateAction<string>> }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("relative top-5 flex justify-center items-center border-b-2", className)}
    >



        <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <MenuItem setActive={setActive} active={active} setCurrentScreen={setCurrentScreen} item="Find a match" screen_name="find-match"/>
        </BackgroundGradient>

        <Menu setActive={setActive}>
      <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <MenuItem setActive={setActive} active={active} setCurrentScreen={setCurrentScreen} item="Ongoing Games" screen_name="ongoing-games"/>
        </BackgroundGradient>

        <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <MenuItem setActive={setActive}  setCurrentScreen={setCurrentScreen} active={active} item="Create Lobby" screen_name="create-lobby" />
        </BackgroundGradient>
        <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <MenuItem setActive={setActive} active={active} setCurrentScreen={setCurrentScreen} item="Profile" screen_name="profile"/>
        </BackgroundGradient> 

        {/* <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <MenuItem setActive={setActive} active={active} setCurrentScreen={setCurrentScreen} item="Marketplace" screen_name="marketplace"/>
        </BackgroundGradient>  */}
      </Menu>
   
    </div>
  );
}

export default UserHomeScreen