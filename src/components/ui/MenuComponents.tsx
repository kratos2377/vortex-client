import { motion } from 'framer-motion';
import React from 'react'
import { useUserStore } from '../../state/UserAndGameState';

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};
 
export const MenuItem = ({
  setActive,
  active,
  setCurrentScreen,
  item,
  screen_name,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  setCurrentScreen:  React.Dispatch<React.SetStateAction<string>>;
  item: string;
  screen_name: string;
  children?: React.ReactNode;
  
}) => {
  const {changeIsMatchmaking , is_matchmaking_in_progress} = useUserStore()
  return (
    <div onMouseEnter={() => setActive(item) } onClick={() => {
      if(screen_name === "find-match") {

        if(!is_matchmaking_in_progress) {
          setCurrentScreen(screen_name)
        }

      } else {
        changeIsMatchmaking(false)
        setCurrentScreen(screen_name)
      }
    }} className="relative ">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white"
      >
        {item}
      </motion.p>

    </div>
  );
};
 
export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)} // resets the state
      className="relative r border-transparent dark:bg-black dark:border-white/[0.2] bg-white shadow-input flex space-between space-x-10 px-3 py-3 "
    >
      {children}
    </nav>
  );
};
 
