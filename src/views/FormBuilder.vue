<template>
  <div class="grid mt-12 grid-cols-5 gap-4 w-full min-h-[80vh] text-slate-900">
    <!-- Left Sidebar -->
    <aside class="col-span-1 border border-slate-200/70 bg-white/70 shadow-sm rounded-xl backdrop-blur overflow-hidden">
      <p class="text-sm md:text-base font-semibold tracking-tight text-slate-900 p-3 pl-4">Fields</p>
      <hr class="border-slate-200/70 w-full" />
      <div class="grid grid-cols-2 gap-2 overflow-y-auto p-4">
        <Button
          v-for="(field, i) in fields"
          :key="i"
          variant="outline"
          class="w-full h-9 rounded-md"
          @click="selectFieldHandler(field)"
        >
          {{ field.label }}
        </Button>
      </div>
    </aside>

    <main class="col-span-2 flex-1">
      <NoSelectedFormBuilder v-if="store.selectedField.value === ''" />
      <HeadingFormBuilder v-if="store.selectedField.value === 'heading'" />
      <TextFormBuilder v-if="store.selectedField.value === 'text'" />
      <RadioFormBuilder v-if="store.selectedField.value === 'radio'" />
      <NumberFormBuilder v-if="store.selectedField.value === 'number'" />
    </main>

    <main class="col-span-2 flex-1 min-h-[80vh]">
      <PreviewForm />
    </main>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import PreviewForm from '@/components/ui/PreviewForm.vue'
import TextFormBuilder from '@/components/ui/TextFormBuilder.vue'
import NoSelectedFormBuilder from '@/components/ui/NoSelectedFormBuilder.vue'
import RadioFormBuilder from '@/components/ui/RadioFormBuilder.vue'
import NumberFormBuilder from '@/components/ui/NumberFormBuilder.vue'
import HeadingFormBuilder from '@/components/ui/HeadingFormBuilder.vue'
import { useFormBuilderStore } from '@/stores/form_builder'

const fields = [
  { label: 'Heading', value: 'heading' },
  { label: 'Text Field', value: 'text' },
  { label: 'Number Field', value: 'number' },
  { label: 'Radio Buttons', value: 'radio' },
]

const store = useFormBuilderStore()

function selectFieldHandler(field: { label: string; value: string }) {
  store.setSelectedField(field)
  store.cancelEditText()
}
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
