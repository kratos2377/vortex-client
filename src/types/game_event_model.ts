import { PieceNames } from "../chess/models/Piece/types"

export type ChessNormalEvent = {
    initial_cell: string,
    target_cell: string,
}

export type ChessPromotionEvent = {
    initial_cell: string,
    target_cell: string,
    promoted_to: PieceNames,
}