import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { AuroraBackground } from '../components/backgrounds/aurora-background'
import Login from './login'
import Registration from './registration'
import { ErrorAlert, InfoAlert, SuccessAlert, WarningAlert } from '../components/ui/AlertMessage'

const AuthScreen = () => {

    const [authState , setAuthState] = useState<"login" | "registration">("login")

    const [isAlert, setIsAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertType, setAlertType] = useState<"success" | "warning" | "error" | "info">("success")

  return (
    <AuroraBackground>
    <motion.div
      initial={{ opacity: 0.0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
        duration: 0.8,
        ease: "easeInOut",
      }}
      className="relative flex flex-col gap-2 items-center justify-center px-1"
    >

          {isAlert ? <div> 
            
            {
              alertType === "success" ? <SuccessAlert message={alertMessage} /> : alertType === "warning" ? <WarningAlert message={alertMessage} /> : alertType === "error" ? <ErrorAlert message={alertMessage}/> : <InfoAlert message={alertMessage}/>
            }

          </div>  : <> </>}



      <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
       {authState === "login" ? <Login setAuthState={setAuthState} setAlertMessage={setAlertMessage} setAlertType={setAlertType} setIsAlert={setIsAlert}/>  
       : <Registration setAuthState={setAuthState} setAlertMessage={setAlertMessage} setAlertType={setAlertType} setIsAlert={setIsAlert} />}
      </div>
    </motion.div>
  </AuroraBackground>
  )
}

export default AuthScreen