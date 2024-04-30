import  React from "react";
import { interval, BehaviorSubject, of } from "rxjs";
import { map, mapTo, scan, switchMap,  takeWhile, tap } from "rxjs/operators";
import { useChessMainStore } from "../../../state/UserAndGameState";
import { useEffect, useMemo, useState } from "react";
import { Color } from "../../models/Piece/types";
import usePlayerStore from "../../../state/chess_store/player";
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
  const {currentPlayer} = usePlayerStore()
  const [timeRemaining, setTimeRemaining] =useState(
    maxTimeInSeconds * 1000
  );
  const interval$ = interval(1000).pipe(mapTo(-1000));
  const pause$ = useMemo(() => new BehaviorSubject(true), []);
  
  useEffect(() => {
    if (status === "IN PROGRESS") {
      pause$.next(currentPlayer !== player);
    }
  }, [player, currentPlayer, status, currentTurn]);
  
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

  const warningTime = maxTimeInSeconds > 60 ? 60 : 30;
  const isMyTurn = currentPlayer === player;
  return (
    <div
    className={`w-full p-[20px] ${isMyTurn && displayTime <= warningTime ? "text-white bg-red-800" : "decoration-inherit bg-inherit"}` }
    >
      {`${displayMin}:${displaySec}`}
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
    <div
    className="text-4xl w-fit p-5 text-center bg-gray-200 text-green-500 py-4"
    >
    
        <Timer
          maxTimeInSeconds={maxTimeInSeconds}
          incrementInSeconds={0}
          player={player}
        />

    </div>
  );
};

export default WrappedTimer;
