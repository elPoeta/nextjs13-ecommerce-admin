import { db } from "@/db";
import { store } from "@/db/schema/store";
import { getAuthSession } from "@/lib/auth/auth-options";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";

interface DasboardLayoutProps {
  children: ReactNode,
  params: {
    storeId: number
  }
}
const DasboardLayout: FC<DasboardLayoutProps> = async ({ children, params }) => {
  const { storeId } = params
  const session = await getAuthSession();
  if (!session || session.user.role !== 'admin') {
    redirect('/sign-in')
  }

  const storeExist = await db.query.store.findFirst({
    where: and(eq(store.id, storeId), eq(store.userId, parseInt(session.user.id)))
  })

  if (!storeExist) {
    redirect('/')
  }

  return (
    <>
      <div>
        Dasboard Nav here
        {children}
      </div>
    </>
  )
}

export default DasboardLayout