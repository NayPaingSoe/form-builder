<template>
  <div class="grid mt-12 grid-cols-5 gap-2 w-full h-screen text-gray-900">
    <!-- Left Sidebar -->
    <aside class="col-span-1 border-r bg-white p-4 flex flex-col rounded-sm">
      <div class="grid grid-cols-2 gap-2 overflow-y-auto">
        <Button
          v-for="(field, i) in fields"
          :key="i"
          variant="outline"
          class="w-full"
          @click="selectedField = field"
        >
          {{ field.label }}
        </Button>
      </div>
    </aside>

    <!-- Main Canvas -->
    <main class="col-span-2 flex-1">
      <NoSelectedFormBuilder v-if="selectedField.value === ''" />
      <TextFromBuilder v-if="selectedField.value === 'text'" />
      <RadioFormBuilder v-if="selectedField.value === 'radio'" />
      <NumberFormBuilder v-if="selectedField.value === 'number'" />
    </main>

    <main class="col-span-2 flex-1">
      <PreviewForm />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import PreviewForm from '@/components/ui/PreviewForm.vue'
import TextFromBuilder from '@/components/ui/TextFromBuilder.vue'
import NoSelectedFormBuilder from '@/components/ui/NoSelectedFormBuilder.vue'
import RadioFormBuilder from '@/components/ui/RadioFormBuilder.vue'
import NumberFormBuilder from '@/components/ui/NumberFormBuilder.vue'

const fields = [
  { label: 'Text Field', value: 'text' },
  { label: 'Number Field', value: 'number' },
  { label: 'Radio Buttons', value: 'radio' },
]

const selectedField = ref({ label: '', value: '' })
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 9999px;
}
</style>
