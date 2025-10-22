<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { useFormBuilderStore } from '@/stores/form_builder'
import { toast } from 'vue-sonner'
import type { inputsFieldsT } from '@/lib/types'

const { item } = defineProps<{
  item: inputsFieldsT
}>()

const store = useFormBuilderStore()

function deleteField() {
  if (!item?.name) return
  store.removeItemByName(item.name)
  toast.success('Success', { description: 'Field has been deleted' })
}
async function editFiled() {
  store.setSelectedField({ label: 'Text Field', value: 'text' })
  store.startEditText(item)
}
</script>

<template>
  <div class="pb-4">
    <div class="pb-1">
      <label class="text-sm font-medium">
        {{ item.display.label }}<span v-if="item.rule === 'required'" class="text-red-600"> *</span>
      </label>
    </div>
    <div class="flex gap-2">
      <Input
        :modelValue="item.prefill?.value"
        :placeholder="item.display?.placeholder"
        :maxlength="item.props?.maxlength"
        :required="item.rule === 'required'"
        type="text"
      />
      <Button size="icon" variant="secondary" class="h-8 w-8 text-blue-600" @click="editFiled">
        ✎
      </Button>
      <Button size="icon" variant="destructive" class="h-8 w-8" @click="deleteField"> − </Button>
    </div>
  </div>
</template>
