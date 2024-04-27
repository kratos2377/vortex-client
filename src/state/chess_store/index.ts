
import {
  getInitialTileMap,
  PieceId,
  PIECES,
  TileId,
  TILES,
} from "../../types/chess_types/constants";
import rootEpic from "./actions";
import {
  _clearHighlights,
  _getBoard,
  _getOpponent,
  _getPieceType,
  _getPlayer,
  _getRelativePos,
  _getTile,
  _isPiecePromoted,
} from "./chess_utils";

interface TileMapData {
  pieceId: PieceId | undefined;
  highlight: boolean;
}

export interface Move {
  player: Player;
  pieceId: PieceId;
  sourceTileId: TileId;
  targetTileId: TileId;
  takenPieceId: PieceId | undefined;
  isMoveCheck?: boolean;
  castledRook: PieceId | undefined;
  promotedPiece?: PieceId;
}

export type TileMap = Record<TileId, TileMapData>;
export type CanCastle = Record<Player, TileId[]>;

/**
 * STATE INTERFACES
 */

interface CurrentGameState {
  gameId: any;
  status: GameStatus;
  gameType: GameTypes | undefined;
  playMode: PlayModes | undefined;
  maxTime: number | "unlimited";
  increment: number;
  currentTurn: Player | undefined;
  winner: Player | undefined;
  player: Player | undefined;
}

interface MovesState {
  movedPieces: Record<PieceId, boolean>; // Easy reference to know which pieces have been moved
  moveHistory: Move[]; // Array of moves
  historyTileMap: TileMap; // identical to tileMap but used for rendering historic state (previous moves, last moved, etc.)
  isShowingHistory: boolean; // When we want to render historic moves, we switch this to true
}

interface BoardState {
  tileMap: TileMap; // mapping of each tile to the piece ID that's on it
  selectedTile: TileId | undefined; // the tile selected by the user. Can only ever be their own piece occupied tile
  selectedPiece: PieceId | undefined; // the pieceID on the selected tile
  whiteAttackedTiles: TileId[]; // tiles that white is attacking
  blackAttackedTiles: TileId[]; // tiles that black is attacking
  peggedTileMap: Record<TileId, TileId[]>; // Mapping of tiles that are pegged to the peg path
  canCastle: CanCastle; // mapping of which pieces can castle for each side
  canBeEnpassant: TileId | undefined; // the tile that can be taken via enpassant (if any)
}

interface CheckState {
  isActiveCheck: boolean; // is currentTurn player in check
  checkOriginTiles: TileId[]; // if in check, tile(s) from where the check originates
  checkBlockTiles: TileId[]; // if in check, tile(s) which can be moved to to block the check
}

export interface ModalProps {
  targetTileId?: TileId;
  winner?: Player | undefined;
  winMode?: WinModes | undefined;
  quitter?: Player;
  multiplayerGameStatus?: MultiplayerGameStatus;
}

export interface ModalState {
  type:
    | undefined
    | "PAWN_PROMOTE"
    | "GAME_OVER"
    | "QUIT_GAME"
    | "MULTIPLAYER_STATUS"
    | "ABOUT";

  modalProps?: ModalProps;
}

export interface ChessGameState {
  currentGameState: CurrentGameState;
  movesState: MovesState;
  boardState: BoardState;
  checkState: CheckState;
  modalState: ModalState;
}

export const tileMapInitialState = Object.keys(TILES).reduce((acc, curr) => {
  return { ...acc, [curr]: { pieceId: undefined, highlight: false } };
}, {});

const initialState: ChessGameState = {
  currentGameState: {
    gameId: undefined,
    status: "NOT STARTED",
    playMode: undefined,
    gameType: undefined,
    winner: undefined,
    currentTurn: "W",
    player: "W",
    maxTime: 5,
    increment: 0,
  },
  movesState: {
    movedPieces: {},
    moveHistory: [],
    historyTileMap: tileMapInitialState,
    isShowingHistory: false,
  },
  boardState: {
    tileMap: tileMapInitialState,
    selectedTile: undefined,
    selectedPiece: undefined,
    whiteAttackedTiles: [],
    blackAttackedTiles: [],
    peggedTileMap: {},
    canCastle: { W: [], B: [] },
    canBeEnpassant: undefined,
  },
  checkState: {
    isActiveCheck: false,
    checkOriginTiles: [],
    checkBlockTiles: [],
  },
  modalState: {
    type: undefined,
  },
};