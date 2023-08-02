import { ModeToggle } from "@/components/ui/modeToggle"
import { getAuthSession } from "@/lib/auth/auth-options"
import { RedirectType } from "next/dist/client/components/redirect"
import { redirect } from 'next/navigation'


const HomePage = async () => {
  const session = await getAuthSession()
  if (!session) {
    return redirect('/sign-in', RedirectType.replace);
  } else if (session.user.role !== 'admin') {
    return redirect('/unauthorize', RedirectType.replace);
  }
  return (
    <div>
      <nav className='p-20'>
        <ModeToggle />
      </nav>
      Admin Dashboard
    </div>
  )
}

export default HomePage
