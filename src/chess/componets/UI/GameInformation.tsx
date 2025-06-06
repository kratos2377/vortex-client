import { FC } from "react";
import GameStates from "./GameStates";
import { Color } from "../../models/Piece/types";
import TakenPieces from "./TakenPieces";

const GameInformation: FC = () => {

  return (
    <>

      {/* <div className="game-states">
        <GameStates />
      </div> */}

      <TakenPieces color={Color.WHITE} />
      <TakenPieces color={Color.BLACK} />
    </>
  );
};

export default GameInformation;
