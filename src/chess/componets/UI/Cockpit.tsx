import * as React from "react";
import WrappedTimer from "./Timer";
import { Color } from "../../models/Piece/types";
import useEntryAnimate from "../../../helper_functions/useEntryAnimate";
import { useChessMainStore } from "../../../state/UserAndGameState";

const Cockpit = () => {
  const showCockpit = useEntryAnimate(500);
  const { status } = useChessMainStore.getState()

  const isGameActive = [
    "IN PROGRESS",
    "INITIALIZING",
    "READY",
    "GAME OVER",
  ].includes(status);

  return isGameActive ? (
    <div
    className={`h-screen py-5 
      max-h-full w-1/2 flex flex-col justify-between border border-gray-300 opacity-1  }`}
    >
      <WrappedTimer player={Color.BLACK} />
      <WrappedTimer player={Color.WHITE} />
    </div>
  ) : null;
};

export default Cockpit;
