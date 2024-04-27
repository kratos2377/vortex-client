import { actions, ChessGameState, store } from "../chess_store";
import { TileId } from "../types/constants";


interface MoveParams {
  targetTileId: TileId;
  sourceTileId?: TileId;
  promotePieceType?: "Q" | "B" | "R" | "N";
}

/**
 * useMakeMove - Provides a function to make moves. This handles the logic of talking to
 * PubNub if we need to (i.e. if an online game with a friend is ongoing).
 *
 */
const useMakeMove = () => {
  const { playMode, gameId, player } = useSelector(
    (state: ChessGameState) => state.currentGameState
  );
  const selectedTile = useSelector(
    (state: ChessGameState) => state.boardState.selectedTile
  );


  const makeMove = (moveParams: MoveParams) => {
    store.dispatch(actions.moveToTile(moveParams));
  };

  return makeMove;
};

export default useMakeMove;
