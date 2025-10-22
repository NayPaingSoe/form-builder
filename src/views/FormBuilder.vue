<template>
  <div class="grid mt-12 grid-cols-5 gap-3 w-full min-h-[80vh] text-slate-900">
    <!-- Left Sidebar -->
    <aside
      class="col-span-1 border border-slate-200/70 bg-white/70 shadow-sm rounded-xl backdrop-blur overflow-hidden"
    >
      <p class="text-sm md:text-base font-semibold tracking-tight text-slate-900 p-3 pl-4">
        Fields
      </p>
      <hr class="border-slate-200/70 w-full" />
      <div class="grid grid-cols-2 gap-2 overflow-y-auto p-1">
        <Button
          v-for="(field, i) in fields"
          :key="i"
          variant="outline"
          class="px-1 w-full h-9 rounded-md font-medium! text-xs flex items-center gap-2 justify-start"
          @click="selectFieldHandler(field)"
        >
          <component :is="iconByValue[field.value]" class="h-4 w-4 stroke-[1.75]" />
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
      <DateFormBuilder v-if="store.selectedField.value === 'date'" />
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
import DateFormBuilder from '@/components/ui/DateFormBuilder.vue'
import { useFormBuilderStore } from '@/stores/form_builder'
import type { Component } from 'vue'
import { Heading1, Type, Calculator, CircleDot, Calendar } from 'lucide-vue-next'
type FieldValue = 'heading' | 'text' | 'number' | 'radio' | 'date'
type FieldDef = { label: string; value: FieldValue }
const fields: FieldDef[] = [
  { label: 'Heading', value: 'heading' },
  { label: 'Text Input', value: 'text' },
  { label: 'Number', value: 'number' },
  { label: 'Radio Btn', value: 'radio' },
  { label: 'Date', value: 'date' },
]

const store = useFormBuilderStore()

const iconByValue: Record<FieldValue, Component> = {
  heading: Heading1,
  text: Type,
  number: Calculator,
  radio: CircleDot,
  date: Calendar,
}

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
