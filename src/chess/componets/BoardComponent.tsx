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
import { useChessMainStore } from "../../state/UserAndGameState";
import { initialCastlingState } from "../../state/chess_store/initial_states/castlingUtils";
import { rankCoordinates } from "../../state/chess_store/initial_states/rankCoordinates";
import { Color } from "../../types/chess_types/constants";
import { convertChessCell } from "../../helper_functions/convertChessCell";
import { socket } from "../../socket/socket";
import { GameEventPayload } from "../../types/ws_and_game_events";

const BoardComponent: FC = () => {
  const initialState: IPawnTransformUtils = { visible: false, targetCell: null };
  const { update, board, selectedCell, setSelectedCell } = useBoardStore();
  const { currentPlayer, passTurn , startingPlayerColor} = usePlayerStore();
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

  const [pawnTransformUtils, setPawnTransformUtils] = useState<IPawnTransformUtils>(initialState);
  const [passantAvailable, setPassantAvailable] = useState<boolean>(false);
  const [firstRender, setFirstRender] = useState<boolean>(true);

  const clickHandler = (cell: Cell): void => {
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

      if (!colorInCheck && pawnUtils.isPawnOnLastLine(currentPlayer, selectedCell!, cell))
        setPawnTransformUtils({ ...pawnTransformUtils, visible: true, targetCell: cell });

      else {
        isCheck(cell);
      }

      resetPassantCells();

      setMovesHistory( {  cellString: convertChessCell(cell), moveType: "normal" })

      let gameEvent: GameEventPayload = {
        user_id: "user_id",
        game_event: JSON.stringify( convertChessCell(selectedCell!) + "-" + convertChessCell(cell) ),
        game_id: "game_id"
      }
      socket.emit("game-event" , JSON.stringify(gameEvent))
      
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
        setPawnTransformUtils={setPawnTransformUtils}
      ></PawnTransform>
    </>
  );
};

export default BoardComponent;
