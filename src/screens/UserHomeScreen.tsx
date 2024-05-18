import React, { useEffect, useState } from 'react'
import { Menu, MenuItem } from '../components/ui/MenuComponents';
import { cn } from '../utils/cn';
import { BackgroundGradient } from '../components/backgrounds/background-gradient';
import OngoingGamesScreen from './OngoingGamesScreen';
import ProfileScreen from './ProfileScreen';
import { FriendListScroll } from '../components/ui/ParallaxScroll';
import CreateLobby from './CreateLobby';
import { socket } from '../socket/socket';
import { useUserStore } from '../state/UserAndGameState';
import ScreenLoading from '../components/ui/ScreenLoading';
import { getUserTokenFromStore } from '../persistent_storage/save_user_details';
import { get_all_users_friends } from '../helper_functions/apiCall';

const UserHomeScreen = () => {

  const { user_details } = useUserStore.getState()

  const [currentScreen , setCurrentScreen] = useState<string>("ongoing-games")
  const [loadingFriends , setLoadingFriends] = useState(true)
  const [createLobbyModalOpen , setCreateLobbyModalOpen] = useState(true)

  const onCreateLobbyModalClose = () => {
    setCreateLobbyModalOpen(false)
  }


  const getAllUsersFriends = async  () => {
    let user_token = await getUserTokenFromStore()
    let payload = JSON.stringify({user_id: user_details.id })
    let val = await get_all_users_friends(payload , user_token as string);
    
    setTimeout(() => {
      setLoadingFriends(false)
    } , 2000)
  }

  useEffect(() => {
      socket.emit("user-connection-event" , JSON.stringify({user_id: user_details.id, username: user_details.username}) )


    getAllUsersFriends()
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
           {loadingFriends ? <ScreenLoading/> :  <FriendListScroll items={[]}  />}
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