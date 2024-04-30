

export interface CanvasState {
  strokeColor: string
  strokeWidth: number[]
  dashGap: number[]
  setStrokeColor: (strokeColor: string) => void
  setStrokeWidth: (strokeWidth: number[]) => void
  setDashGap: (dashGap: number[]) => void
}

