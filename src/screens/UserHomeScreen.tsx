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

const UserHomeScreen = () => {

  const {chann , setChannel} = useContext(WebSocketContext)
  const [currentScreen , setCurrentScreen] = useState<string>("ongoing-games")
  const {user_details} = useUserStore()

  const [isAlert, setIsAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState<"success" | "error">("success")

  // useEffect(() => {
  //   if(chann !== undefined && chann !== null) {
  //       chann.leave(1000)

  //       setChannel(null)
  //   }

  // }, [])

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