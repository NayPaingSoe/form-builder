<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 bg-[#22272d] p-4 space-x-2.5">
    <RouterLink to="/" class="text-white px-6"> Builder</RouterLink>
    <RouterLink to="/render" class="text-white">Render</RouterLink>
  </nav>

  <RouterView />

  <Toaster rich-colors position="top-right" />
</template>

<style scoped></style>
