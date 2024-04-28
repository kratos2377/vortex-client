import { FC } from "react";
import { Color } from "../../models/Piece/types";
import { Piece } from "../../models/Piece/Piece";
import { useChessMainStore } from "../../../state/UserAndGameState";
interface TakenPiecesProps {
  color: Color;
}

const TakenPieces: FC<TakenPiecesProps> = ({ color }) => {
  const { takenPieces } = useChessMainStore();
  const colorStyle = color === Color.WHITE ? "white" : "black";
  const position = color === Color.WHITE ? "left" : "right";
  const piecesOfColor = takenPieces.filter((p: Piece) => p?.color === color);

  if (!piecesOfColor.length) return null;

  return (
    <div className={["taken-pieces", position].join(" ")}>
      <div className="piece-container">
        {piecesOfColor.map((p: Piece) => {
          if (p?.color === color) {
            return (
              <div className="piece" key={p.id} style={{ color: colorStyle }}>
                {p.icon}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default TakenPieces;
