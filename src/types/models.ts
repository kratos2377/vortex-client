

export type UserModel = {
    id: string,
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    score: number,
    verified: boolean,
}

export type UserGameRelation = {
     user_id: string,
     username: string,
     game_id: string,
     player_type: string,
     player_status: string,
}

export type GameModel = {
    game_id: string,
    game_type: string,
    is_staked: boolean,
    total_money_staked: number | null,
    game_image_url: string | null | undefined
    usernames_playing: string[] | null | undefined
}

export type FriendRequestModel = {
    friend_request_id: string,
    user_who_send_request_id: string,
    user_who_send_request_username: string,
    user_who_we_are_sending_event: string,
}

export type GameInviteUserModel = {
    game_id: string,
    user_id: string;
    username: string;
    game_name: string;
    game_type: string;
}


export type PlayerModel = {
    player_user_id: string,
    player_first_name: string,
    player_last_name: string,
    player_username: string,
    player_turn_count: string,

}

export type PlayerTurnMappingModel = {
    game_id: string,
    turn_mappings: TurnModel[]
}

export type OnlineUserFriendModel = {
    user_id: string;
    username: string;
    first_name: string;
    last_name: string;
    is_user_online: boolean;
}

export type TurnModel = {
     count_id: number,
     user_id: string,
     username: string,
}

export type UserGameEvent = {
     id: string,
     version: number, 
     name: string,
     description: string,
     userGameMove: UserGameMove,
}


export type UserGameMove  = {
     id: string,
     userId: string,
     gameId: string,
     version: number,
     moveType: string,
     userMove: string,
     socketId: string,
}



export type MQTTPayload = {
    message: string;
};


export const getGameImageUrl = (game_type: string) => {
    if (game_type.toLocaleLowerCase() === "chess") {
        return "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }

    if (game_type.toLocaleLowerCase() === "scribble") {
        return "https://images.unsplash.com/photo-1532483578477-e81e1513c3a7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }

    return "https://plus.unsplash.com/premium_photo-1671683371907-c70593326032?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
}