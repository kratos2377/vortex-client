import React from 'react'
import DrawingCanvas from './DrawingCanvas'
import StrokeWidthSlider from './StrokeWidthSlider'
import ColorPalette from './ui/Palette'
import GuessWordInput from './ui/GuessWordInput'

const ScribbleGame = () => {
  return (
    <div className='scribble_app'>
      
      <div className='w-fit m-5'>

      Scrollable User component

      </div>


      <div className=' flex flex-col self-center h-full w-full  ml-3'>


          <div className='w-full mt-3 h-2/3 px-3'>
          <DrawingCanvas />
          </div>

      <div className='self-center mb-2'>
          <ColorPalette />
      </div>

            <div className='flex flex-row self-center'>
            <StrokeWidthSlider />
            </div>

            <div className='mt-3 w-full items-center'>
            <GuessWordInput />
            </div>


      </div>

    </div>
  )
}

export default ScribbleGame