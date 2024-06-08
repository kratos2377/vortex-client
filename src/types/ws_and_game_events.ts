

export type GameEvent = {
    game_type: string,
    event: string,
    additional: string,
}

export type GameEventPayload = {
     user_id: string;
     game_event: string;
     event_type: string; // Can be normal, promotion, checkmate in case of chess, just normal undo, erase or draw in case of scribble. Will have to add it in backend as well from proper use
     game_id: string;
}

export type UserConnectionEventPayload = {
    user_id: string,
    username: string,
}

export type JoinedRoomPayload = {
    user_id: string,
    username: string,
    game_id: string,
}

export type LeavedRoomPayload = {
    user_id: string,
    username: string,
    game_id: string,
}


export type GameStartPayload = {
    admin_id: string,
    game_name: string,
    game_id: string
}

export type GameMessagePayload = {
    user_id: string,
    username: string,
    message: string,
    game_id: string
}