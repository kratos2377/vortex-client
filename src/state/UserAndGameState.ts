import { create } from 'zustand'
import { ChessGameState } from './chess_store/chess_store_types'
import { ChessStates, Color } from '../types/chess_types/constants'
import useBoardStore from './chess_store/board'
import usePlayerStore from './chess_store/player'
import useChessGameStore from './chess_store/game'
import { CanvasState } from './scribble_store/canvasStore'

type UserState  = {
    user_id: string,
    score: number,
    token: string,

}

type GameState = {
    game_id: string,
    lobby_id: string,
    other_player_ids: string[]
}

type UserAction = {
    updateUserId: (user_id: UserState['user_id']) => void
    updateUserScore: (score: UserState['score']) => void
    updateUserToken: (token: UserState['token']) => void
   
  }

  type GameAction =  {
    updateGameId: (game_id: GameState['game_id']) => void
    updateLobbyId: (lobby_id: GameState['lobby_id']) => void
    updateOtherPlayerIds: (other_player_ids: GameState['other_player_ids']) => void
  }
  

interface ChessGameActions {

}

const useUserStore = create<UserState & UserAction>((set) => ({
    user_id: '',
    score: 0,
    token: '',
    updateUserId: (user_id) => set(() => ({user_id: user_id})),
    updateUserScore: (score) => set(() => ({score: score})),
    updateUserToken: (token) => set(() => ({token: token})),
}))

const useUserGameStore = create<GameState & GameAction> ((set) => ({
    game_id: '',
    lobby_id: '',
    other_player_ids: [],
    updateGameId: (game_id) => set(() => ({game_id: game_id})),
    updateLobbyId: (lobby_id) => set(() => ({lobby_id: lobby_id})),
    updateOtherPlayerIds: (other_player_ids) => set(() => ({other_player_ids: other_player_ids})),
}))



export const useChessMainStore = create<ChessGameState>((set) => {
  return {
    helpers: true,
    gameCondition: "",
    takenPieces: [],
    castlingBtn: true,
    blackTimeLeft: 900,
    whiteTimeLeft: 900,
    currentTurn: Color.WHITE,
    status: ChessStates.NOT_STARTED ,
    setBlackTimeLeft: (timeLeft) => {
      set((state) => ({...state , blackTimeLeft: timeLeft }))
    },
    setWhiteTimeLeft: (timeLeft) => {
      set((state) => ({...state , whiteTimeLeft: timeLeft }))
    },
    setCurrentTurn: (turn) => {
      set((state) => ({...state , currentTurn: turn }))
    },
    setGameCurrentStatus: (status) => {
      set((state) => ({...state , status: status }))
    },
    setCastlingBtn: (condition) => {
      set((state) => ({ ...state, castlingBtn: condition }));
    },
    setTakenPieces: (piece) => {
      set((state) => ({
        ...state,
        takenPieces: [...state.takenPieces, piece],
      }));
    },
    toggleHelpers: (helpers) => set((state) => ({ ...state, helpers })),
    setGameCondition: (gameCondition) => set((state) => ({ ...state, gameCondition })),
    restart: () => {
      set((state) => ({
        ...state,
        helpers: true,
        takenPieces: [],
      }));
      const { restartBoard } = useBoardStore.getState();
      const { setCurrentPlayer } = usePlayerStore.getState();
      const { restartGameStore } = useChessGameStore.getState();
      setCurrentPlayer(Color.WHITE);
      restartBoard();
      restartGameStore();
    },
  };
});

export const useCanvasStore = create<CanvasState>(set => ({
  strokeColor: '#000',
  strokeWidth: [3],
  dashGap: [1],
  setStrokeColor: strokeColor => set({ strokeColor }),
  setStrokeWidth: strokeWidth => set({ strokeWidth }),
  setDashGap: dashGap => set({ dashGap }),
}))
