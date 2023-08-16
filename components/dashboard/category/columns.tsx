"use client"

import { ColumnDef } from "@tanstack/react-table"
import { z } from "zod"
import CellAction from "./cell-action"



export const CategoryColumnSchema = z.object({
  id: z.number(),
  name: z.string(),
  billboardLabel: z.string(),
  createdAt: z.string()
})

export type CategoryColumn = z.infer<typeof CategoryColumnSchema>

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell: ({ row }) => row.original.billboardLabel
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
