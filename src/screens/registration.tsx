import React, { useState } from 'react'
import { cn } from '../utils/cn';
import { Label } from '@radix-ui/react-label';
import {  IconLogin } from '@tabler/icons-react';
import { Input } from '../components/ui/input';


interface RegistrationProps {
  setAuthState: React.Dispatch<React.SetStateAction<string>>
}

const Registration:  React.FC<RegistrationProps> = ({setAuthState}) => {

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmpassword, setConfirmPassword] = useState("")

  const handleUserRegistration = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");

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
          <Input id="lastname" placeholder="Durden" type="text" />
        </LabelInputContainer>
      </div>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="username" className="text-left" >Username</Label>
        <Input id="text" placeholder="tylerdurden_00" type="text" />
      </LabelInputContainer>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="email" className="text-left">Email Address</Label>
        <Input id="email" placeholder="projectmayhem@fc.com" type="email" />
      </LabelInputContainer>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="password" className="text-left">Password</Label>
        <Input id="password" placeholder="••••••••" type="password" />
      </LabelInputContainer>
      <LabelInputContainer className="mb-8">
        <Label htmlFor="confirmpassword" className="text-left">Confirm Password</Label>
        <Input
          id="confirmpassword"
          placeholder="••••••••"
          type="password"
        />
      </LabelInputContainer>

      <button
        className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        type="submit"
      >
        Sign up &rarr;
        <BottomGradient />
      </button>

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
 
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default Registration