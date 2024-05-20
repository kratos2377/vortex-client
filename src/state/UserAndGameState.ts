import { create } from 'zustand'
import { ChessGameState } from './chess_store/chess_store_types'
import { ChessStates, Color } from '../types/chess_types/constants'
import useBoardStore from './chess_store/board'
import usePlayerStore from './chess_store/player'
import useChessGameStore from './chess_store/game'
import { CanvasState } from './scribble_store/canvasStore'
import { FriendRequestModel, GameInviteUserModel, UserModel } from '../types/models'

type UserState  = {
    user_id: string,
    score: number,
    token: string,
    user_details: UserModel,
    game_invites: GameInviteUserModel[],
    friend_invites: FriendRequestModel[]
}

type GameState = {
    game_id: string,
    lobby_id: string,
    player_turn_id: string,
    other_player_ids: string[],
}

type UserAction = {
    updateUserId: (user_id: string) => void
    updateUserScore: (score: number) => void
    updateUserToken: (token: string) => void
    updateUserDetails: (user_mod: UserModel) => void
    updateUserVerifiedStatus: (user_status: boolean) => void
    changeUserUsername: (username: string) => void
    addGameInviteModel: (game_invite: GameInviteUserModel) => void
    removeGameInviteModel: (game_invite_id: string) => void
    addFriendRequestModel: (friend_req: FriendRequestModel) => void
    removeFriendRequestModel: (friend_req_id: string) => void
    resetUserModelState: () => void
  }

  type GameAction =  {
    updateGameId: (game_id: string) => void
    updateLobbyId: (lobby_id: string) => void
    updateOtherPlayerIds: (other_player_ids: string[]) => void
  }
  

export const useUserStore = create<UserState & UserAction>((set) => ({
    user_id: '',
    user_details: {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      id: '',
      score: 0,
      verified: false
    },
    score: 0,
    token: '',
    game_invites: [],
    friend_invites: [],
    updateUserId: (user_id) => set((state) => ({...state , user_id: user_id})),
    updateUserScore: (score) => set((state) => ({...state, score: score})),
    updateUserToken: (token) => set((state) => ({...state, token: token})),
    updateUserDetails: (user_mod) => set((state) => ({...state , user_details: user_mod})),
    updateUserVerifiedStatus: (user_status) => set((state) => ({...state, user_details: { ...state.user_details , verified: user_status}})),
    addGameInviteModel: (game_invite) => set((state) => ({...state, game_invites: [game_invite, ...state.game_invites]})),
    removeGameInviteModel: (game_invite_id) => set((state) => ({...state, game_invites: state.game_invites.filter((ele) => ele.game_id !== game_invite_id)})),
    addFriendRequestModel: (friend_req) => set((state) => ({...state, friend_invites: [...state.friend_invites, friend_req]})),
    removeFriendRequestModel: (friend_req_id) => set((state)  => ({...state, friend_invites: state.friend_invites.filter((ele) => ele.friend_request_id !== friend_req_id)})),
    changeUserUsername: (username) => set((state) => ({...state, user_details: {...state.user_details , username: username}})),
    resetUserModelState: () => set((state) => ({...state, user_details:  {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      id: '',
      score: 0,
      verified: false
    }}))
}))

export const useGameStore = create<GameState & GameAction> ((set) => ({
    game_id: '',
    lobby_id: '',
    player_turn_id: '0',
    other_player_ids: [],
    updateGameId: (game_id) => set((state) => ({...state, game_id: game_id})),
    updateLobbyId: (lobby_id) => set((state) => ({...state, lobby_id: lobby_id})),
    updateOtherPlayerIds: (other_player_ids) => set((state) => ({ ...state , other_player_ids: other_player_ids})),
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
    status: ChessStates.NOT_STARTED,
    movesHistory: [],
    setMovesHistory: (chessMove) => {
      set((state) => ({...state, movesHistory: [...state.movesHistory , chessMove]}))
    },
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
