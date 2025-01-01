import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTimer } from 'react-timer-hook';
import { getUserTokenFromStore } from '../../persistent_storage/save_user_details';
import { useUserStore } from '../../state/UserAndGameState';
import { delete_match_making_ticket } from '../../helper_functions/apiCall';
import { ErrorAlert, SuccessAlert } from './AlertMessage';


interface CircularClockProps  {
  setCircularClock: React.Dispatch<React.SetStateAction<boolean>>
  setCurrentScreen: React.Dispatch<React.SetStateAction<string>>
}
const CircularClock: React.FC<CircularClockProps> = ({setCircularClock , setCurrentScreen}) => {
    
      const [time , setTime] = useState(new Date())
      const [isComplete, setIsComplete] = useState(false);
      const {user_details} = useUserStore()
      const [requestSent , setRequestSent] = useState(false)

        const [isAlert , setIsAlert] = useState(false)
        const [alertType , setAlertType] = useState<"error" | "success">("success")
        const [alertMessage , setAlertMessage] = useState("")

      const {
        totalSeconds,
        seconds,
        restart,
        pause
      } = useTimer({ autoStart: true , expiryTimestamp: time , onExpire: () => {
        //Remove Circular clock screen
        //setIsComplete(true)
      } });
    
      // Timer configuration
      const totalTime = 300;
      const radius = 120;
      const strokeWidth = 20;
      const circumference = 2 * Math.PI * radius;
    
      // Calculate progress
      const progress = ((300 - totalSeconds) / totalTime) * 100;

      
    


    
      // Format time as MM:SS
      const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
      };
      


      const handleCancelMatchmaking = async () => {
          setRequestSent(true)

          let token = await getUserTokenFromStore()
          let res = await delete_match_making_ticket( JSON.stringify({user_id: user_details.id}) ,token)


          if(!res.status) {
              setAlertMessage("Error while leaving matchmaking")
              setAlertType("error")
              setIsAlert(true)

              setTimeout(() => {
                  setIsAlert(false)
              } , 2000)
              
          } else {

            pause()
            setAlertMessage("Redirecting to Ongoing GameScreen")
            setAlertType("success")
            setIsAlert(true)

            setTimeout(() => {
              
                setIsAlert(false)
                setCircularClock(false)

                setCurrentScreen("ongoing-games")
            } , 2000)

          }


          setRequestSent(false)
      }


      useEffect(() => {
          const new_time = new Date()
          new_time.setSeconds(new_time.getSeconds() + 300)
          restart(new_time)
      } , [])

      return (
        <div className="flex flex-col items-center justify-center p-5">
      {isAlert ? alertType === "success" ? <SuccessAlert message={alertMessage} /> : <ErrorAlert message={alertMessage}/> : <div></div>}
        <motion.div 
          className="bg-white rounded-2xl shadow-2xl p-8 text-center w-full max-w-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Circular Timer */}
          <div className="relative w-80 h-80 mx-auto mb-6">
            {/* Background Circle */}
            <svg 
              className="absolute top-0 left-0 transform -rotate-90" 
              width="320" 
              height="320" 
              viewBox="0 0 320 320"
            >
              {/* Base Circle */}
              <circle 
                cx="160" 
                cy="160" 
                r={radius} 
                fill="none" 
                stroke="#e0e0e0" 
                strokeWidth={strokeWidth}
              />
              
              {/* Animated Foreground Circle */}
              <circle 
                cx="160" 
                cy="160" 
                r={radius} 
                fill="none" 
                stroke="#ff4444" 
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * progress / 100)}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
  
            {/* Time Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div 
                className="text-5xl font-bold text-gray-800"
                key={totalSeconds}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {formatTime(totalSeconds)}
              </motion.div>
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 mt-2"
                >
                  Time's up!
                </motion.div>
              )}
            </div>
          </div>
  
          {/* Control Buttons */}
          <div className="flex justify-center space-x-4 mt-6">
            {/* Button to cancel the ticket*/}

              {
                requestSent ? <div>
                  <span className="loading loading-spinner loading-md"></span>
                </div> :  <button className="btn" onClick={handleCancelMatchmaking}>
                Cancel Matchmaking
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="red">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              }
    
          </div>
        </motion.div>
      </div>
      )
    }
    
    export default CircularClock
    