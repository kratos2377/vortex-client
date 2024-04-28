import { create } from "zustand";
import { Board } from "../../chess/models/Board/Board";
import { BoardFactory } from "../../chess/models/Board/BoardFactory";
import { BoardRenderer } from "../../chess/models/Board/BoardRenderer";
import { BoardStore } from "./chess_store_types";
import usePlayerStore from "./player";


const useBoardStore = create<BoardStore>((set, get) => ({
  board: new Board(),
  boardRenderer: new BoardRenderer(),
  selectedCell: null,
  setBoard: (board) => set((state) => ({ ...state, board })),
  setSelectedCell: (cell) => set((state) => ({ ...state, selectedCell: cell })),
  update: () => {
    const { boardRenderer, selectedCell, board } = get();
    const { currentPlayer } = usePlayerStore.getState();
    boardRenderer.renderCells(selectedCell, board, currentPlayer);
  },
  restartBoard: () => {
    const newBoard = new Board();
    newBoard.constructBoard();
    newBoard.defaultPieceSetup();
    set((state) => ({
      ...state,
      selectedCell: null,
      board: newBoard,
    }));
  },
  startGameFromFen: (fen) => {
    const { setCurrentPlayer } = usePlayerStore.getState();
    const newBoard = new Board();
    const factory = new BoardFactory(newBoard);
    factory.fromFEN(fen);
    setCurrentPlayer(factory.player);
    set((state) => ({
      ...state,
      selectedCell: null,
      board: newBoard,
    }));
  },
}));

export default useBoardStore;
