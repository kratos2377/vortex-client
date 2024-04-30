import { DrawProps } from "../../helper_functions/useDraw"



export interface DrawOptions extends DrawProps {
  strokeColor: string
  strokeWidth: number[]
  dashGap: number[]
}
