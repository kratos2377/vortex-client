import { FC, useEffect, useState } from "react";
import { Cell } from "../models/Cell/Cell";
import CellComponent from "./CellComponent";
import { opposite } from "../../helper_functions/getChessOpponentColor";
import useBoardStore from "../../state/chess_store/board";
import useChessGameStore from "../../state/chess_store/game";
import usePlayerStore from "../../state/chess_store/player";
import { King } from "../models/Piece/King";
import PawnTransform from "./PawnTransform";
import { IPawnTransformUtils } from "./types";
import { useChessMainStore, useGameStore } from "../../state/UserAndGameState";
import { initialCastlingState } from "../../state/chess_store/initial_states/castlingUtils";
import { rankCoordinates } from "../../state/chess_store/initial_states/rankCoordinates";
import { Color } from "../../types/chess_types/constants";
import { convertChessCell } from "../../helper_functions/convertChessCell";
import { socket } from "../../socket/socket";
import { GameEventPayload } from "../../types/ws_and_game_events";
import { convertStringToGameEvent } from "../../helper_functions/convertGameEvents";
import { ChessNormalEvent, ChessPromotionEvent } from "../../types/game_event_model";
import { Piece } from "../models/Piece/Piece";


interface BoardComponentProps {
  game_id: string,
  user_id: string
}

const BoardComponent = ({game_id , user_id}:BoardComponentProps) => {
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
  const { currentTurn , setGameCondition, setTakenPieces, setCastlingBtn, setCurrentTurn , setMovesHistory } = useChessMainStore();
  const {isSpectator} = useGameStore()
  const [pawnTransformUtils, setPawnTransformUtils] = useState<IPawnTransformUtils>(initialState);
  const [passantAvailable, setPassantAvailable] = useState<boolean>(false);
  const [firstRender, setFirstRender] = useState<boolean>(true);

  const clickHandler = (cell: Cell): void => {
    if (isSpectator) 
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
          initial_cell: JSON.stringify( {x: selectedCell!.x , y: selectedCell!.y}),
          target_cell: JSON.stringify( {x: cell!.x , y: cell!.y}),
        }
        let gameEvent: GameEventPayload = {
          user_id: user_id,
          game_event: JSON.stringify( normal_chess_event ),
          event_type: "normal",
          game_id: game_id
        }
        socket.emit("game-event" , JSON.stringify(gameEvent))
      }

      resetPassantCells();

    //  setMovesHistory( {  cellString: convertChessCell(cell), moveType: "normal" })

      // if (!pawnTransformUtils.visible) { 
   
       
      // }
      
    }
  };
  const isCheck = (cell: Cell): void => {
    const isCheckOnClone = check.isCheckOnClone(
      selectedCell as Cell,
      board,
      cell,
      currentPlayer,
      opposite(currentPlayer)
    );
    if (isCheckOnClone) {
      const message = colorInCheck ? "Protect your king" : "Invalid move, king must be protected";
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
      const message = colorInCheck ? "Protect your king" : "Invalid move, king must be protected";
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

    socket.on("send-user-game-event" , (data) => {
          let game_event = convertStringToGameEvent(data) as GameEventPayload


          if (game_event.event_type === "normal") {
            let game_move = JSON.parse(game_event.game_event) as ChessNormalEvent
            let init_pos = JSON.parse(game_move.initial_cell) 
            let target_pos = JSON.parse(game_move.target_cell) 

   

            let init_cell = board.getCell(parseInt(init_pos.x) , parseInt(init_pos.y))
            let target_cell = board.getCell(parseInt(target_pos.x) , parseInt(target_pos.y))
 
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

          } else {
            let game_move = JSON.parse(game_event.game_event) as ChessPromotionEvent
            let init_pos = JSON.parse(game_move.initial_cell) 
            let target_pos = JSON.parse(game_move.target_cell) 
            let piece_name = game_move.promoted_to
   

            let init_cell = board.getCell(parseInt(init_pos.x) , parseInt(init_pos.y))
            let target_cell = board.getCell(parseInt(target_pos.x) , parseInt(target_pos.y))
 
      if (target_cell.piece instanceof King) return;

      if (target_cell.availableToPassant) {
        const pieceGetByPassant = pawnPassant.getPawnByPassant(target_cell, init_cell!, board);
        setTakenPieces(pieceGetByPassant!);
      }

      setTakenPieces(pawnTransformUtils!.targetCell!.piece!);
      pawnUtils.transform(init_cell!, pawnTransformUtils.targetCell!,piece_name , currentPlayer);
      update();
      validateCheck();
      passTurn();
      setPawnTransformUtils(initialState);

      resetPassantCells();
            
          }
    

    })

    return () => {
      socket.off("send-user-game-event")
    };

  })


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
    </>
  );
};

export default BoardComponent;
