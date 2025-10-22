<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'

const route = useRoute()

function linkClass(path: string) {
  const base = 'text-white/80 hover:text-white transition-colors px-5 py-1 rounded'
  const active = '!text-white bg-white/10'
  return route.path === path ? `${base} ${active}` : base
}
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 bg-[#22272d]">
    <div class="max-w-5xl mx-auto flex items-center gap-3 px-4 py-3">
      <RouterLink to="/" :class="linkClass('/')">Form Builder</RouterLink>
      <RouterLink to="/renderer" :class="linkClass('/renderer')">Form Renderer</RouterLink>
    </div>
  </nav>

  <div class="pt-10">
    <RouterView />
  </div>

  <Toaster rich-colors position="top-right" />
</template>

<style scoped></style>
