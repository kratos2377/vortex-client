import React , {useState , useEffect} from "react"
import { useRef } from "react";
import { useChessMainStore } from "../../../state/UserAndGameState";
import { ChessMove } from "../../../state/chess_store/chess_store_types";

const MoveHistory = () => {
  const [highlightIndex, setHighlightIndex] = useState(0);
  const divRef = useRef(null);
  const moves: ChessMove[] = useChessMainStore.getState().movesHistory

  useEffect(() => {
    setHighlightIndex(moves.length - 1);
    // @ts-ignore
    divRef.current.scrollTop = divRef.current.scrollHeight;
  }, [moves]);

  return (
    <div
      ref={divRef}
      className="grid grid-cols-2 overflow-y-scroll gap-3 text-xl"
    >
      {moves.map(
        (
          move,
          index
        ) => {
          return (
            <div
              key={index}
              className="border border-gray-200 text-center w-full p-2 font-oswald text-zinc-300 bg-neutral-600"
            >
              {move.cellString}
            </div>
          );
        }
      )}
    </div>
  );
};

export default MoveHistory;

// const MoveHistory = () => {
//   return (
//     <div>MoveHistory</div>
//   )
// }

// export default MoveHistory