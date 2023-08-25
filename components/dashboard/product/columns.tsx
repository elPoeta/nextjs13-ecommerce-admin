"use client"

import { ColumnDef } from "@tanstack/react-table"
import { z } from "zod"
import CellAction from "./cell-action"

export const ProductColumnSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.string(),
  category: z.string(),
  size: z.string(),
  color: z.string(),
  isFeatured: z.boolean(),
  isArchived: z.boolean(),
  createdAt: z.string()

})

export type ProductColumn = z.infer<typeof ProductColumnSchema>

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.color}
        <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: row.original.color }} />
      </div>
    )
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "action",
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
