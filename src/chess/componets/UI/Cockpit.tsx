import * as React from "react";
import WrappedTimer from "./Timer";
import { Color } from "../../models/Piece/types";
import useEntryAnimate from "../../../helper_functions/useEntryAnimate";
import { useChessMainStore } from "../../../state/UserAndGameState";

const Cockpit = () => {
  const showCockpit = useEntryAnimate(500);
  const { status } = useChessMainStore()
  const isGameActive = [
    "IN PROGRESS",
    "INITIALIZING",
    "READY",
    "GAME OVER",
  ].includes(status);

  return isGameActive ? (
    <div
    className={`h-[50vh] w-[25vh] flex flex-col items-center justify-center`}
    >
      <WrappedTimer player={Color.BLACK} />
      <WrappedTimer player={Color.WHITE} />
    </div>
  ) : null;
};

export default Cockpit;
