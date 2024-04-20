import { motion } from 'framer-motion';
import React from 'react'

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
  return (
    <div onMouseEnter={() => setActive(item) } onClick={() => setCurrentScreen(screen_name)} className="relative ">
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
      className="relative rounded-full boder border-transparent dark:bg-black dark:border-white/[0.2] bg-white shadow-input flex justify-center space-x-10 px-5 py-6 "
    >
      {children}
    </nav>
  );
};
 
