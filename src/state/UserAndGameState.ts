import { create } from 'zustand'
import { ChessGameState } from './chess_store/chess_store_types'
import { ChessStates, Color } from '../types/chess_types/constants'
import useBoardStore from './chess_store/board'
import usePlayerStore from './chess_store/player'
import useChessGameStore from './chess_store/game'
import { CanvasState } from './scribble_store/canvasStore'
import { subscribeWithSelector } from 'zustand/middleware';
import { FriendRequestModel, GameInviteUserModel, PlayerModel, PlayerTurnMappingModel, TurnModel, UserModel } from '../types/models'

type UserState  = {
    user_id: string,
    score: number,
    is_matchmaking_in_progress: boolean,
    token: string,
    in_game: boolean,
    user_details: UserModel,
    game_invites: GameInviteUserModel[],
    friend_invites: FriendRequestModel[]
}

type GameState = {
    game_id: string,
    game_type: string,
    game_name: string,
    user_player_count_id: string,
    game_players: PlayerModel[],
    isSpectator: boolean,
    player_turns_order: TurnModel[],
    current_player_turn: string,
    total_players: number,
    index_turn: number,

    // Game States
    chess_state: string,
}

type MatchState = {
  opponent_user_id: string,
  opponent_username: string
}

// type SpectatorState = {
//     game_id: string,
//     game_name: string,
//     game_type: string,
//     game_players: PlayerModel[],
//     player_turns_order: PlayerTurnMappingModel | null,
//     current_player_turn: string,
//     total_players: number,
//     index_turn: number,
// }



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
    update_in_game_status: (status: boolean) => void
    changeIsMatchmaking: (matchmaking_status: boolean) => void
    resetUserModelState: () => void
  }

  type GameAction =  {
    updateGameId: (game_id: string) => void
    updateGameType: (type: string) => void
    updateGameName: (name: string) => void
    addGamePlayers: (player: PlayerModel) => void
    addMultiplePlayers: (player: PlayerModel[]) => void,
    updatePlayerTurnModel: (player_turn_model: TurnModel) => void,
    updateUserPlayerCountId: (count_id: string) => void,
    updateCurrentPlayerTurn: (current_player: string) => void
    updateTotalPlayers: (total_player: number) => void
    updateIndexTurn: (index_turn: number) => void
    removeGamePlayer: (player: String) => void
    updateIsSpectator: (spectator_status: boolean) => void
    resetPlayerTurnModel: () => void
    //Game states function
    updateChessState: (state: string) => void,
    resetGameState: () => void
  }

  type MatchAction = {
    updateOpponentUserId: (opponent_user_id: string) => void
    updateOpponentUsername: (opponent_username: string) => void
  }


  // type SpectatorAction = {
  //   updateGameId: (game_id: string) => void
  //   updateGameType: (type: string) => void
  //   updateGameName: (name: string) => void
  //   addGamePlayers: (player: PlayerModel) => void
  //   updatePlayerTurnModel: (player_mapping: PlayerTurnMappingModel) => void,
  //   updateCurrentPlayerTurn: (current_player: string) => void
  //   updateTotalPlayers: (total_player: number) => void
  //   updateIndexTurn: (index_turn: number) => void
  //   removeGamePlayer: (player: PlayerModel) => void
  // }
  
  

export const useUserStore = create<UserState & UserAction>()(subscribeWithSelector((set) => ({
    user_id: '',
    is_matchmaking_in_progress: false,
    in_game: false,
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
    update_in_game_status: (status) => set((state) => ({...state, in_game: status})),
    changeIsMatchmaking: (matchmaking_status) => set((state) => ({...state , is_matchmaking_in_progress: matchmaking_status})),
    resetUserModelState: () => set((state) => ({...state, user_details:  {
      username: '',
      email: '',
      first_name: '',
      is_matchmaking_in_progress: false,
      last_name: '',
      id: '',
      score: 0,
      verified: false
    }}))
})))

