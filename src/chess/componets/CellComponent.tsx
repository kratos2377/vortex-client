import { FC } from "react";
import { Color, PieceNames } from "../models/Piece/types";
import { CellProps } from "./types";
import useBoardStore from "../../state/chess_store/board";
import useChessGameStore from "../../state/chess_store/game";
import { useChessMainStore } from "../../state/UserAndGameState";

const CellComponent: FC<CellProps> = ({ clickHandler, cell, selected }) => {
  const { selectedCell } = useBoardStore();
  const { colorInCheck } = useChessGameStore();
  const { helpers } = useChessMainStore();

  const isKingOnCell = cell.piece?.name === PieceNames.KING;
  const pieceIcon = cell.piece?.icon;
  const piece = cell.piece;
  const canMove = cell.availableToMove;
  const canAttack = cell.availableToAttack;
  const canPassant = cell.availableToPassant;
  const inCheck = cell.piece?.color === colorInCheck;
  const attackedCellAroundKing =
    selectedCell?.piece?.name === PieceNames.KING && !piece && canAttack && selectedCell.piece?.canMove(cell);


  const cellClasses = [
    "cell",
    cell.color === Color.BLACK ? "dark" : "light",
    cell.piece?.color === Color.BLACK ? "black-piece" : "light-piece",
    selected ? "active" : "",
  ].join(" ");

  return (
    <div onClick={() => clickHandler(cell)} className={`${cellClasses}`}>
      {!piece && canMove && <div className="highlight empty"></div>}
      {helpers && (
        <>
          {isKingOnCell && inCheck && <div className="highlight king"></div>}
          {canMove && piece && !isKingOnCell && <div className="highlight piece"></div>}
          {canPassant && <div className="highlight passant"></div>}
          {attackedCellAroundKing && <div className="highlight underAttack">💥</div>}
        </>
      )}
      {pieceIcon}
    </div>
  );
};

export default CellComponent;
