import { PieceChar, PieceNames } from "../chess/models/Piece/types"
import { Color } from "./chess_types/constants"

export type ChessNormalEvent = {
    initial_cell: string,
    target_cell: string,
    piece: PieceChar,
}

export type ChessPromotionEvent = {
    initial_cell: string,
    target_cell: string,
    promoted_to: PieceChar,
    piece: PieceChar
}

export type ChessGameOverEvent = {
    message: string,
    winner: Color
}