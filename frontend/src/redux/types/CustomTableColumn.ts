import { ReactNode } from 'react'

export type CustomTableColumn<T, K extends keyof T = keyof T> = {
  id: K
  label: string

  headerClassName?: string
  cellClassName?: string

  headerWidth?: string | number
  cellWidth?: string | number

  /** value is T[K], not T[keyof T] */
  render?: (value: T[K], row: T) => ReactNode
}
