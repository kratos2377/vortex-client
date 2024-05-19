

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