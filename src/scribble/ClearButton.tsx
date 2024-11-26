'use client'

import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip'
import { useContext, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { Button } from './ui/Button'
import { Kbd } from './ui/Kbd'
import { WebSocketContext } from '../socket/websocket_provider'


interface ClearButtonProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  clear: () => void
}

export default function ClearButton({ canvasRef, clear }: ClearButtonProps) {

  const {chann} = useContext(WebSocketContext)

  const clearCanvas = () => {
    const canvasElement = canvasRef.current
    if (!canvasElement) return

    // chann?.push('add-undo-point', {
    //   undoPoint: canvasElement.toDataURL(),
    // })
     clear()
     chann?.push('clear-canvas', {message: 'clear'})
  }

  useHotkeys('c', clearCanvas)

  useEffect(() => {
    chann?.on('clear-canvas', clear)

    return () => {
      chann?.off('clear-canvas')
    }
  }, [clear])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            className='rounded-none rounded-tr-[2.8px] border-0 border-b border-l focus-within:z-10'
            onClick={clearCanvas}
          >
            Clear
          </Button>
        </TooltipTrigger>

        <TooltipContent>
          <Kbd>C</Kbd>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