export const useGameStore = create<GameState & GameAction> ((set) => ({
    game_id: '',
    game_name: '',
    game_type: '',
    user_player_count_id: '',
    game_players: [],
    player_turns_order: [],
    current_player_turn: '',
    isSpectator: false,
    total_players: 2,
    index_turn: 0,
    chess_state: '',
    updateGameId: (game_id) => set((state) => ({...state, game_id: game_id})),
    updateGameType: (type) => set((state) => ({...state, game_type: type})),
    updateGameName: (name) => set((state) => ({...state, game_name: name})),
    updatePlayerTurnModel: (player_turn_model) => set((state) => {
      const updatedTurns = [...state.player_turns_order, player_turn_model];
  
      // Then sort this array by count_id
      const sortedTurns = updatedTurns.sort((a, b) => a.count_id - b.count_id);
      
     return {...state, player_turns_order: sortedTurns}
    
    
    }),
    updateUserPlayerCountId: (count_id) => set((state) => ({...state, user_player_count_id: count_id })),
    addGamePlayers: (player) => set((state) => ({...state, game_players: [...state.game_players, player]})),
    updateCurrentPlayerTurn: (current_player) => set((state) => ({...state, current_player_turn: current_player})),
    updateTotalPlayers: (total_player) => set((state) => ({...state, total_players: total_player})),
    updateIndexTurn: (index_turn) => set((state) => ({...state, index_turn: (index_turn+ 1)%(state.total_players)})),
    updateIsSpectator: (specator_status) => set((state) => ({...state, isSpectator: specator_status})),
    removeGamePlayer: (player) => set((state) => {
      const updatedTurns =  state.player_turns_order.filter((el) => el.user_id !== player)
  
      // Then sort this array by count_id
      const sortedTurns = updatedTurns.sort((a, b) => a.count_id - b.count_id);
      
     return {...state,  player_turns_order: sortedTurns }
    
    
    }),
    resetPlayerTurnModel: () => set((state) => ({...state , player_turns_order: []})),
    updateChessState: (chess_state) => set((state) => ({...state, chess_state: chess_state })),
    addMultiplePlayers: (players) => set((state) => ({...state, game_players: [...players] })),
    resetGameState: () => set((state) => ({
      game_id: '',
      game_name: '',
      game_type: '',
      user_player_count_id: '',
      game_players: [],
      player_turns_order: [],
      current_player_turn: '',
      isSpectator: false,
      total_players: 0,
      index_turn: 0,
      chess_state: ''
    }))
  }))


  export const useMatchStore = create<MatchState & MatchAction> ((set) => ({
    opponent_user_id: '',
    opponent_username: '',
    updateOpponentUserId: (opponent_user_id) => set((state) => ({...state, opponent_user_id: opponent_user_id})),
    updateOpponentUsername: (opponent_username) => set((state) => ({...state, opponent_username: opponent_username}))
  }))

// export const useSpectatorStore = create<SpectatorState & SpectatorAction> ((set) => ({
//   game_id: '',
//   game_name: '',
//   game_type: '',
//   game_players: [],
//   player_turns_order: null,
//   current_player_turn: '',
//   total_players: 0,
//   index_turn: 0,
//   updateGameId: (game_id) => set((state) => ({...state, game_id: game_id})),
//   updateGameType: (type) => set((state) => ({...state, game_type: type})),
//   updateGameName: (name) => set((state) => ({...state, game_name: name})),
//   updatePlayerTurnModel: (player_turn) => set((state) => ({...state, player_turns_order: player_turn})),
//   addGamePlayers: (player) => set((state) => ({...state, game_players: [...state.game_players, player]})),
//   updateCurrentPlayerTurn: (current_player) => set((state) => ({...state, current_player_turn: current_player})),
//   updateTotalPlayers: (total_player) => set((state) => ({...state, total_players: total_player})),
//   updateIndexTurn: (index_turn) => set((state) => ({...state, index_turn: (index_turn+ 1)%(state.total_players)})),
//   removeGamePlayer: (player) => set((state) => ({...state,  player_turns_order:  { game_id: state.player_turns_order!.game_id , turn_mappings: state.player_turns_order!.turn_mappings.filter((el) => el.user_id !== player.player_user_id)} }))
// }))



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
