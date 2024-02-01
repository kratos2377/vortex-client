import { create } from 'zustand'


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
  

const useUserStore = create<UserState & UserAction>((set) => ({
    user_id: '',
    score: 0,
    token: '',
    updateUserId: (user_id) => set(() => ({user_id: user_id})),
    updateUserScore: (score) => set(() => ({score: score})),
    updateUserToken: (token) => set(() => ({token: token})),
}))

const useGameStore = create<GameState & GameAction> ((set) => ({
    game_id: '',
    lobby_id: '',
    other_player_ids: [],
    updateGameId: (game_id) => set(() => ({game_id: game_id})),
    updateLobbyId: (lobby_id) => set(() => ({lobby_id: lobby_id})),
    updateOtherPlayerIds: (other_player_ids) => set(() => ({other_player_ids: other_player_ids})),
}))