import { ICastlingUtils } from "../../../chess/componets/types";

export const initialCastlingState: ICastlingUtils = {
  king: null,
  leftRook: null,
  rightRook: null,
  longCastling: false,
  shortCastling: false,
  kingFirstStep: true,
};
