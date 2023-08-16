'use client'

import React, { FC } from 'react'
import { Plus } from 'lucide-react'

import Heading from '@/components/common/Heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useRouter, useParams } from 'next/navigation'

import { DataTable } from './data-table'
import ApiList from '@/components/common/ApiList'
import { CategoryColumn, columns } from './columns'

interface CategoriesProps {
  categoryColumns: CategoryColumn[];
}

const Categories: FC<CategoriesProps> = ({ categoryColumns }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Categories (${categoryColumns.length})`}
          description='Manage Categories for your store.'
        />
        <Button onClick={() => { router.push(`/${params.storeId}/categories/0`) }}>
          <Plus className='h-4 w-4 mr-2' />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={categoryColumns} searchKey='name' />
      <Heading title='API' description='API calls from categories' />
      <Separator />
      <ApiList entityName='categories' entityIdName='categoryId' />
    </>
  )
}

export default Categories