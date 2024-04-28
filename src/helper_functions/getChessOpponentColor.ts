import { Color } from "../types/chess_types/constants";


export const opposite = (color: Color): Color => (color === Color.WHITE ? Color.BLACK : Color.WHITE);
