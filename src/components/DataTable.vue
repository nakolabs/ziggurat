<template>
  <div
    class="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 overflow-hidden"
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
        <thead class="bg-neutral-50 dark:bg-neutral-800">
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
            class="hover:bg-neutral-50 dark:hover:bg-neutral-950/50"
            :class="[
              rowClass,
              {
                'bg-neutral-50 dark:bg-neutral-700':
                  activeDropdownRowKey === getRowKey(item, index),
                'cursor-pointer': clickableRows,
              },
            ]"
            @click="handleRowClick(item)"
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

    <!-- Modern Pagination -->
    <div
      v-if="showPagination && (totalPages > 1 || (data && data.length > 0))"
      class="px-6 py-4 border-t border-gray-100 dark:border-neutral-700"
    >
      <div class="flex items-center justify-between">
        <!-- Page Size Selector -->
        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Show</span>
          <select
            :value="pageSize"
            @change="handlePageSizeChange"
            class="px-2 py-1 text-sm border border-gray-200 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-colors"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span>per page</span>
        </div>

        <!-- Pagination Controls -->
        <div class="flex items-center gap-3">
          <!-- Previous Button -->
          <button
            @click="handlePageChange(currentPage - 1)"
            :disabled="currentPage <= 1"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-400 dark:hover:bg-neutral-700 dark:hover:text-white dark:disabled:hover:bg-neutral-800 dark:disabled:hover:text-gray-400 transition-colors"
          >
            <ChevronLeft class="w-4 h-4 mr-1" />
            Previous
          </button>

          <!-- Page Numbers -->
          <nav class="flex items-center gap-1" aria-label="Pagination">
            <template v-for="page in visiblePages" :key="page">
              <!-- Page Number -->
              <button
                v-if="typeof page === 'number'"
                @click="handlePageChange(page)"
                :class="[
                  'relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  page === currentPage
                    ? 'bg-gray-900 text-white shadow-sm dark:bg-white dark:text-gray-900'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-300 dark:hover:bg-neutral-700'
                ]"
                :aria-current="page === currentPage ? 'page' : undefined"
              >
                {{ page }}
              </button>
              <!-- Ellipsis -->
              <span
                v-else
                class="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                ...
              </span>
            </template>
          </nav>

          <!-- Next Button -->
          <button
            @click="handlePageChange(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-400 dark:hover:bg-neutral-700 dark:hover:text-white dark:disabled:hover:bg-neutral-800 dark:disabled:hover:text-gray-400 transition-colors"
          >
            Next
            <ChevronRight class="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
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
  totalItems?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  clickableRows?: boolean
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
  totalItems: 0,
  sortOrder: 'asc',
  clickableRows: false,
})

const emit = defineEmits<{
  (e: 'sort', key: string, order: 'asc' | 'desc'): void
  (e: 'page-change', page: number): void
  (e: 'page-size-change', size: number): void
  (e: 'row-click', item: T): void
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

const handlePageSizeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const newSize = parseInt(target.value)
  emit('page-size-change', newSize)
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

const handleRowClick = (item: T) => {
  if (props.clickableRows) {
    emit('row-click', item)
  }
}

// Computed properties for pagination
const startItem = computed(() => {
  return Math.min(((props.currentPage - 1) * props.pageSize) + 1, props.totalItems)
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.totalItems)
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = props.totalPages
  const current = props.currentPage
  
  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)
    
    if (current <= 4) {
      // Show first 5 pages, then ellipsis, then last page
      for (let i = 2; i <= 5; i++) {
        pages.push(i)
      }
      if (total > 6) {
        pages.push('...')
        pages.push(total)
      }
    } else if (current >= total - 3) {
      // Show first page, ellipsis, then last 5 pages
      if (total > 6) {
        pages.push('...')
      }
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // Show first page, ellipsis, current-1, current, current+1, ellipsis, last page
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})
</script>
