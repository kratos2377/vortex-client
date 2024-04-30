import * as React from "react";
import WrappedTimer from "./Timer";
import MoveHistory from "./MoveHistory";
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
    className={`border border-gray-300
    transition duration-400 ease-in-out hidden h-full flex flex-col justify-between w-full}`}
    >
      <WrappedTimer player={Color.BLACK} />
      {/* <MoveHistory /> */}
      <WrappedTimer player={Color.WHITE} />
    </div>
  ) : null;
};

export default Cockpit;
