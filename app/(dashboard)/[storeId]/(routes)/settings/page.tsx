import SettingsForm from '@/components/dashboard/forms/SettingsForm'
import { db } from '@/db'
import { store } from '@/db/schema/store'
import { getAuthSession } from '@/lib/auth/auth-options'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import React, { FC } from 'react'

interface SettingsPageProps {
  params: {
    storeId: number
  }
}

const SettingsPage: FC<SettingsPageProps> = async ({ params }) => {
  const { storeId } = params
  const session = await getAuthSession()
  if (!session || session.user.role !== 'admin') {
    redirect('/sign-in')
  }
  const storeDb = await db.query.store.findFirst({
    where: eq(store.id, storeId)
  })

  if (!storeDb) {
    redirect('/')
  }

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 pt-6 p-8'>
        <SettingsForm store={storeDb} />
      </div>
    </div>
  )
}

export default SettingsPage