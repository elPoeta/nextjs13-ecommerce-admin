'use client'

import React from 'react'
import UserAuthForm from './UserAuthForm'

const Signin = () => {


  return (
    <div className='container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]'>
      <div className='flex flex-col space-y-2 text-center'>

        <h1 className='text-2xl font-semibold tracking-tight'>Welcome Back</h1>
        <p className='text-sm max-w-xs mx-auto'>
          By continuing, you are setting up a Admin Dashboard store account and agree to our
          User Agreement and Privacy Policy.
        </p>
      </div>
      <UserAuthForm className='' />
    </div>
  )
}

export default Signin