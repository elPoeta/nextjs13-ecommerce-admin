'use client'

import React, { FC } from 'react'
import { Plus } from 'lucide-react'

import Heading from '@/components/common/Heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useRouter, useParams } from 'next/navigation'
import { DataTable } from './data-table'
import ApiList from '@/components/common/ApiList'
import { ColorColumn, columns } from './columns'


interface ColorProps {
  colorColumns: ColorColumn[];
}

const Color: FC<ColorProps> = ({ colorColumns }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Colors (${colorColumns.length})`}
          description='Manage Colors for your store.'
        />
        <Button onClick={() => { router.push(`/${params.storeId}/colors/new`) }}>
          <Plus className='h-4 w-4 mr-2' />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={colorColumns} searchKey='name' />
      <Heading title='API' description='API calls from colors' />
      <Separator />
      <ApiList entityName='colors' entityIdName='sizeId' />
    </>
  )
}

export default Color