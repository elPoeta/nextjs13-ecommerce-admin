import { getAuthSession } from "@/lib/auth/auth-options"
import { RedirectType } from "next/dist/client/components/redirect"
import { redirect } from 'next/navigation'
import Setup from "@/components/home/Setup"


const HomePage = async () => {
  const session = await getAuthSession()

  if (!session) {
    return redirect('/sign-in', RedirectType.replace);
  } else if (session.user.role !== 'admin') {
    return redirect('/unauthorize', RedirectType.replace);
  }
  return <Setup user={session.user} />
}

export default HomePage
