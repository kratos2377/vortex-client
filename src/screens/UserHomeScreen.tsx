import React, { useEffect, useState } from 'react'
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

const UserHomeScreen = () => {


  const [currentScreen , setCurrentScreen] = useState<string>("ongoing-games")
  const {user_details} = useUserStore()

  const [isAlert, setIsAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState<"success" | "error">("success")

  const subscribe_to_mqtt_user_topic = async () => {
    let payload = JSON.stringify({topic_name: MQTT_USER_EVENTS + user_details.id});
    let val = await invoke('subscribe_to_user_topic', {payload:  payload})

    if(val === "error") {
      return;
    }

  }


  const start_listening_to_user_events = async () => {
    let val = await invoke('listen_to_user_event')

    
    if(val === "error") {
      setAlertMessage("Error while subscribing to MQTT Broker. You will not get realtime events")
      setAlertType("error")
      setIsAlert(true)

      setTimeout(() => {
        setIsAlert(false)
      }, 5000)
      return;
    }


  }

   

  useEffect(() => {
   //   socket.push("user-connection-event" , JSON.stringify({user_id: user_details.id, username: user_details.username}) )
      subscribe_to_mqtt_user_topic()
          start_listening_to_user_events()

            
  } , [])

  return (
    <>
    <div className="h-screen w-screen dark:bg-black bg-white  dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative">
        
  
      
    <div className='flex flex-row divide-x '>
    <div className='w-4/5 items-center justify-center'>
    <UserHomeScreenNavbar className="top-2 flex space-x-5"  setCurrentScreen={setCurrentScreen} />

    {isAlert ?  alertType === "success" ? <SuccessAlert message={alertMessage}/> : <ErrorAlert message={alertMessage}/> : <div></div>}
   

   {
     currentScreen === "ongoing-games" ? <OngoingGamesScreen/> : currentScreen === "create-lobby" ? <CreateLobby setCurrentScreen={setCurrentScreen}/> : <ProfileScreen/>
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
      className={cn("relative top-10 w-screen mx-auto flex justify-center items-center", className)}
    >

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