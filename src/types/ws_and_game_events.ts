import { Cell } from "../chess/models/Cell/Cell";


export type GameEvent = {
    game_type: Object,
    event: Object,
    additional: Object,
}


export type ChessCoordinateStruct = {
    x: number,
    y: number
}

export type GameEventPayload = {
     user_id: Object;
     game_event: Object;
     event_type: Object; // Can be normal, promotion, checkmate in case of chess, just normal undo, erase or draw in case of scribble. Will have to add it in backend as well from proper use
     game_id: Object;
}

export type UserConnectionEventPayload = {
    user_id: Object,
    username: Object,
}

export type JoinedRoomPayload = {
    user_id: Object,
    username: Object,
    game_id: Object,
}

export type LeavedRoomPayload = {
    user_id: Object,
    username: Object,
    game_id: Object,
}


export type GameStartPayload = {
    admin_id: Object,
    game_name: Object,
    game_id: Object
}

export type GameMessagePayload = {
    user_id: Object,
    username: Object,
    message: Object,
    game_id: Object
}