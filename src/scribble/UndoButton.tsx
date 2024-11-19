import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { isMacOS } from '../helper_functions/drawUtil'
import { cn } from '../utils/cn'
import { Button } from './ui/Button'
import { useHotkeys } from 'react-hotkeys-hook'
import { Kbd } from './ui/Kbd'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/Tooltip'

interface UndoButtonProps {
  undo: (lastUndoPoint: string) => void
}

export default function UndoButton({ undo }: UndoButtonProps) {

  const [isLoading, setIsLoading] = useState(false)

  const isMac = isMacOS()
  const hotKey = `${isMac ? 'Meta' : 'ctrl'} + z`

  const undoCanvas = () => {
    setIsLoading(true)
  //  chann.push('get-last-undo-point', roomId)
  }

  useHotkeys(hotKey, undoCanvas)

  useEffect(() => {
    // This socket does undo function
    // chann?.on('last-undo-point-from-server', (lastUndoPoint: string) => {
    //   undo(lastUndoPoint)
    //   chann.push('undo', {
    //     canvasState: lastUndoPoint,
    //     roomId,
    //   })

    //   chann.push('delete-last-undo-point', roomId)
    undo("")
      setIsLoading(false)

      // return () => {
      //   chann?.off('last-undo-point-from-server')
      // }
    // })
  }, [undo])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            className='w-16 rounded-none rounded-bl-md border-0 border-b border-l p-0 focus-within:z-10'
            disabled={isLoading}
            onClick={undoCanvas}
          >
            {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Undo'}
          </Button>
        </TooltipTrigger>

        <TooltipContent className='flex gap-1'>
          <Kbd className={cn({ 'text-xs': isMac })}>{isMac ? '⌘' : 'Ctrl'}</Kbd>
          <Kbd>Z</Kbd>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
