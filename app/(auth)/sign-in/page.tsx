import Signin from '@/components/auth/Signin'

export const metadata = {
  title: 'Login',
  description: 'Login to dashboard with your github account',
}


const SigninPage = () => {
  return (
    <div className='absolute inset-0'>
      <div className='h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20'>
        <Signin />

      </div>
    </div>
  )
}

export default SigninPage