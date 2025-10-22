<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'

const route = useRoute()

function linkClass(path: string) {
  const base = 'text-slate-200 hover:text-white transition-colors px-3.5 py-1.5 rounded-md'
  const active = '!text-white bg-white/10 ring-1 ring-white/10'
  return route.path === path ? `${base} ${active}` : base
}
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 bg-slate-900/80 backdrop-blur border-b border-white/10">
    <div class="max-w-6xl mx-auto flex items-center gap-2 px-4 py-3">
      <RouterLink to="/" :class="linkClass('/')">Form Builder</RouterLink>
      <RouterLink to="/renderer" :class="linkClass('/renderer')">Form Renderer</RouterLink>
    </div>
  </nav>

  <div class="pt-14">
    <RouterView />
  </div>

  <Toaster rich-colors position="top-right" />
</template>

<style scoped></style>
