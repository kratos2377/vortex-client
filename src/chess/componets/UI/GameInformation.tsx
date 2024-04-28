import { FC } from "react";
import GameStates from "./GameStates";
import Helpers from "./Helpers";
import CastlingComponent from "../CastlingComponent";
import { Color } from "../../models/Piece/types";
import TakenPieces from "./TakenPieces";
import FenForm from "./FenForm";
import { useChessMainStore } from "../../../state/UserAndGameState";

const GameInformation: FC = () => {
  const { restart } = useChessMainStore();

  return (
    <>
      <div className="game-controls">
        <FenForm />
        <Helpers />
        <button onClick={() => restart()}>Restart</button>
        <CastlingComponent />
      </div>

      <div className="game-states">
        <GameStates />
      </div>

      <TakenPieces color={Color.WHITE} />
      <TakenPieces color={Color.BLACK} />
    </>
  );
};

export default GameInformation;
