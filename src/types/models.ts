

export type UserModel = {
    id: string,
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    score: number,
    verified: boolean,
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
    user_game_count_id: string,
    user_id: string,
}

export type OnlineUserFriendModel = {
    user_id: string;
    username: string;
    first_name: string;
    last_name: string;
    is_user_online: boolean;
}

export type MQTTPayload = {
    message: string;
};
