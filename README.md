## Vortex Client
This is a desktop client made using tauri framework. This client is used by users to play/spectate the games.

### Implemented Client Features

- **State Management:**  
  Implemented using [Zustand](https://github.com/pmndrs/zustand) for efficient and scalable state handling across the app.

- **Custom WebSocket Context:**  
  Developed a custom WebSocket context to handle three distinct channels:
  - **User Events**
  - **Player Events**
  - **Spectator Events**

- **Smooth Animations:**  
  UI animations are powered by [Framer Motion](https://www.framer.com/motion/) for a polished and responsive user experience.

## 🧩 Features

### 👥 Multiplayer Gameplay
- Play turn-based games with friends or matched players.
- Friends on your list can **spectate** your games, enhancing community engagement.

### 🎮 Game Types

- **Staked Games**  
  - Players place a bet on their victory.  
  - Spectators can also place bets within the first 5 minutes of the match.

- **Normal Games**  
  - Function exactly like staked games, but **without any monetary bets**.

### 🕹 Game Modes

- **Create a Lobby**  
  - Start a private lobby and invite friends to play.
  - Currently supports **2 players** (since only Chess is available).

- **Find a Match**  
  - Automatically match with random players.
  - **Staked players** are only matched with other staked players.

### 🔁 Replay Feature

- Rewatch completed matches at any time.

  - **Normal Games:** Restart automatically.
  - **Staked Games:** Require players to place new bets to restart.

> **Note:** Every match (including replays) is treated as a unique, separate entity.  
> Bets are evaluated independently for each instance.


## Project Demo
[Vortex Project Demo](https://drive.google.com/file/d/1lKqdKbO27KRdyTNZOglrE2yBy8Z1vdj7/view?usp=sharing)

## Project Architecture
[Architecture Design (Lucid Chart)](https://lucid.app/lucidchart/7da583bc-493c-45dc-80b7-34f6002b7646/edit?viewport_loc=-6565%2C-2146%2C8975%2C4355%2C0_0&invitationId=inv_0f90b33d-902f-4d79-b65c-6f4ab7641f46)


## Repo Links

| Codebase              |      Description          |
| :-------------------- | :-----------------------: |
| [Vortex](https://github.com/kratos2377/vortex)    |    Contains Axum APIs for Auth and other services for necessary processing |
| [Vortex-Client](https://github.com/kratos2377/vortex-client)    |  Tauri Client Used to Play/Join Games as Players or specate any games          |
| [Vortex-Mobile](github.com/kratos2377/vortex-mobile)            |      React Native App to scan QR codes and stake in the game and check status of any previous bets       |
| [Vortex-Pub-Sub](https://github.com/kratos2377/vortex-pub-sub)|  Elixir Service to broadcast realtime events to players and spectators    |
| [Vortex-Exchange](github.com/kratos2377/vortex-exchange)        |  Smart Contracts made using Anchor framework so that players/spectators can place their bets |
| [Executor-Bots](https://github.com/kratos2377/executor-bots)        |  Bots which consume game result events and settle bets for the players |
