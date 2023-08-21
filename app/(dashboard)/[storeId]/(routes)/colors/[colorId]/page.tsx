import { db } from '@/db'

import { eq } from 'drizzle-orm'
import React, { FC } from 'react'

import { color } from '@/db/schema/color'
import ColorForm from '@/components/dashboard/forms/ColorForm'

interface ColorPageProps {
  params: {
    colorId: string
  }
}

const ColorPage: FC<ColorPageProps> = async ({ params: { colorId } }) => {
  const colorDb = colorId !== 'new' ? await db.query.color.findFirst({
    where: eq(color.id, colorId)
  }) : undefined


  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ColorForm color={colorDb} />
      </div>
    </div>
  )
}

export default ColorPage