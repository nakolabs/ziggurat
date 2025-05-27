<script lang="ts" setup>
defineProps({
  items: Array<{
    name: string,
    path: string,
  }>
})
</script>

<template>
  <aside class="w-64 shadow-xl flex flex-col">
    <div class="p-6 text-2xl font-bold border-b">MyApp</div>
    <nav class="flex-1 px-4 py-6 space-y-3">
      <a v-for="item in items" :key="item.path"
         :href="item.path" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition">
        {{ item.name }}
      </a>
    </nav>
  </aside>
</template>

<style scoped>

</style>