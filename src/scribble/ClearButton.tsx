'use client'

import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip'
import { useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { Button } from './ui/Button'
import { Kbd } from './ui/Kbd'


interface ClearButtonProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  clear: () => void
}

export default function ClearButton({ canvasRef, clear }: ClearButtonProps) {

  const clearCanvas = () => {
    const canvasElement = canvasRef.current
    if (!canvasElement) return

    // socket.emit('add-undo-point', {
    //   roomId,
    //   undoPoint: canvasElement.toDataURL(),
    // })
     clear()
    // socket.emit('clear-canvas', roomId)
  }

  useHotkeys('c', clearCanvas)

  useEffect(() => {
    // socket.on('clear-canvas', clear)

    // return () => {
    //   socket.off('clear-canvas')
    // }
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
