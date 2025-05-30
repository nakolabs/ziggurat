import type { Component } from 'vue'

export type TableColumn = {
  key: string
  title: string
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

export type DropdownAction = {
  key: string
  label: string
  icon: Component
  handler: (item: any) => void
  class?: string
}
