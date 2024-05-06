import { ICastlingUtils } from "../../chess/componets/types";
import { Board } from "../../chess/models/Board/Board";
import { BoardRenderer } from "../../chess/models/Board/BoardRenderer";
import { Cell } from "../../chess/models/Cell/Cell";
import { Castling } from "../../chess/models/Game/Castling";
import { GameStateCheck } from "../../chess/models/Game/GameStateCheck";
import { GameStateCheckMate } from "../../chess/models/Game/GameStateCheckMate";
import { GameStateStaleMate } from "../../chess/models/Game/GameStateStaleMate";
import { Passant } from "../../chess/models/Game/Passant";
import { PawnTransform } from "../../chess/models/Game/PawnTransform";
import { Piece } from "../../chess/models/Piece/Piece";
import { Color } from "../../types/chess_types/constants";


export interface PlayerStore {
  currentPlayer: Color;
  startingPlayerColor: Color,
  setPlayerStartingColor: (color: Color) => void;
  setCurrentPlayer: (color: Color) => void;
  passTurn: () => void;
}
export interface ChessGameState {
  helpers: boolean;
  gameCondition: string;
  takenPieces: Piece[];
  castlingBtn: boolean;
  blackTimeLeft: number;
  whiteTimeLeft: number;
  currentTurn: string;
  status: string;
  setBlackTimeLeft: (timeLeft: number) => void;
  setWhiteTimeLeft: (timeLeft: number) => void;
  setGameCurrentStatus: (status: string) => void;
  setCurrentTurn: (current: string) => void;
  setCastlingBtn: (condition: boolean) => void;
  setTakenPieces: (piece: Piece) => void;
  setGameCondition: (gameCondition: string) => void;
  toggleHelpers: (helpers: boolean) => void;
  restart: () => void;
}
export interface GameStore {
  colorInCheck: Color | null;
  colorInCheckMate: Color | null;
  colorInStaleMate: Color | null;
  check: GameStateCheck;
  checkMate: GameStateCheckMate;
  staleMate: GameStateStaleMate;
  castling: Castling;
  pawnUtils: PawnTransform;
  pawnPassant: Passant;
  castlingUtils: ICastlingUtils;
  setCastlingUtils: (castlingUtilsState: ICastlingUtils) => void;
  validateCheck: () => void;
  validateCheckMate: () => void;
  validateStaleMate: () => void;
  restartGameStore: () => void;
}
export interface BoardStore {
  board: Board;
  selectedCell: Cell | null;
  boardRenderer: BoardRenderer;
  setBoard: (Board: Board) => void;
  setSelectedCell: (cell: Cell | null) => void;
  restartBoard: () => void;
  update: () => void;
  startGameFromFen: (fen: string) => void;
}
