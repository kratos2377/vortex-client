import { Cell } from "../chess/models/Cell/Cell";



export const convertChessCell = (cell: Cell) => {
    let x = cell.x;
    let y = cell.y;

    return String.fromCharCode(x + 65) + (8-y).toString()
}