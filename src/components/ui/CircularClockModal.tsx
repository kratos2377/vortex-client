import React from 'react'
import CircularClock from './CircularClock'


interface CircularClockProps  {
  setCircularClock: React.Dispatch<React.SetStateAction<boolean>>
  setCurrentScreen: React.Dispatch<React.SetStateAction<string>>
}

const CircularClockModal: React.FC<CircularClockProps> = ({setCircularClock , setCurrentScreen})  => {
  return (
         <>
      <dialog id="find_a_match_circular_modal" className="z-100 modal modal-bottom sm:modal-middle">
  <div className="modal-box m-1">
        <CircularClock  setCircularClock={setCircularClock} setCurrentScreen={setCurrentScreen}/>
  
  </div>
  </dialog>
  </>
  )
}

export default CircularClockModal