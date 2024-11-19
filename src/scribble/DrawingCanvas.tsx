import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { draw, drawWithDataURL } from '../helper_functions/drawUtil'
import useDraw, { DrawProps } from '../helper_functions/useDraw'
import { useCanvasStore } from '../state/UserAndGameState'
import { DrawOptions } from '../types/scribble_types'
import ClearButton from './ClearButton'
import UndoButton from './UndoButton'
import { Skeleton } from './ui/Skeleton'
import { GameEventPayload } from '../types/ws_and_game_events'
import { WebSocketContext } from '../socket/websocket_provider'


export default function DrawingCanvas() {


  const {chann} = useContext(WebSocketContext)

  const containerRef = useRef<HTMLDivElement>(null)

  const [isCanvasLoading, setIsCanvasLoading] = useState(true)

  const strokeColor = useCanvasStore(state => state.strokeColor)
  const strokeWidth = useCanvasStore(state => state.strokeWidth)
  const dashGap = useCanvasStore(state => state.dashGap)




  const onDraw = useCallback(
    ({ ctx, currentPoint, prevPoint }: DrawProps) => {
      const drawOptions = {
        ctx,
        currentPoint,
        prevPoint,
        strokeColor,
        strokeWidth,
        dashGap,
      }
      draw(drawOptions)


      let gameEvent: GameEventPayload = {
        user_id: 'user_id',
        game_event: JSON.stringify(drawOptions),
        game_id: 'game_id',
        event_type: ''
      }

      chann?.push('game_event', gameEvent)
     
    },
    
    [strokeColor, strokeWidth, dashGap]
  )

  const { canvasRef, onInteractStart, clear, undo } = useDraw(onDraw)

  useEffect(() => {
    const canvasElement = canvasRef.current
    const ctx = canvasElement?.getContext('2d')


    chann?.on('canvas-state-from-server', (canvasState: string) => {
      if (!ctx || !canvasElement) return

      drawWithDataURL(canvasState, ctx, canvasElement)
      setIsCanvasLoading(false)
    })

    chann?.on('update-canvas-state', (drawOptions: DrawOptions) => {
      if (!ctx) return
      draw({ ...drawOptions, ctx })
    })

    // chann?.on('undo-canvas', canvasState => {
    //   if (!ctx || !canvasElement) return

    //   drawWithDataURL(canvasState, ctx, canvasElement)
    // })

    return () => {
      chann?.off('get-canvas-state')
      chann?.off('update-canvas-state')
      chann?.off('undo-canvas')
    }

  }, [canvasRef])

  useEffect(() => {
    const setCanvasDimensions = () => {
      if (!containerRef.current || !canvasRef.current) return

      const { width, height } = containerRef.current?.getBoundingClientRect()

      canvasRef.current.width = width - 50
      canvasRef.current.height = height - 50
    }

    setCanvasDimensions()
  }, [canvasRef])

  const handleInteractStart = () => {
    const canvasElement = canvasRef.current

    if (!canvasElement) return

    // chann.push('add-undo-point', {
    //   roomId,
    //   undoPoint: canvasElement.toDataURL(),
    // })
    onInteractStart()
  }

  return (
    <div
      ref={containerRef}
      className='relative flex h-full w-full flex flex-col self-center'
    >
      {!isCanvasLoading && (
        <div className='absolute right-[25px] top-[25px] flex select-none rounded-none rounded-bl rounded-tr-[2.5px]'>
          {/* Fix undo state button */}
          {/* <UndoButton undo={undo} /> */}

          <ClearButton canvasRef={canvasRef} clear={clear} />
        </div>
      )}

      {isCanvasLoading && (
        <Skeleton className='absolute h-full w-full' />
      )}

      <canvas
        id='canvas'
        ref={canvasRef}
        onMouseDown={handleInteractStart}
        onTouchStart={handleInteractStart}
        width={0}
        height={0}
        className='touch-none rounded border bg-white'
      />
    </div>
  )
}
