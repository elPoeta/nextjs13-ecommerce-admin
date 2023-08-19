'use client'

import React, { FC } from 'react'
import { Plus } from 'lucide-react'

import Heading from '@/components/common/Heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useRouter, useParams } from 'next/navigation'
import { SizeColumn, columns } from '@/components/dashboard/size/columns'
import { DataTable } from './data-table'
import ApiList from '@/components/common/ApiList'


interface SizeProps {
  sizeColumns: SizeColumn[];
}

const Size: FC<SizeProps> = ({ sizeColumns }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Sizes (${sizeColumns.length})`}
          description='Manage Sizes for your store.'
        />
        <Button onClick={() => { router.push(`/${params.storeId}/sizes/new`) }}>
          <Plus className='h-4 w-4 mr-2' />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={sizeColumns} searchKey='name' />
      <Heading title='API' description='API calls from sizes' />
      <Separator />
      <ApiList entityName='sizes' entityIdName='sizeId' />
    </>
  )
}

export default Size