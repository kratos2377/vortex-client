import { FC, useContext, useEffect, useState } from "react";
import { Cell } from "../models/Cell/Cell";
import CellComponent from "./CellComponent";
import { opposite } from "../../helper_functions/getChessOpponentColor";
import useBoardStore from "../../state/chess_store/board";
import useChessGameStore from "../../state/chess_store/game";
import usePlayerStore from "../../state/chess_store/player";
import { King } from "../models/Piece/King";
import PawnTransform from "./PawnTransform";
import { IPawnTransformUtils } from "./types";
import { useChessMainStore, useGameStore, useUserStore } from "../../state/UserAndGameState";
import { initialCastlingState } from "../../state/chess_store/initial_states/castlingUtils";
import { rankCoordinates } from "../../state/chess_store/initial_states/rankCoordinates";
import { Color } from "../../types/chess_types/constants";
import { ChessCoordinateStruct, GameEventPayload } from "../../types/ws_and_game_events";
import { ChessNormalEvent, ChessPromotionEvent } from "../../types/game_event_model";
import { PieceChar, getPieceCharFromPieceName, getPieceNameFromPieceChar } from "../models/Piece/types";
import {  USER_GAME_MOVE } from "../../utils/mqtt_event_names";
import { WebSocketContext } from "../../socket/websocket_provider";
import GameOverModal from "./UI/GameOverModal";
import { of } from "rxjs";
import DefaultUserWinModal from "./UI/DefaultUserWinModal";
import GameOverStalemateModal from "./UI/GameOverStalemateModal";
import { useNavigate } from "react-router-dom";


interface BoardComponentProps {
  game_id: string,
  user_id: string
}

