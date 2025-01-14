import { useEffect, useState } from "react";
import { useChessMainStore } from "../state/UserAndGameState";
/**
 * useEntryAnimate - Nice little hook for animating things when a game begins. Different things need
 * to appear at different times, so this handles that.
 *
 */
const useEntryAnimate = (delay: number) => {
  const [showThing, setShowThing] = useState<boolean>(false);
  const gameStatus = useChessMainStore.getState().status

  const isGameActive = [
    "IN-PROGRESS",
    "INITIALIZING",
    "READY",
    "OVER",
  ].includes(gameStatus);

  useEffect(() => {
    const timeout = isGameActive ? delay : 0;
    setTimeout(() => setShowThing(isGameActive), timeout);
  }, [isGameActive]);

  return showThing;
};

export default useEntryAnimate;
