<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFormBuilderStore } from '@/stores/form_builder'
import type { inputsFieldsT } from '@/lib/types'

const { item } = defineProps<{ item: inputsFieldsT }>()
const store = useFormBuilderStore()

function deleteField() {
  if (!item?.name) return
  store.removeItemByName(item.name)
}
function editField() {
  store.setSelectedField({ label: 'Date', value: 'date' })
  store.startEditText(item)
}
</script>

<template>
  <div class="pb-4">
    <label class="text-xs font-medium text-slate-600 mb-2 pb-1 block">
      {{ item.display?.label }}
      <span v-if="item.rule === 'required'" class="text-red-600"> *</span>
    </label>
    <div class="flex gap-2">
      <Input
        :modelValue="item.prefill?.value"
        :placeholder="item.display?.placeholder"
        :required="item.rule === 'required'"
        type="date"
        class="h-9 rounded-md bg-white/80 border-slate-200 shadow-sm focus:ring-2 focus:ring-slate-950/5 focus:border-slate-400 placeholder:text-slate-400"
      />
      <Button size="icon" variant="secondary" class="h-8 w-8 text-blue-600" @click="editField">
        ✎
      </Button>
      <Button size="icon" variant="destructive" class="h-8 w-8" @click="deleteField"> − </Button>
    </div>
  </div>
</template>
