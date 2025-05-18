<template>
  <Container>
    <NavBar/>
    <section class="flex flex-col items-center justify-center text-center py-24 px-140">
      <h1 class="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent leading-normal">
        Open Learning Management<br/>System</h1>
      <p class="text-lg md:text-xl mb-8 mt-8 max-w-2xl">
        Solusi terbaik untuk mengelola bisnis y Anda dengan cepat, mudah, dan efisien.
      </p>
      <div class="space-x-4">
        <button
            class="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-gradient-to-r hover:to-orange-400 hover:from-orange-700 transition">
          <router-link to="/register">
            Register
          </router-link>
        </button>
        <button
            class="px-6 py-3 border border-orange-600 text-orange-600 hover:text-orange-400 hover:border-orange-400 rounded-xl transition"
        >
          <router-link to="/login">
            Login
          </router-link>
        </button>
      </div>
    </section>

    <section class="py-20 px-6">
      <h2 class="text-3xl font-semibold text-center mb-12">Fitur Unggulan</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div class="p-6 shadow rounded-xl border">
          <h3 class="text-xl font-bold mb-2">Dashboard Interaktif</h3>
          <p>Lihat performa bisnis Anda secara real-time dalam satu tampilan.</p>
        </div>
        <div class="p-6 shadow rounded-xl border">
          <h3 class="text-xl font-bold mb-2">Manajemen Data Mudah</h3>
          <p>Kelola data pelanggan dan produk dengan cepat dan aman.</p>
        </div>
        <div class="p-6 shadow rounded-xl border">
          <h3 class="text-xl font-bold mb-2">Integrasi API</h3>
          <p>Hubungkan dengan layanan pihak ketiga dengan mudah dan fleksibel.</p>
        </div>
      </div>
    </section>

    <footer class="py-8 text-center border-t mx-140">
      <p class="text-sm text-gray-500">&copy; 2025 ProdukKita. All rights reserved.</p>
    </footer>
  </Container>
</template>

<script lang="ts" setup>
import NavBar from '@/components/NavBar.vue'
import Container from "@/components/container.vue";
</script>
