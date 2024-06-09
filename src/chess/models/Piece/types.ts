export enum Color {
  WHITE = "White",
  BLACK = "Black",
}
export enum PieceNames {
  PIECE = "PIECE",
  KING = "KING",
  KNIGHT = "KNIGHT",
  PAWN = "PAWN",
  QUEEN = "QUEEN",
  ROOK = "ROOK",
  BISHOP = "BISHOP",
}
export enum PieceIcons {
  PIECE = "",
  KING = "♚",
  KNIGHT = "♞",
  PAWN = "♙",
  QUEEN = "♛",
  ROOK = "♜",
  BISHOP = "♝",
}

export enum PieceChar {
  PIECE = "P",
  KING = "K",
  KNIGHT = "N",
  PAWN = "P",
  QUEEN = "Q",
  ROOK = "R",
  BISHOP = "B",
}


export const getPieceCharFromPieceName = (name: PieceNames) => {



 if (name === PieceNames.KING)
  return PieceChar.KING

 if (name === PieceNames.KNIGHT)
  return PieceChar.KNIGHT

 if (name === PieceNames.PAWN)
  return PieceChar.PAWN

 if (name === PieceNames.QUEEN)
  return PieceChar.QUEEN

 if (name === PieceNames.ROOK)
  return PieceChar.ROOK

 if (name === PieceNames.BISHOP)
  return PieceChar.BISHOP

 return PieceChar.PIECE
}