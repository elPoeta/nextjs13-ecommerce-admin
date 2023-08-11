'use client'

import React, { FC } from 'react'
import { Plus } from 'lucide-react'

import Heading from '@/components/common/Heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface BillboardProps { }

const Billboard: FC<BillboardProps> = ({ }) => {
  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title='Billboards (0)'
          description='Manage Billboards for your store.'
        />
        <Button>
          <Plus className='h-4 w-4 mr-2' />
          Add new
        </Button>
      </div>
      <Separator />
    </>
  )
}

export default Billboard