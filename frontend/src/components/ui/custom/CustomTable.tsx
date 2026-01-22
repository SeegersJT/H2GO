import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CustomTableColumn } from '@/redux/types/CustomTableColumn'

type CustomTableProps<T> = {
  columns: CustomTableColumn<T>[]
  data: T[]
  rowKey?: (row: T, index: number) => string | number
  onRowClick?: (row: T) => void
  emptyMessage?: string
  maxHeight?: string | number
}

export function CustomTable<T>({ columns, data, rowKey, onRowClick, emptyMessage = 'No results found', maxHeight }: CustomTableProps<T>) {
  return (
    <div className="rounded-md border">
      {/* Scrollable container */}
      <div
        className={maxHeight ? 'overflow-y-auto' : ''}
        style={maxHeight ? { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight } : undefined}
      >
        <Table>
          {/* HEADER */}
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={String(col.id)} className={col.headerClassName} style={{ width: col.headerWidth }}>
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}

            {data.map((row, index) => (
              <TableRow
                key={rowKey ? rowKey(row, index) : index}
                className={onRowClick ? 'cursor-pointer' : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => {
                  const value = row[col.id]
                  return (
                    <TableCell key={String(col.id)} className={col.cellClassName} style={{ width: col.cellWidth }}>
                      {col.render ? col.render(value, row) : String(value ?? '')}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
