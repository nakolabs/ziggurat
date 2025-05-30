<template>
  <div
    class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden"
  >
    <!-- Loading State -->
    <div v-if="loading" class="p-8 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
      <p class="mt-2 text-gray-600 dark:text-gray-400">{{ loadingText }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!data || data.length === 0" class="p-8 text-center">
      <slot name="empty">
        <p class="text-gray-600 dark:text-gray-400">{{ emptyText }}</p>
      </slot>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-neutral-50 dark:bg-neutral-700">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              :class="column.headerClass"
            >
              {{ column.title }}
            </th>
            <th
              v-if="showActions"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200 dark:divide-neutral-700">
          <tr
            v-for="(item, index) in data"
            :key="getRowKey(item, index)"
            class="hover:bg-neutral-50 dark:hover:bg-neutral-700"
            :class="[
              rowClass,
              {
                'bg-neutral-50 dark:bg-neutral-700':
                  activeDropdownRowKey === getRowKey(item, index),
              },
            ]"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4"
              :class="column.cellClass"
            >
              <slot
                :name="`cell-${column.key}`"
                :item="item"
                :value="getNestedValue(item, column.key)"
                :index="index"
              >
                <span v-if="column.render">
                  <component
                    :is="column.render"
                    :value="getNestedValue(item, column.key)"
                    :item="item"
                  />
                </span>
                <span v-else class="text-sm text-gray-900 dark:text-white">
                  {{ formatCellValue(getNestedValue(item, column.key), column) }}
                </span>
              </slot>
            </td>
            <td v-if="showActions" class="px-6 py-4">
              <slot name="actions" :item="item" :index="index">
                <div v-if="useDropdownActions" class="flex items-left pl-4">
                  <DropdownMenu
                    :actions="dropdownActions"
                    :item="item"
                    @dropdown-open="setActiveDropdownRow(getRowKey(item, index))"
                    @dropdown-close="clearActiveDropdownRow"
                  />
                </div>
                <div v-else class="flex items-center space-x-2">
                  <button
                    v-for="action in actions"
                    :key="action.key"
                    @click="action.handler(item)"
                    :class="
                      action.class ||
                      'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300'
                    "
                    :title="action.title"
                  >
                    <component :is="action.icon" class="w-4 h-4" />
                  </button>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Slot -->
    <div
      v-if="showPagination"
      class="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700"
    >
      <slot name="pagination" />
    </div>
  </div>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
import type { Component } from 'vue'
import { ref, computed } from 'vue'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import DropdownMenu from './DropdownMenu.vue'
import type { DropdownAction } from '@/types/table'

export interface TableColumn {
  key: string
  title: string
  render?: Component
  formatter?: (value: any) => string
  headerClass?: string
  cellClass?: string
  sortable?: boolean
}

export interface TableAction {
  key: string
  icon: Component
  handler: (item: any) => void
  title?: string
  class?: string
}

interface Props {
  data?: T[]
  columns: TableColumn[]
  actions?: TableAction[]
  dropdownActions?: DropdownAction[]
  useDropdownActions?: boolean
  loading?: boolean
  loadingText?: string
  emptyText?: string
  rowKey?: string | ((item: T) => string | number)
  rowClass?: string
  showActions?: boolean
  showPagination?: boolean
  currentPage?: number
  totalPages?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  actions: () => [],
  dropdownActions: () => [],
  useDropdownActions: false,
  loading: false,
  loadingText: 'Loading...',
  emptyText: 'No data found',
  rowKey: 'id',
  rowClass: '',
  showActions: true,
  showPagination: false,
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  sortOrder: 'asc',
})

const emit = defineEmits<{
  (e: 'sort', key: string, order: 'asc' | 'desc'): void
  (e: 'page-change', page: number): void
}>()

const activeDropdownRowKey = ref<string | number | null>(null)

function setActiveDropdownRow(rowKey: string | number) {
  activeDropdownRowKey.value = rowKey
}

function clearActiveDropdownRow() {
  activeDropdownRowKey.value = null
}

function getRowKey(item: T, index: number): string | number {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(item)
  }
  return item[props.rowKey] || index
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

function formatCellValue(value: any, column: TableColumn): string {
  if (column.formatter) {
    return column.formatter(value)
  }

  if (value === null || value === undefined) {
    return '-'
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  if (typeof value === 'string' && value.length > 50) {
    return value.substring(0, 50) + '...'
  }

  return String(value)
}

const handleSort = (column: TableColumn) => {
  if (!column.sortable) return

  const newOrder = props.sortBy === column.key && props.sortOrder === 'asc' ? 'desc' : 'asc'
  emit('sort', column.key, newOrder)
}

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-change', page)
  }
}

const getCellValue = (item: T, column: TableColumn) => {
  if (column.render) {
    return getNestedValue(item, column.key)
  }
  return (item as any)[column.key] || ''
}

const getSortIcon = (column: TableColumn) => {
  if (!column.sortable || props.sortBy !== column.key) return null
  return props.sortOrder === 'asc' ? ChevronUp : ChevronDown
}
</script>
