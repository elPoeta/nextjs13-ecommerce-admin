import React from 'react'
import DashboardNavigation from './DashboardNavigation'
import StoreSwitcher from './StoreSwitcher'
import { getAuthSession } from '@/lib/auth/auth-options'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { store } from '@/db/schema/store'
import { eq } from 'drizzle-orm'


const DashboardNavbar = async () => {
  const session = await getAuthSession();
  if (!session || session.user.role !== 'admin') {
    redirect('/sign-in')
  }
  const stores = await db.select().from(store).where(eq(store.userId, parseInt(session.user.id)))

  return (
    <div className='border-b'>
      <div className='flex items-center px-4 h-16'>
        <StoreSwitcher items={stores} />
        <DashboardNavigation className='mx-6' />
      </div>
    </div>
  )
}

export default DashboardNavbar