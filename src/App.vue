<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 bg-[#22272d] p-4 space-x-2.5">
    <RouterLink to="/" class="text-white px-6">Form Builder</RouterLink>
    <RouterLink to="/user" class="text-white">User</RouterLink>
  </nav>

  <RouterView />
</template>

<style scoped></style>
