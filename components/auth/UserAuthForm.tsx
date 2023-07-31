'use client'

import { cn } from "@/lib/utils"
import React, { FC, useState } from "react"
import { signIn } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/Icons"


interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)


  const loginWithGitHub = async () => {
    setIsLoading(true)
    try {
      await signIn('github')
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <Button

        type='button'
        size='sm'
        className='w-full'
        onClick={loginWithGitHub}
        disabled={isLoading}>
        {isLoading ? null : <Icons.gitHub className='h-4 w-4 mr-2 fill-white dark:fill-black' />}
        Github
      </Button>
    </div>
  )
}

export default UserAuthForm