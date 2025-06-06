import { Label } from '@radix-ui/react-label'
import React, { useContext, useState } from 'react'
import { cn } from '../utils/cn'
import { login_call } from '../helper_functions/apiCall'
import { IconUser } from '@tabler/icons-react'
import { Input } from '../components/ui/input'
import { useNavigate } from 'react-router-dom'
import { saveUserDetails } from '../persistent_storage/save_user_details'
import { useUserStore } from '../state/UserAndGameState'
import { LabelInputContainer } from '../components/ui/LabelInputContainer'
import { Socket } from 'phoenix'
import { socket } from '../socket/socket'
import { WebSocketContext, WebSocketProvider } from '../socket/websocket_provider'

interface LoginProps {
  setAuthState: React.Dispatch<React.SetStateAction<"login" | "registration">>,
  setIsAlert: React.Dispatch<React.SetStateAction<boolean>>,
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>,
  setAlertType: React.Dispatch<React.SetStateAction<"success" | "warning" | "error" | "info">>,
}

const Login: React.FC<LoginProps> = ({setAuthState , setIsAlert , setAlertMessage , setAlertType}) => {
  const {setUserChannel} = useContext(WebSocketContext)
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [usernameoremail, setUsernameOrEmail] = useState("")
  const {updateUserDetails} = useUserStore()
  const [loginCall , setLoginCall] = useState(false)

  const handleUserLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoginCall(true)
    if (password.trim().length < 8) {

      setAlertType("error")
      setAlertMessage("Password field is either empty or has less than 8 characters")
      setIsAlert(true)
      setTimeout(() => {
      setIsAlert(false)
      setAlertType("success")
      setLoginCall(false)
      setAlertMessage("")
      }, 3000)
      return;
    }

    if (usernameoremail.trim().length < 5) {
      setAlertType("error")
      setAlertMessage("Username or Email field is either empty or has less than 5 characters")
      setIsAlert(true)
      setTimeout(() => {
      setIsAlert(false)
      setAlertType("success")
      setLoginCall(false)
      setAlertMessage("")
      }, 3000)
      return;
    }

    let payload = JSON.stringify( {usernameoremail: usernameoremail, pwd: password } )
    let res = await login_call(payload);
    setLoginCall(false)
    if (!res!.status) {
      setAlertType("error")
      setAlertMessage("Invalid Credentials")
      setIsAlert(true)
      setTimeout(() => {
        setIsAlert(false)
        setAlertType("success")
        setAlertMessage("")
        }, 3000)
    } else {
      setAlertType("success")
      setAlertMessage(`Logged In. Redirecting to ${res.user?.verified ? "HomeScreen": "VerificationScreen"}`)
      setIsAlert(true)

      await saveUserDetails(res.user.id, res.token)

      await updateUserDetails(res.user)


      if(res.user?.verified) {
        socket.connect({token: res.token , user_id: res.user.id, username: res.user.username})

        let user_notif_channel = socket.channel("user:notifications:" + res.user.id , {token: res.token , user_id: res.user.id})
        user_notif_channel.join().receive("ok" , (msg) => {
          console.log("successfully joined user channel")
          setUserChannel(user_notif_channel)
        }).receive("error" , (msg) => {
          console.log("Error while joining user notifications channel")
          console.log(msg)
        })


        user_notif_channel.onError((response) => {
          console.log("Some error occured on the user notificaations channel")
          console.log(response)
        })
        
        
      } 

      setTimeout(() => {
        setIsAlert(false)
        setAlertType("success")
        setAlertMessage("")
        
        if (res.user?.verified) {        
            navigate("/home")
        } else {
          navigate("/verify_user")
        }

        }, 2000)

        
    }
  }


  const handleValueChanges = (event: React.ChangeEvent<HTMLInputElement>) => {

    const {id , value} = event.target

    if ( id === "usernameoremail") {
      setUsernameOrEmail(value)
    }

  
    if (id === "password") {
      setPassword(value)
    }

  }

  return (
   
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
    <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
      Welcome to Vortex
    </h2>
    <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
      Please Enter the Details for Login
    </p>

    <form className="my-8 text-base" onSubmit={handleUserLogin}>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="usernameoremail" className="text-left" >Username or email</Label>
        <Input id="usernameoremail" placeholder="tylerdurden_00 or example@gmail.com" type="text" onChange={handleValueChanges}/>
      </LabelInputContainer>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="password" className="text-left">Password</Label>
        <Input id="password" placeholder="••••••••" type="password" onChange={handleValueChanges} />
      </LabelInputContainer>

  {
    loginCall ? <div className='flex justify-center text-white'>
    <span className="loading loading-dots loading-lg"></span>
  </div> :     <button
    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
    type="submit"
  >
    Sign In &rarr;
    <BottomGradient />
  </button>
  }

      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

    </form>

    
      <div className="flex flex-col space-y-4">

  <button
    className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
    onClick={() => {
      setAuthState("registration")
    }}
  >
    <span className="text-neutral-700 dark:text-neutral-300 text-sm">
     Don't have an Account? Register Here 
    </span>
    
    <IconUser className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
    <BottomGradient />
  </button>
  </div>
  </div>

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
 


export default Login