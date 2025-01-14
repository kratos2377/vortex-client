import  React from "react";
import { interval, BehaviorSubject, of } from "rxjs";
import { map, mapTo, scan, switchMap,  takeWhile, tap } from "rxjs/operators";
import { useChessMainStore } from "../../../state/UserAndGameState";
import { useEffect, useMemo, useState } from "react";
import { Color } from "../../models/Piece/types";
import usePlayerStore from "../../../state/chess_store/player";
import { motion } from "framer-motion";
interface TimerProps {
  maxTimeInSeconds: number;
  incrementInSeconds?: number;
  player: string;
}

interface WrappedTimeProps {
  player: string
}

const Timer = ({
  maxTimeInSeconds,
  incrementInSeconds = 0,
  player,
}: TimerProps) => {

  const { status, currentTurn } = useChessMainStore.getState()
  const {startingPlayerColor} = usePlayerStore.getState()
  const [timeRemaining, setTimeRemaining] =useState(
    maxTimeInSeconds * 1000
  );
  const interval$ = interval(1000).pipe(mapTo(-1000));
  const pause$ = useMemo(() => new BehaviorSubject(true), []);
  
  useEffect(() => {
    if (status === "IN PROGRESS") {
      pause$.next(currentTurn !== player);
    }
  }, [player, currentTurn , status, currentTurn]);
  
  useEffect(() => {
    if (status !== "IN PROGRESS") {
      return;
    }
    
    pause$
      .pipe(
        switchMap((pause: boolean) =>
          pause ? of(incrementInSeconds * 1000) : interval$
        ),
        scan((acc, curr) => (curr ? curr + acc : acc), maxTimeInSeconds * 1000),
        tap((val) => {
          setTimeRemaining(val);
        }),
        takeWhile((val) => val > 0 && status === "IN PROGRESS")
      ).subscribe(
        (val) => null,
        (err) => console.log(err),
        () =>
        console.log("GAME ENDED")
      )

    return () => {
      pause$.next(true);
   //  pause$.unsubscribe();
    };
  }, [status]);

  const displayTime = Math.ceil(timeRemaining / 1000);
  const displayMin = Math.floor(displayTime / 60);
  const displaySec = Math.floor(displayTime % 60).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });

  const warningTime = 890;
  const isMyTurn = startingPlayerColor === player;

    // Timer configuration
    const totalTime = 900;
    const radius = 50;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
  
    // Calculate progress
    const progress = ((displayTime) / totalTime) * 100;

  return (
    // <div
    // className={`w-full p-[20px] ${isMyTurn && displayTime <= warningTime ? "text-white bg-red-800" : "decoration-inherit bg-inherit"}` }
    // >
    //   {`${displayMin}:${displaySec}`}
    // </div>
    <div className="w-auto h-auto">
       <div className="relative w-80 h-80 mx-auto mb-2">
    {/* Background Circle */}
    <svg 
      className="absolute transform -rotate-90" 
      width="320" 
      height="320" 
      viewBox="0 0 320 320"
    >
      {/* Base Circle */}
      <circle 
        cx="160" 
        cy="160" 
        r={radius} 
        fill="none" 
        stroke="#e0e0e0" 
        strokeWidth={strokeWidth}
      />
      
      {/* Animated Foreground Circle */}
      <circle 
        cx="160" 
        cy="160" 
        r={radius} 
        fill="none" 
        stroke="#ff4444" 
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - (circumference * progress / 100)}
        className="transition-all duration-1000 ease-linear"
      />
    </svg>

    {/* Time Display */}
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <motion.div 
        className={`text-xl font-bold  text-gray-800`}
        key={maxTimeInSeconds}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {`${displayMin}:${displaySec}`}
      </motion.div>

    </div>
  </div>
    </div>
  );
};

const WrappedTimer = ({ player }: WrappedTimeProps) => {
  const {
    blackTimeLeft,
    whiteTimeLeft,
    currentTurn,
  } = useChessMainStore.getState()



  let maxTimeInSeconds = player === Color.WHITE ? whiteTimeLeft : blackTimeLeft;

  return (
    <div>
    
        <Timer
          maxTimeInSeconds={maxTimeInSeconds}
          incrementInSeconds={0}
          player={player}
        />

    </div>
  );
};

export default WrappedTimer;
