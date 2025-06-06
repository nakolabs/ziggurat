import type { Component } from 'vue'

export interface TableColumn {
  key: string
  title: string
  sortable?: boolean
  width?: string
  render?: Component
  formatter?: (value: any) => string
  headerClass?: string
  cellClass?: string
}

export type TableAction = {
  key: string
  icon: Component
  handler: (item: any) => void
  title?: string
  class?: string
}

export interface DropdownAction {
  key: string
  label: string
  icon: Component
  handler: (item: any) => void
  class?: string
  condition?: (item: any) => boolean
}