const BoardComponent = ({game_id , user_id}:BoardComponentProps) => {
  const {chann , spectatorChannel} = useContext(WebSocketContext)
  const initialState: IPawnTransformUtils = { visible: false, targetCell: null };
  const { update, board, selectedCell, setSelectedCell } = useBoardStore();
  const { currentPlayer, passTurn , startingPlayerColor , player_color} = usePlayerStore();
  const {
    pawnPassant,
    setCastlingUtils,
    colorInCheck,
    check,
    pawnUtils,
    validateCheck,
    validateCheckMate,
    validateStaleMate,
    colorInStaleMate,
    colorInCheckMate,
  } = useChessGameStore();

const navigate = useNavigate();
  const {user_details} = useUserStore()
  const gameStore = useGameStore()
  const { currentTurn , setGameCondition, setTakenPieces, setCastlingBtn, setCurrentTurn , setMovesHistory, setGameCurrentStatus , restart } = useChessMainStore();
  const [pawnTransformUtils, setPawnTransformUtils] = useState<IPawnTransformUtils>(initialState);
  const [passantAvailable, setPassantAvailable] = useState<boolean>(false);
  const [firstRender, setFirstRender] = useState<boolean>(true);

  const [winner_username , setWinnerUsername] = useState("")
  const [winner_user_id , setWinnerUserId] = useState("")
  const [loser_username , setLoserUsername] = useState("")
  const [loser_user_id , setLoserUserId] = useState("")


  //Default User Win States
  const [user_username_who_won , setUserUsernameWhoWon] = useState("")
  const [user_id_who_won , setUserIdWhoWon] = useState("")
  const [user_id_who_left , setUserIdWhoLeft] = useState("")
  const [user_username_who_left , setUserUsernameWhoLeft] = useState("")

  //General purpose states
  const [generalPurposeMessage, setGeneralPurposeMessage] = useState("")
  const [generalPurposeTitle, setGeneralPurposeTitle] = useState("")

  const clickHandler = (cell: Cell): void => {
    if (gameStore.isSpectator) 
        return;

    if (player_color !== currentPlayer)
        return;

    if (colorInCheckMate || colorInStaleMate) return;
 
    if (currentPlayer === cell?.piece?.color) {
      setSelectedCell(cell);

      resetPassantCells();
      const canPassant = pawnPassant.canPassant(currentPlayer, cell, board);
      if (canPassant) {
        setPassantAvailable(true);
        pawnPassant.makePassantAvailable(board, currentPlayer, cell);
      }
    }

    if (cell.availableToMove && selectedCell !== cell) {

      if (cell.piece instanceof King) return;

      if (cell.availableToPassant) {
        const pieceGetByPassant = pawnPassant.getPawnByPassant(cell, selectedCell!, board);
        setTakenPieces(pieceGetByPassant!);
      }

      if (!colorInCheck && pawnUtils.isPawnOnLastLine(currentPlayer, selectedCell!, cell)){
        setPawnTransformUtils({ ...pawnTransformUtils, visible: true, targetCell: cell });
      }
       

      else {
        isCheck(cell);


        let normal_chess_event: ChessNormalEvent = {
          initial_cell: JSON.stringify({ x: selectedCell!.x, y: selectedCell!.y }),
          target_cell: JSON.stringify({ x: cell!.x, y: cell!.y }),
          piece: getPieceCharFromPieceName(selectedCell!.piece?.name!)
        }
        let gameEvent: GameEventPayload = {
          user_id: user_id,
          game_event: JSON.stringify( normal_chess_event ),
          event_type: "normal",
          game_id: game_id
        }


        chann?.push("game-event" , gameEvent)
      }

      resetPassantCells();

    //  setMovesHistory( {  cellString: convertChessCell(cell), moveType: "normal" })

      // if (!pawnTransformUtils.visible) { 
   
       
      // }
      
    }
  };
  const isCheck = (cell: Cell): void => {
    if (useGameStore.getState().isSpectator)
      return;

    const isCheckOnClone = check.isCheckOnClone(
      selectedCell as Cell,
      board,
      cell,
      currentPlayer,
      opposite(currentPlayer)
    );
    if (isCheckOnClone) {
      const message = colorInCheck ? "Protect your king" : "Invalid Move, Your King will be in danger";
      setGameCondition(message);
      setTimeout(() => setGameCondition(""), 3000);
    } else {
      if (cell.piece) setTakenPieces(cell.piece);
      selectedCell?.movePiece(cell);
      validateCheck();
      setCurrentTurn(currentTurn === Color.WHITE ? Color.BLACK : Color.WHITE)
      passTurn();
      setSelectedCell(null);
    }
  };

  const isCheckFromSocketMove = (init_cell: Cell, target_cell: Cell): void => {

    const isCheckOnClone = check.isCheckOnClone(
      init_cell as Cell,
      board,
      target_cell,
      currentPlayer,
      opposite(currentPlayer)
    );
    if (isCheckOnClone) {
      const message = colorInCheck ? "Protect your king" : "Invalid Move, Your King will be in danger";
      setGameCondition(message);
      setTimeout(() => setGameCondition(""), 3000);
    } else {
      if (target_cell.piece) setTakenPieces(target_cell.piece);
      init_cell?.movePiece(target_cell);
      validateCheck();
      setCurrentTurn(currentTurn === Color.WHITE ? Color.BLACK : Color.WHITE)
      passTurn();
      setSelectedCell(null);
    }
  };

  const resetPassantCells = (): void => {
    if (passantAvailable) pawnPassant.resetPassantCells(board);
  };

  useEffect(() => {
    if (useGameStore.getState().isSpectator)
      return;

    if (!firstRender) {
      if (colorInCheck) validateCheckMate();
      else validateStaleMate();
    }
    setCastlingUtils(initialCastlingState);
    setSelectedCell(null);
    setCastlingBtn(true);
    setFirstRender(false);
  }, [currentPlayer]);

  useEffect(() => {
    update();
    setPawnTransformUtils(initialState);
  }, [selectedCell]);

  useEffect(() => {
    if (gameStore.isSpectator)
      return;
    
    chann?.on("send-user-game-event" , (data) => {

      
         
      if(data.user_id !== user_details.id) {

        if (data.event_type === "normal") {
          let game_move = JSON.parse(data.game_event)

          let init_pos = JSON.parse(game_move.initial_cell) 
          let target_pos = JSON.parse(game_move.target_cell ) 
          let init_cell = board.getCell(init_pos.x , init_pos.y)
          let target_cell = board.getCell(target_pos.x , target_pos.y)

  
      isCheckFromSocketMove(init_cell , target_cell);
    


        } else if (data.event_type === "promotion") {
          let game_move = JSON.parse(data.game_event)
          let init_pos = JSON.parse(game_move.initial_cell) 
          let target_pos = JSON.parse(game_move.target_cell ) 
          let piece_name = getPieceNameFromPieceChar(game_move.promoted_to)
 

          let init_cell = board.getCell(init_pos.x , init_pos.y)
          let target_cell = board.getCell(target_pos.x , target_pos.y)

    setTakenPieces(target_cell!.piece!);
    pawnUtils.transform(init_cell!,target_cell,piece_name , currentPlayer);
    update();
    validateCheck();
    passTurn();
    //setPawnTransformUtils(initialState);
          
        } else {
          console.log("invalid event")
        }
  
      }

    })


    chann?.on("checkmate", (data) => {
      if(data.color_in_check_mate === player_color) {

        chann.push("checkmate-accepted" , {
          color_in_check_mate: data.color_in_check_mate,
          winner_username: data.winner_username,
          winner_user_id: data.winner_user_id,
          loser_username: user_details.username,
          loser_user_id: user_details.id,
          game_id: game_id
        } )

        setWinnerUsername(data.winner_username)
        setWinnerUserId(data.winner_user_id)
        setLoserUsername(user_details.username)
        setLoserUserId(user_details.id)


        document.getElementById("game_over_modal")!.showModal()

      }

    })


    chann?.on("stalemate", (data) => {
      if(data.color_in_stalemate === player_color) {

        chann.push("stalemate-accepted" , {
          color_in_stalemate: data.color_in_stalemate,
          player_one_username: data.player_one_username,
          player_one_user_id: data.player_one_user_id,
          player_two_username: user_details.username,
          player_two_user_id: user_details.id,
          game_id: game_id
        } )

        setWinnerUsername(data.player_one_username)
      setWinnerUserId(data.player_one_user_id)
      setLoserUsername(data.player_two_username)
      setLoserUserId(data.player_two_user_id)
      setGameCurrentStatus("GAME-OVER")

      document.getElementById("game_over_stalemate_modal")!.showModal()

      }

    })

    chann?.on("game-over" , (data) => {


      setWinnerUsername(data.winner_username)
      setWinnerUserId(data.winner_user_id)
      setLoserUsername(data.loser_username)
      setLoserUserId(data.loser_user_id)
      setGameCurrentStatus("GAME-OVER")

      document.getElementById("game_over_modal")!.showModal()

    })


    chann?.on("game-over-stalemate" , (data) => {


      setWinnerUsername(data.player_one_username)
      setWinnerUserId(data.player_one_user_id)
      setLoserUsername(data.player_two_username)
      setLoserUserId(data.player_two_user_id)
      setGameCurrentStatus("GAME-OVER")

      document.getElementById("game_over_stalemate_modal")!.showModal()

    })



    chann?.on("send-user-default-win-because-user-left" , (data) => {


      console.log("DEFAULT USER WIN DATA RECEIVED")
      console.log(data)

      setUserIdWhoLeft(data.user_id_who_left)
      setUserIdWhoWon(data.user_id_who_won)

      setUserUsernameWhoLeft(data.user_username_who_left)
      setUserUsernameWhoWon(data.user_username_who_won)


      setTimeout(() => {

        document.getElementById("default_user_win_modal")!.showModal()
      } , 300)
      
    })


    chann?.on("game-over-time-for-users" , (data) => {
      setWinnerUsername(data.winner_username)
      setWinnerUserId(data.winner_user_id)
      setLoserUsername(data.loser_username)
      setLoserUserId(data.loser_user_id)
      setGameCurrentStatus("GAME-OVER")

      document.getElementById("game_over_modal")!.showModal()
    })


    chann?.on("player-did-not-staked-within-time-user" , async (msg) => {
      document.getElementById("game_over_stalemate_modal")!.close()
      document.getElementById("game_over_modal")!.close()
      setGeneralPurposeMessage("Players did not staked in time. Game is invalid now")
      setGeneralPurposeTitle("Player Staking Failed")
      document.getElementById("general_purpose_modal")!.showModal()

      setTimeout(() => {
        
      document.getElementById("general_purpose_modal")!.close()
        navigate("/home")
    } , 2000)
    })

    return () => {
      chann?.off("send-user-game-event")
      chann?.off("checkmate")
      chann?.off("game-over")
      chann?.off("game-over-stalemate")
      chann?.off("send-user-default-win-because-user-left")
      chann?.off("game-over-time-for-users")
      chann?.off("player-did-not-staked-within-time-user")
    };

  })


  // Spectator events 

  useEffect(() => {
    if(!gameStore.isSpectator)
      return



    spectatorChannel?.on("user-game-move" , (parsed_payload) => {

      if (parsed_payload.event_type === "normal") {
                  console.log("Normal move received")
                  let game_move = JSON.parse(parsed_payload.game_event)

                  let init_pos = JSON.parse(game_move.initial_cell) 
                  let target_pos = JSON.parse(game_move.target_cell ) 
                  let init_cell = board.getCell(init_pos.x , init_pos.y)
                  let target_cell = board.getCell(target_pos.x , target_pos.y)

              if (target_cell.piece instanceof King) return;

              if (target_cell.availableToPassant) {
                const pieceGetByPassant = pawnPassant.getPawnByPassant(target_cell, init_cell!, board);
                setTakenPieces(pieceGetByPassant!);
              }

              if (!colorInCheck && pawnUtils.isPawnOnLastLine(currentPlayer, init_cell!, target_cell))
                setPawnTransformUtils({ ...pawnTransformUtils, visible: true, targetCell: target_cell });

              else {
                isCheckFromSocketMove(init_cell , target_cell);
              }

              resetPassantCells();

        } else if (parsed_payload.event_type === "promotion") {
          let game_move = JSON.parse(parsed_payload.game_event)
          let init_pos = JSON.parse(game_move.initial_cell) 
          let target_pos = JSON.parse(game_move.target_cell ) 
          let piece_name = game_move.promoted_to
 

          let init_cell = board.getCell(init_pos.x , init_pos.y)
          let target_cell = board.getCell(target_pos.x , target_pos.y)
              if (target_cell.piece instanceof King) return;

              if (target_cell.availableToPassant) {
                const pieceGetByPassant = pawnPassant.getPawnByPassant(target_cell, init_cell!, board);
                setTakenPieces(pieceGetByPassant!);
              }

              setTakenPieces(target_cell!.piece!);
              pawnUtils.transform(init_cell!,target_cell,piece_name , currentPlayer);
              update();
              validateCheck();
              passTurn();
              setPawnTransformUtils(initialState);

              resetPassantCells();
        
      } else {
        console.log("invalid event")
      }




    })


    spectatorChannel?.on("game-over-for-spectators" , (data) => {

      console.log("Gam over event recieved")

      setWinnerUsername(data.winner_username)
      setWinnerUserId(data.winner_user_id)
      setLoserUsername(data.loser_username)
      setLoserUserId(data.loser_user_id)
      
      setGameCurrentStatus("GAME-OVER")
      document.getElementById("game_over_modal")!.showModal()

    })

    spectatorChannel?.on("send-spectator-default-win-because-user-left" , (data) => {

      setUserIdWhoLeft(data.user_id_who_left)
      setUserIdWhoWon(data.user_id_who_won)

      setUserUsernameWhoLeft(data.user_username_who_left)
      setUserUsernameWhoWon(data.user_username_who_won)


      setTimeout(() => {

        document.getElementById("default_user_win_modal")!.showModal()
      } , 500)
    })
  

    spectatorChannel?.on("game-over-stalemate-for-spectators" , (data) => {


      setWinnerUsername(data.player_one_username)
      setWinnerUserId(data.player_one_user_id)
      setLoserUsername(data.player_two_username)
      setLoserUserId(data.player_two_user_id)
      setGameCurrentStatus("GAME-OVER")

      document.getElementById("game_over_stalemate_modal")!.showModal()

    })


    spectatorChannel?.on("game-over-time-for-spectators" , (data) => {
      setWinnerUsername(data.winner_username)
      setWinnerUserId(data.winner_user_id)
      setLoserUsername(data.loser_username)
      setLoserUserId(data.loser_user_id)
      setGameCurrentStatus("GAME-OVER")

      document.getElementById("game_over_modal")!.showModal()
    })


    spectatorChannel?.on("player-did-not-staked-within-time-spectator" , async (msg) => {
      document.getElementById("game_over_stalemate_modal")!.close()
      document.getElementById("game_over_modal")!.close()
      setGeneralPurposeMessage("Players did not staked in time. Game is invalid now")
      setGeneralPurposeTitle("Player Staking Failed")
      document.getElementById("general_purpose_modal")!.showModal()

      setTimeout(() => {
        
      document.getElementById("general_purpose_modal")!.close()
        navigate("/home")
    } , 2000)
    })
  
    return () => {
      spectatorChannel?.off("user-game-move")
      spectatorChannel?.off("game-over-for-spectators")
      spectatorChannel?.off("game-over-stalemate-for-spectators")
      spectatorChannel?.off("game-over-time-for-spectators")
      spectatorChannel?.off("send-spectator-default-win-because-user-left")
      spectatorChannel?.off("player-did-not-staked-within-time-spectator")
    }
  
  })


  const checkMateSocketPublisher =  (checkmateColor: Color | null) => {

    if(gameStore.isSpectator)
      return;

    if(checkmateColor !== null && checkmateColor !== player_color) {

        chann?.push("checkmate-move" , {
          color_in_check_mate: checkmateColor,
          player_color: player_color,
          winner_username: user_details.username,
          winner_user_id: user_details.id,
        })

    }

  }


  
  const checkStalemateSocketPublisher =  (stalemateColor: Color | null) => {

    if(gameStore.isSpectator)
      return;

    if(stalemateColor !== null && stalemateColor !== player_color) {

        chann?.push("stalemate-move" , {
          color_in_stalemate: stalemateColor,
          player_one_username: user_details.username,
          player_one_user_id: user_details.id,
        })

    }

  }
  useEffect(() => {
   // restart()
    useChessGameStore.subscribe( (state) => state.colorInCheckMate , checkMateSocketPublisher)
    useChessGameStore.subscribe( (state) => state.colorInStaleMate , checkStalemateSocketPublisher)
  } , [])



  return (
    <>
      {/* render board */}

      <div
        className="board"
        onContextMenu={(e) => {
          e.preventDefault();
          setSelectedCell(null);
          resetPassantCells();
        }}
      >
        {board.cellsGrid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            <span className="files">{8 - rowIndex}</span>
            {row.map((cell, cellIndex) => (
              <CellComponent
                key={cellIndex}
                cell={cell}
                clickHandler={clickHandler}
                selected={selectedCell?.equals(cell.x, cell.y)}
              />
            ))}
          </div>
        ))}

        <div className="ranks">
          {rankCoordinates.map((rank) => (
            <span key={rank}>{rank}</span>
          ))}
        </div>
      </div>

      <PawnTransform
        pawntransformUtils={pawnTransformUtils}
        initialState={initialState}
        setPawnTransformUtils={setPawnTransformUtils} user_id={user_id} game_id={game_id}      ></PawnTransform>


            <GameOverModal winner_username={winner_username} winner_user_id={winner_user_id} loser_username={loser_username} loser_user_id={loser_user_id} game_id={game_id} user_id={user_details.id}/>

          <GameOverStalemateModal player_one_username={winner_username} player_one_user_id={winner_user_id} player_two_username={loser_username} player_two_user_id={loser_user_id} game_id={game_id} user_id={user_details.id}/>
          <DefaultUserWinModal user_id_who_left={user_id_who_left} user_username_who_left={user_username_who_left} user_id_who_won={user_id_who_won} user_username_who_won={user_username_who_won} game_id={game_id} user_id={user_id} />

    </>
  );
};

export default BoardComponent;
