import { FC } from "react";
import GameStates from "./GameStates";
import Helpers from "./Helpers";
import CastlingComponent from "../CastlingComponent";
import { Color } from "../../models/Piece/types";
import TakenPieces from "./TakenPieces";
import { useChessMainStore } from "../../../state/UserAndGameState";

const GameInformation: FC = () => {
  const { restart } = useChessMainStore();

  return (
    <>

      <div className="game-states">
        <GameStates />
      </div>

      <TakenPieces color={Color.WHITE} />
      <TakenPieces color={Color.BLACK} />
    </>
  );
};

export default GameInformation;
