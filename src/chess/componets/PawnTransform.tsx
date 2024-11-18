import { FC, useEffect } from "react";
import { Color, PieceIcons, PieceNames, getPieceCharFromPieceName } from "../models/Piece/types";
import { PawnTransformProps } from "./types";
import useBoardStore from "../../state/chess_store/board";
import useChessGameStore from "../../state/chess_store/game";
import { pieces } from "../../state/chess_store/initial_states/pieceForTransform";
import usePlayerStore from "../../state/chess_store/player";
import { useChessMainStore } from "../../state/UserAndGameState";
import { ChessPromotionEvent } from "../../types/game_event_model";
import { convertChessCell } from "../../helper_functions/convertChessCell";
import { GameEventPayload } from "../../types/ws_and_game_events";
import { socket } from "../../socket/socket";

const PawnTransform: FC<PawnTransformProps> = ({
  pawntransformUtils,
  setPawnTransformUtils,
  initialState,
  user_id,
  game_id
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

    let pawn_promotion_event: ChessPromotionEvent ={
      initial_cell: JSON.stringify({ x: selectedCell!.x, y: selectedCell!.y }),
      target_cell: JSON.stringify({ x: pawntransformUtils.targetCell!.x, y: pawntransformUtils.targetCell!.y }),
      promoted_to: piece.name,
      piece:  getPieceCharFromPieceName(piece.name)
    }

    let gameEvent: GameEventPayload = {
      user_id: user_id,
      game_event: JSON.stringify( pawn_promotion_event ),
      event_type: "promotion",
      game_id: game_id
    }
    socket.push("game-event" , JSON.stringify(gameEvent))
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

