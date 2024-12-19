import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTimer } from 'react-timer-hook';

    const CircularClock = () => {
      const currentTime = new Date();
      currentTime.setTime(currentTime.getSeconds() + 300)

      const [isComplete, setIsComplete] = useState(false);

      const [requestSent , setRequestSent] = useState(false)

      const [time , setTime] = useState(currentTime)

      const {
        totalSeconds,
      } = useTimer({ autoStart: true , expiryTimestamp: time , onExpire: () => {
        //Remove Circular clock screen
        setIsComplete(true)
      } });
    
      // Timer configuration
      const totalTime = 5 * 60;
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


          setTimeout(() => {
              setRequestSent(false)
          } , 3000)
      }


      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
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
    