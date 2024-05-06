import { create } from "zustand";
import { Color } from "../../types/chess_types/constants";
import { PlayerStore } from "./chess_store_types";
import { opposite } from "../../helper_functions/getChessOpponentColor";


const usePlayerStore = create<PlayerStore>((set) => ({
  startingPlayerColor: Color.WHITE,
  currentPlayer: Color.WHITE,
  setPlayerStartingColor: (color) => set((state) => ({...state , startingPlayerColor: color})),
  setCurrentPlayer: (color) => set((state) => ({ ...state, currentPlayer: color })),
  passTurn: () =>
    set((state) => ({
      ...state,
      currentPlayer: opposite(state.currentPlayer!),
    })),
}));

export default usePlayerStore;
