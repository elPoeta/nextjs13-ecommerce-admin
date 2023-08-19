"use client"

import { ColumnDef } from "@tanstack/react-table"
import { z } from "zod"
import CellAction from "./cell-action"

export const SizeColumnSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.string(),
  createdAt: z.string()

})

export type SizeColumn = z.infer<typeof SizeColumnSchema>

export const columns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
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
