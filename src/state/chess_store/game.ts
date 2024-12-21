import { create } from "zustand";
import { Castling } from "../../chess/models/Game/Castling";
import { GameStateCheck } from "../../chess/models/Game/GameStateCheck";
import { GameStateCheckMate } from "../../chess/models/Game/GameStateCheckMate";
import { GameStateStaleMate } from "../../chess/models/Game/GameStateStaleMate";
import { Passant } from "../../chess/models/Game/Passant";
import { PawnTransform } from "../../chess/models/Game/PawnTransform";
import useBoardStore from "./board";
import { GameStore } from "./chess_store_types";
import usePlayerStore from "./player";
import { opposite } from "../../helper_functions/getChessOpponentColor";
import { initialCastlingState } from "./initial_states/castlingUtils";
import { subscribeWithSelector } from "zustand/middleware";


const useChessGameStore = create<GameStore>()(subscribeWithSelector((set) => {
  return {
    check: new GameStateCheck(),
    checkMate: new GameStateCheckMate(),
    staleMate: new GameStateStaleMate(),
    castling: new Castling(),
    pawnPassant: new Passant(),
    pawnUtils: new PawnTransform(),
    colorInCheck: null,
    colorInCheckMate: null,
    colorInStaleMate: null,
    castlingUtils: initialCastlingState,
    setCastlingUtils: (castlingUtilsState) =>
      set((state) => ({ ...state, castlingUtils: { ...castlingUtilsState } })),
    validateCheck: () => {
      const { board } = useBoardStore.getState();
      const { currentPlayer } = usePlayerStore.getState();
      set((state) => ({
        ...state,
        colorInCheck: state.check.getColorInCheck(board, currentPlayer, opposite(currentPlayer)),
      }));
    },
    validateCheckMate: () => {
      const { board } = useBoardStore.getState();
      const { currentPlayer } = usePlayerStore.getState();
      set((state) => ({
        ...state,
        colorInCheckMate: state.checkMate.isCheckMate(board, currentPlayer, opposite(currentPlayer)),
      }));
    },
    validateStaleMate: () => {
      const { board } = useBoardStore.getState();
      const { currentPlayer } = usePlayerStore.getState();
      set((state) => ({
        ...state,
        colorInStaleMate: state.staleMate.isStaleMate(board, currentPlayer),
      }));
    },
    restartGameStore: () => {
      set((state) => ({
        ...state,
        colorInCheck: null,
        colorInCheckMate: null,
        colorInStaleMate: null,
        castlingUtils: initialCastlingState,
      }));
    },
  };
}));

export default useChessGameStore;
