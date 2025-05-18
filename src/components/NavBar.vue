<template>
  <nav
      class="py-3 flex justify-between items-center border-b border-b-neutral-300 dark:border-b-black sticky top-0 z-50 px-140">
    <div class="text-xl font-semibold text-neutral-950 dark:text-neutral-50 flex">
      <router-link class="flex items-center gap-2" to="/">
        <img :src="Logo" alt="Hero" class="w-8"/>
        <span>Genesis Labs</span>
      </router-link>
    </div>

    <button class="md:hidden" @click="toggle">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            d="M4 6h16M4 12h16M4 18h16"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
        />
      </svg>
    </button>

    <div :class="['md:flex gap-4 items-center', isOpen ? 'block' : 'hidden']">
      <router-link class="block py-1 px-2 hover:text-blue-500" to="/">Product</router-link>
      <router-link class="block py-1 px-2 hover:text-blue-500" to="/">Docs</router-link>
      <router-link class="block py-1 px-2 hover:text-blue-500" to="/landing">About</router-link>
      <router-link class="block py-1 px-2 hover:text-blue-500" to="/about">Support Us</router-link>
      <div class="border-l border-neutral-300 dark:border-neutral-800 h-8"></div>
      <DarkMode/>
      <router-link to="/github">
        <Github :size="24" class="text-neutral-500 dark:text-neutral-400"/>
      </router-link>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import Logo from '@/assets/logo.png'
import {Github} from "lucide-vue-next";
import {ref} from "vue";
import DarkMode from "@/components/darkMode.vue";


const isOpen = ref(false)
const toggle = () => (isOpen.value = !isOpen.value)
</script>
