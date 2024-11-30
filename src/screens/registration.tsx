import React, { useContext, useState } from 'react'
import { cn } from '../utils/cn';
import { Label } from '@radix-ui/react-label';
import {  IconLogin } from '@tabler/icons-react';
import { Input } from '../components/ui/input';
import { registration_call } from '../helper_functions/apiCall';
import { useNavigate } from 'react-router-dom';
import { saveUserDetails } from '../persistent_storage/save_user_details';
import { useUserStore } from '../state/UserAndGameState';
import { LabelInputContainer } from '../components/ui/LabelInputContainer';
import { WebSocketContext } from '../socket/websocket_provider';


interface RegistrationProps {
  setAuthState: React.Dispatch<React.SetStateAction<"login" | "registration">>,
  setIsAlert: React.Dispatch<React.SetStateAction<boolean>>,
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>,
  setAlertType: React.Dispatch<React.SetStateAction<"success" | "warning" | "error" | "info">>,
}

const Registration:  React.FC<RegistrationProps> = ({setAuthState , setAlertMessage , setIsAlert , setAlertType}) => {
  const {conn} = useContext(WebSocketContext)
  const navigate = useNavigate()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [registerCall , setRegisterCall] = useState(false)
  const [confirmpassword, setConfirmPassword] = useState("")
  const {updateUserDetails} = useUserStore()

  const handleUserRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setRegisterCall(true)


    if (password.trim().length < 8 || confirmpassword.trim().length < 8 || confirmpassword !== password) {

      setAlertType("error")
      setAlertMessage("Password and Confirm Password field are not same or has less than 8 characters")
      setIsAlert(true)
      setTimeout(() => {
      setIsAlert(false)
      setAlertType("success")
      setRegisterCall(false)
      setAlertMessage("")
      }, 4000)
      return;
    }

    if (username.trim().length < 5 || username.includes("@")) {
      setAlertType("error")
      setAlertMessage("Username should have length greater than 5 and should not have @ character")
      setIsAlert(true)
      setTimeout(() => {
      setIsAlert(false)
      setAlertType("success")
      setRegisterCall(false)
      setAlertMessage("")
      }, 4000)
      return;
    }

    if (!emailRegex.test(email)) {
      setAlertType("error")
      setAlertMessage("Invalid Email")
      setIsAlert(true)
      setTimeout(() => {
      setIsAlert(false)
      setAlertType("success")
      setRegisterCall(false)
      setAlertMessage("")
      }, 4000)
      return;
    }

    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setAlertType("error")
      setAlertMessage("Firstname and Lastname should have atleast 2 characters")
      setIsAlert(true)
      setTimeout(() => {
      setIsAlert(false)
      setAlertType("success")
      setRegisterCall(false)
      setAlertMessage("")
      }, 4000)
      return;
    }

    let payload = JSON.stringify( {first_name: firstName , last_name: lastName , email: email,   username: username, password: password } )
    let res = await registration_call(payload);
    setRegisterCall(false)
    if (!res!.status) {
      setAlertType("error")
      setAlertMessage("Some Error Occured. Try again with different email and username")
      setIsAlert(true)
      setTimeout(() => {
        setIsAlert(false)
        setAlertType("success")
        setAlertMessage("")
        }, 3000)
    } else {
      setAlertType("success")
      setAlertMessage("User Registered. Redirecting to VerificationScreen")
      setIsAlert(true)
      await saveUserDetails(res.user.id, res.token)
      await updateUserDetails(res.user)
      setTimeout(() => {
        setIsAlert(false)
        setAlertType("success")
        setAlertMessage("")

        if (res.user?.verified) {
          
          conn?.connect({token: res.token , user_id: res.user.id, username: res.user.username})
            navigate("/home")
          } else {
            navigate("/verify_user")
          }

        }, 2000)
    }
 

  };


  const handleValueChanges = (event: React.ChangeEvent<HTMLInputElement>) => {

    const {id , value} = event.target

    if ( id === "firstname") {
      setFirstName(value)
    }

    if (id === "lastname") {
      setLastName(value)
    }

    if ( id === "username") {
      setUserName(value)
    }


    if (id === "email") {
      setEmail(value)
    }

    if (id === "password") {
      setPassword(value)
    }

    if (id === "confirmpassword") {
      setConfirmPassword(value)
    }
  }


  return (
    <div className="max-w-md text-left w-full mx-auto rounded-none  md:rounded-2xl p-8 py-20 md:p-8 shadow-input bg-white dark:bg-black">
    <p className="text-neutral-600 text-left text-sm max-w-sm mt-2 dark:text-neutral-300">
      Please Enter the Details for registration
    </p>

    <form className="my-8 text-xs" onSubmit={handleUserRegistration}>
      <div className="flex flex-col  md:flex-row space-y-1 md:space-y-0 md:space-x-2 mb-4">
        <LabelInputContainer>
          <Label htmlFor="firstname" className="text-left">First name</Label>
          <Input id="firstname" placeholder="Tyler" type="text" onChange={handleValueChanges} />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="lastname" className="text-left">Last name</Label>
          <Input id="lastname" placeholder="Durden" type="text" onChange={handleValueChanges} />
        </LabelInputContainer>
      </div>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="username" className="text-left" >Username</Label>
        <Input id="username" placeholder="tylerdurden_00" type="text"  onChange={handleValueChanges}/>
      </LabelInputContainer>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="email" className="text-left">Email Address</Label>
        <Input id="email" placeholder="projectmayhem@fc.com" type="email"  onChange={handleValueChanges}/>
      </LabelInputContainer>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="password" className="text-left">Password</Label>
        <Input id="password" placeholder="••••••••" type="password"  onChange={handleValueChanges}/>
      </LabelInputContainer>
      <LabelInputContainer className="mb-8">
        <Label htmlFor="confirmpassword" className="text-left">Confirm Password</Label>
        <Input
          id="confirmpassword"
          placeholder="••••••••"
          type="password"
          onChange={handleValueChanges}
        />
      </LabelInputContainer>

{
    registerCall ? <div className='flex justify-center text-white'>
    <span className="loading loading-dots loading-lg"></span>
  </div> :  <button
        className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        type="submit"
      >
        Sign up &rarr;
        <BottomGradient />
      </button>
}
     

      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[1px] w-full" />

    </form>

    
      <div className="flex flex-col space-y-3">

  <button
    className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
    onClick={() => {
      setAuthState("login")
    }}
  >
    <IconLogin className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
    <span className="text-neutral-700 dark:text-neutral-300 text-sm">
      If you already have an account, Login
    </span>
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
 


export default Registration