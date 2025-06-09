<template>
  <Container>
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="max-w-md w-full text-center">
        <!-- Visual Element -->
        <div class="mb-8">
          <div class="w-24 h-24 mx-auto mb-6 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.139 0-4.141.839-5.657 2.343M8.343 7.343C9.859 5.827 11.861 5 14 5s4.141.827 5.657 2.343"></path>
            </svg>
          </div>
        </div>

        <!-- Typography -->
        <div class="mb-8">
          <h1 class="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4">
            404
          </h1>
          <h2 class="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Halaman tidak ditemukan
          </h2>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. 
            Halaman mungkin telah dipindahkan atau dihapus.
          </p>
        </div>

        <!-- Actions -->
        <div class="space-y-4">
          <button
            @click="goHome"
            class="w-full sm:w-auto px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Kembali ke Beranda
          </button>
          
          <div class="flex justify-center">
            <button
              @click="goBack"
              class="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium transition-colors duration-200"
            >
              ← Kembali ke halaman sebelumnya
            </button>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import Container from "@/components/container.vue"

const router = useRouter()

function goHome() {
  router.push('/')
}

function goBack() {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>



