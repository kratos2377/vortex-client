import React, { useState } from 'react'
import { Menu, MenuItem } from '../components/ui/MenuComponents';
import { cn } from '../utils/cn';
import { BackgroundGradient } from '../components/common/background-gradient';
import OngoingGamesScreen from './OngoingGamesScreen';
import ProfileScreen from './ProfileScreen';

const UserHomeScreen = () => {

  const [currentScreen , setCurrentScreen] = useState<string>("ongoing-games")

  return (
    <div className="h-screen w-full dark:bg-black bg-white  dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative flex items-center justify-center">
       
     
          <UserHomeScreenNavbar className="top-2 flex space-x-5"  setCurrentScreen={setCurrentScreen} />

    {
      currentScreen === "ongoing-games" ? <OngoingGamesScreen/> : <ProfileScreen/>
    }

  </div>
  )
}

function UserHomeScreenNavbar({ className , setCurrentScreen }: { className?: string, setCurrentScreen:  React.Dispatch<React.SetStateAction<string>> }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-fit mx-auto z-50", className)}
    >

      <Menu setActive={setActive}>
      <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <MenuItem setActive={setActive} active={active} setCurrentScreen={setCurrentScreen} item="Ongoing Games" screen_name="ongoing-games"/>
        </BackgroundGradient>
        {/* <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <MenuItem setActive={setActive} active={active} item="Practice" />
        </BackgroundGradient> */}
        <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <MenuItem setActive={setActive} active={active} setCurrentScreen={setCurrentScreen} item="Profile" screen_name="profile"/>
        </BackgroundGradient> 
      </Menu>
   
    </div>
  );
}

export default UserHomeScreen