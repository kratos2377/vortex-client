import { Label } from '@radix-ui/react-label'
import React, { useState } from 'react'
import { Input } from '../../components/ui/input'
import { cn } from '../../utils/cn'

const GuessWordInput = () => {

    const [guessedWord , setGuessedWord] = useState("")

    const handleScribbleGuess = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submitted");
    }


    
      const handleValueChanges = (event: React.ChangeEvent<HTMLInputElement>) => {
    
        const {id , value} = event.target
    
        if ( id === "scribbleguess") {
            setGuessedWord(value)
        }

      }
    

  return (
    <div>
            <form className="flex my-3 text-md justify-center" onSubmit={handleScribbleGuess} typeof='submit'>
      <div className="flex flex-col w-1/2 mb-4">
        <LabelInputContainer >
          <Label htmlFor="scribbleguess" className="text-left">Enter Your Guess</Label>
          <Input id="scribbleguess" placeholder="scribble" type="text" onChange={handleValueChanges} className='dark:bg-white' />
        </LabelInputContainer>

      </div>
   
    </form>
    </div>
  )
}

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

export default GuessWordInput