# Things to get done

- [ ] Add Better Error handling for backend
- [ ] Accept/Reject friend request
- [x] Add socket events in both games
- [ ] Add Cli and spectating feature
- [x] Add Support for Sending and Checking recieved friend requests
- [x] Add by search username feature while sending friend requests
- [ ] Add rust functions for solana rpc apis
- [x] Add layer to listen to realtime events from mqtt broker and publish it to frontend
- [x] Fix profile screen and add logout feature
- [ ] Fix minor game css 
- [ ] Test everything first
- [ ] Add method to convert game moves into game events and publish it to socket
- [x] Fix zustand state stores such that we can keep track of next player
- [ ] Add a feature for spectators to stake money. (Till a specific time which should be decided by remaining time)
- [x] Add Feature in lobby screen to invite other users
- [ ] Add feature for user to be notified
- [ ] Add sounds


# Very imp
```
    I think we should create a seperate listener for all events and keep listening for all user_events instead of seperating different events for different screens it for different screens
```

## Errors
- [ ] Two API calls instead of one in many cases, look into this issue.