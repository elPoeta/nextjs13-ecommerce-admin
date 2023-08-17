import { db } from '@/db';
import { store } from '@/db/schema/store';
import { getAuthSession } from '@/lib/auth/auth-options';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import React from 'react'

const SetupLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getAuthSession();
  if (!session || session.user.role !== 'admin') {
    redirect('/sign-in')
  }

  const storeExists = await db.query.store.findFirst({
    where: eq(store.userId, session.user.id)
  })

  if (storeExists) {
    redirect(`/${storeExists.id}`)
  }

  return (
    <>
      {children}
    </>
  )
}

export default SetupLayout