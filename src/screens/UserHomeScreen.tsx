import React, { useEffect, useState } from 'react'
import { Menu, MenuItem } from '../components/ui/MenuComponents';
import { cn } from '../utils/cn';
import { BackgroundGradient } from '../components/backgrounds/background-gradient';
import OngoingGamesScreen from './OngoingGamesScreen';
import ProfileScreen from './ProfileScreen';
import { ParallaxScroll } from '../components/ui/ParallaxScroll';
import CreateLobby from './CreateLobby';
import { socket } from '../socket/socket';
import { useUserStore } from '../state/UserAndGameState';

const UserHomeScreen = () => {

  const { user_details } = useUserStore.getState()

  const [currentScreen , setCurrentScreen] = useState<string>("ongoing-games")

  const [createLobbyModalOpen , setCreateLobbyModalOpen] = useState(true)

  const onCreateLobbyModalClose = () => {
    setCreateLobbyModalOpen(false)
  }


  useEffect(() => {
      socket.emit("user-connection-event" , JSON.stringify({user_id: "ef2ec146-f38f-4851-b2c6-db79440217f6" , username: "necromorph231"}) )
  } , [])

  return (
    <div className="h-screen w-screen dark:bg-black bg-white  dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative">
        
  
      
    <div className='flex flex-row divide-x '>
    <div className='w-4/5 items-center justify-center'>
    <UserHomeScreenNavbar className="top-2 flex space-x-5 "  setCurrentScreen={setCurrentScreen} />
   

   {
     currentScreen === "ongoing-games" ? <OngoingGamesScreen/> : currentScreen === "create-lobby" ? <CreateLobby setCurrentScreen={setCurrentScreen}/> : <ProfileScreen/>
   }
         </div>
      
           <div className="w-1/5 divide-y h-screen dark:bg-black bg-white  dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2]">
           <div className=" h-1/2 text-xs font-bold relative bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
            <p className=' text-lg sm:text-md font-bold relative bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 flex items-center justify-center'>
            Friends
            </p>

            <div >
            <ParallaxScroll  />;
            </div>
           </div>
  
           </div>
    </div>


  </div>
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
      </Menu>
   
    </div>
  );
}

export default UserHomeScreen