import { FC } from "react";
import { Color, PieceIcons, PieceNames } from "../models/Piece/types";
import { PawnTransformProps } from "./types";
import useBoardStore from "../../state/chess_store/board";
import useChessGameStore from "../../state/chess_store/game";
import { pieces } from "../../state/chess_store/initial_states/pieceForTransform";
import usePlayerStore from "../../state/chess_store/player";
import { useChessMainStore } from "../../state/UserAndGameState";

const PawnTransform: FC<PawnTransformProps> = ({
  pawntransformUtils,
  setPawnTransformUtils,
  initialState,
}) => {
  const { currentPlayer, passTurn } = usePlayerStore();
  const { pawnUtils, validateCheck } = useChessGameStore();
  const { selectedCell, update } = useBoardStore();
  const { setTakenPieces } = useChessMainStore();

  const pawnTransform = (piece: { name: PieceNames; icon: PieceIcons }): void => {
    setTakenPieces(pawntransformUtils!.targetCell!.piece!);
    pawnUtils.transform(selectedCell!, pawntransformUtils.targetCell!, piece.name, currentPlayer);
    update();
    validateCheck();
    passTurn();
    setPawnTransformUtils(initialState);
  };

  if (!pawntransformUtils.visible) return null;

  return (
    <div
      className="chose-piece-container"
      style={{
        top: currentPlayer === Color.WHITE ? 20 : "auto",
        bottom: currentPlayer === Color.BLACK ? 20 : "auto",
      }}
    >
      {pieces.map((piece) => (
        <div key={piece.name} onClick={() => pawnTransform(piece)}>
          {piece.icon}
        </div>
      ))}
    </div>
  );
};

export default PawnTransform;

