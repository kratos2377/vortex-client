import { GameEventPayload } from "../types/ws_and_game_events"


interface ConvertToGameEventProps {
    game_name: string,
    game_event: string,
    game_id: string,
    user_id: string,
    additional: string
}

export const convertGameEventForSocket = ( {game_event , game_name, game_id, user_id , additional}: ConvertToGameEventProps ) => {
    let gameEventPayload: GameEventPayload = {
        user_id: user_id,
        game_event: JSON.stringify(  {  game_event , game_name , additional }),
        game_id: game_id
    } 
    return gameEventPayload


}


export const convertStringToGameEvent = (game_socket_payload: string) => {
        let gameEventRecievedPayload: GameEventPayload = JSON.parse(game_socket_payload)
        return gameEventRecievedPayload

}