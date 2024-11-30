import { Label } from '@radix-ui/react-label'
import { IconMail, IconUser } from '@tabler/icons-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/input'
import { send_email_call, verify_user_request_call } from '../helper_functions/apiCall'
import { deleteUserDetailsFromStore, saveUserDetails } from '../persistent_storage/save_user_details'
import { useUserStore } from '../state/UserAndGameState'
import { ErrorAlert, SuccessAlert } from '../components/ui/AlertMessage'
import { motion } from 'framer-motion'
import { AuroraBackground } from '../components/backgrounds/aurora-background'
import { LabelInputContainer } from '../components/ui/LabelInputContainer'
import { WebSocketContext } from '../socket/websocket_provider'
import { useTimer } from 'react-timer-hook';

const VerifyUserScreen = () => {
  const currentTime = new Date();
  currentTime.setTime(currentTime.getSeconds() + 60)
  const {conn} = useContext(WebSocketContext)
    const navigate = useNavigate()
    const [initialCall , setInitialCall] = useState(false)
 //   const [userKey , setUserKey] = useState("")
    const [isAlert , setIsAlert] = useState(false)
    const [alertType, setAlertType] = useState<"success" | "error">("success")
    const [alertMessage, setAlertMessage] = useState("")
    const { updateUserVerifiedStatus , resetUserModelState} = useUserStore()
    const {user_details} = useUserStore()
    const [retries , setRetries] = useState(3)
    const [time , setTime] = useState(currentTime)

    const [sendingEmail, setSendingEmail] = useState(false)
    const [verifying , setVerifying] = useState(false)
    const [disableSend , setDisableSend] = useState(true)
    const [code, setVerificationCode] = useState(new Array(6).fill(''));
    const inputRefs = useRef([]);


    const {
      totalSeconds,
      seconds,
      minutes,
      restart,
    } = useTimer({ autoStart: true , expiryTimestamp: time, onExpire: () => {
        setDisableSend(false)
    } });
  
    const handleUserLogin = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (code.length != 6) {
        setAlertType("error")
        setAlertMessage("Key Should be of length 6")
        setIsAlert(true)
        setTimeout(() => {
          setIsAlert(false)
          setAlertMessage("")
          setAlertType("success")
          }, 3000)

          return 
      }
  

      let user_key_string = "";

      for(var i = 0 ; i<6 ; i++) {
        if(code[i].trim() === '') {
          setAlertType("error")
          setAlertMessage("Space or Whitespace character not allowed")
          setIsAlert(true)
          setTimeout(() => {
            setIsAlert(false)
            setAlertMessage("")
            setAlertType("success")
            }, 3000)
  
            return 
        } 

        user_key_string += code[i]
      }

      user_key_string = user_key_string.trim()


      if(user_key_string.length < 6) {
        setAlertType("error")
        setAlertMessage("Key Should be of length 6")
        setIsAlert(true)
        setTimeout(() => {
          setIsAlert(false)
          setAlertMessage("")
          setAlertType("success")
          }, 3000)

          return 
      }

      let payload = JSON.stringify( {user_key: user_key_string, id: user_details.id  } )
      let res = await verify_user_request_call(payload);
      
      if (!res!.status) {
        setAlertType("error")
        setAlertMessage(res.error_message)
        setIsAlert(true)
        setTimeout(() => {
          setIsAlert(false)
          setAlertType("success")
          setAlertMessage("")
          }, 3000)
      } else {
        setAlertType("success")
        setAlertMessage("User Verified. Redirecting to HomeScreen")
        setIsAlert(true)
  
        await updateUserVerifiedStatus(true)

        //send actual token
        conn?.connect({token: "token" , user_id: user_details.id, username: user_details.username})
        setTimeout(() => {
          setIsAlert(false)
          setAlertType("success")
          setAlertMessage("")
          navigate("/home")
          }, 2000)
  
          
      }
   
    
    }
    
    // const handleValueChanges = (event: React.ChangeEvent<HTMLInputElement>) => {
  
    //   const {id , value} = event.target
  
    //   if ( id === "userkeyvalue") {
    //     setUserKey(value)
    //   }
  
    // }


    const handleChange = (index, e) => {
      const value = e.target.value;
      
      // Only allow numeric input
      // if (isNaN(value)) return;
  
      // Create a copy of the current OTP state
      const newOtp = [...code];
      newOtp[index] = value;
      setVerificationCode(newOtp);
  
      // Auto-focus to next input if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    };
  
    const handleKeyDown = (index: number, e) => {
      // Allow backspace to delete and move focus back
      if (e.key === 'Backspace' && !code[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    };


    const deleteUserDetailsAndGoToAuthScreen = async () => {
      await deleteUserDetailsFromStore().then(async () => {
          
        await resetUserModelState()

          navigate("/auth")
 
        })
    }

    const sendEmailAgain = async () => {
      if(!initialCall) {
        setInitialCall(true)
      }

      if(retries === 0) {
        setAlertMessage("You have exhausted all retries. Try to login later")
        setAlertType("error")
        setIsAlert(true)
        setSendingEmail(false)
        setTimeout(() => {
            setIsAlert(false)
        } , 4000)

        return
      }


      
      setSendingEmail(true)
      let json_string = JSON.stringify({id: user_details.id, to_email: user_details.email})
      let rsp = await send_email_call(json_string);
      // console.log("EMAIL RSP was")
      // console.log(rsp)

      if (!rsp.status) {
          setAlertMessage(rsp.error_message)
          setAlertType("error")
          setIsAlert(true)
          setSendingEmail(false)
          setTimeout(() => {
              setIsAlert(false)
          } , 4000)
        } else {
          setAlertMessage("Email Sent. Please Check your Email")
          setAlertType("success")
          const newTime = new Date()
          newTime.setSeconds( newTime.getSeconds() +  (4-retries)*60 )

          setDisableSend(true)
          setIsAlert(true)
          restart(newTime)

          setRetries(retries-1)
        setSendingEmail(false)
        setTimeout(() => {
          
            setIsAlert(false)
        } , 4000)
      }
    }

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
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Please Verify Your Account
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Check you email for the code. 
      </p>

      <p className='text-sm text-zinc-400 mb-2'>Check your spam folder if you don't see anything in inbox</p>

      {isAlert ? alertType === "success" ? <SuccessAlert message={alertMessage} /> : <ErrorAlert message={alertMessage} /> : <div></div>}

        {
          !initialCall ? <div> </div> :       
            sendingEmail || verifying ? <span className="loading loading-dots loading-lg"></span> :   
            <form className="my-3 text-base" onSubmit={handleUserLogin}>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="userkeyvalue" className="text-left" >Code: </Label>
                <div 
                  className="flex justify-center items-center space-x-2"
                  onPaste={() => {}}
                >
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      ref={(el) => inputRefs.current[index] = el}
                      onChange={(e) => handleChange(index, e)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-2xl 
                                border-2 border-gray-300 rounded-lg 
                                focus:outline-none focus:border-blue-500 
                                focus:ring-2 focus:ring-blue-200 
                                transition-all duration-300"
                    />
                  ))}
                </div>
              </LabelInputContainer>
        
              <button
                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                type="submit"
              >
                Verify Key &rarr;
                <BottomGradient />
              </button>
        
              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        
            </form>
          
        }
  
      
        {
          !initialCall ?      <div className="flex flex-col space-y-4">
    
          <button
            className=" relative group/btn flex flex-row space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            onClick={sendEmailAgain}
            disabled={sendingEmail || verifying }
          >
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
            Send Verifying Token
            </span>
            
            <IconMail className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <BottomGradient />
          </button>
          </div>  :      <>
          <div className="flex flex-col space-y-4">
    
          {
            disableSend ? <div className='text-white'> 
              <span>  Time before you can get a new Code: { minutes === 0 && seconds < 10 ? <><span>{minutes}</span>:<span>{0}</span><span>{seconds}</span> </> : <> <span>{minutes}</span>:<span>{seconds}</span> </>} </span>

            </div>   :     <button
            className=" relative group/btn flex flex-row space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            onClick={sendEmailAgain}
        
            disabled={sendingEmail || verifying || disableSend}
          >
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
             Didn't Received Any Email ? <div className='text-sky-700'>Resend</div>
            </span>
            
            <div className='ml-1'>
      
            </div>
      
            <IconMail className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
      
            <BottomGradient />
          </button>
          }
    </div>
  
    <div className='mt-4'>
    <button className="btn btn-error" onClick={() => {
        deleteUserDetailsAndGoToAuthScreen()
    }} disabled={sendingEmail || verifying}>Try Login With Different User</button>
    </div>
    </>
        }
     
    </div>
    </motion.div>
  </AuroraBackground>
    )
}


const BottomGradient = () => {
    return (
      <>
        <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
      </>
    );
  };
   
  

export default VerifyUserScreen