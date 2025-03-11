import * as React from "react";
import WrappedTimer from "./Timer";
import { Color } from "../../models/Piece/types";
import useEntryAnimate from "../../../helper_functions/useEntryAnimate";
import { useChessMainStore, useGameStore } from "../../../state/UserAndGameState";
import PlayerCard from "./PlayerCard";

const PlayersInfoCockPit = () => {
    const {player_turns_order} = useGameStore()
  const { status } = useChessMainStore()
  const isGameActive = [
    "IN-PROGRESS",
    "INITIALIZING",
    "READY",
    "GAME OVER",
  ].includes(status);

  return isGameActive ? (
    <div
    className={`h-[20vh] w-[20vh] flex flex-col items-center justify-center`}
    >
      <PlayerCard username={player_turns_order[1].username} color={Color.BLACK}/>
      <PlayerCard  username={player_turns_order[0].username} color={Color.WHITE}/>
    </div>
  ) : null;
};

export default PlayersInfoCockPit;
