<template>
  <Container>
    <div class="flex min-h-screen min-w-screen">
      <!-- Sidebar -->
      <aside class="w-64 shadow-xl flex flex-col">
        <div class="p-6 text-2xl font-bold border-b">MyApp</div>
        <nav class="flex-1 px-4 py-6 space-y-3">
          <a class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition" href="#">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6"/>
            </svg>
            Dashboard
          </a>
          <a class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition" href="#">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 17v-6h6v6M9 3h6v4H9V3z"/>
            </svg>
            Analytics
          </a>
          <a class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition" href="#">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4"/>
            </svg>
            Settings
          </a>
        </nav>
      </aside>

      <!-- Main -->
      <div class="flex-1 flex flex-col">
        <!-- Header -->
        <header class=" px-6 py-4 shadow-md flex justify-between items-center">
          <h1 class="text-2xl font-semibold">Dashboard</h1>
          <DarkMode/>
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition">Logout</button>
        </header>

        <main class="p-6 overflow-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class=" p-6 rounded-2xl shadow-md">
              <div class="text-sm text-gray-500">Users</div>
              <div class="text-2xl font-bold mt-2">1,240</div>
            </div>
            <div class=" p-6 rounded-2xl shadow-md">
              <div class="text-sm text-gray-500">Revenue</div>
              <div class="text-2xl font-bold mt-2">$28,430</div>
            </div>
            <div class=" p-6 rounded-2xl shadow-md">
              <div class="text-sm text-gray-500">Orders</div>
              <div class="text-2xl font-bold mt-2">3,210</div>
            </div>
            <div class=" p-6 rounded-2xl shadow-md">
              <div class="text-sm text-gray-500">Feedback</div>
              <div class="text-2xl font-bold mt-2">89%</div>
            </div>
          </div>
          
          <div class="p-6 rounded-2xl shadow-md">
            <h2 class="text-xl font-semibold mb-4">Traffic Overview</h2>
            <div class="h-64 flex items-center justify-center text-gray-400">
              [ Chart goes here ]
            </div>
          </div>
        </main>
      </div>
    </div>
  </Container>
</template>

<script lang="ts" setup>
import Container from "@/components/container.vue";
import DarkMode from "@/components/darkMode.vue";
</script>

<style>
body {
  margin: 0;
  font-family: 'Inter', sans-serif;
}
</style>