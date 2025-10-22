<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useFormBuilderStore } from '@/stores/form_builder'
import { toast } from 'vue-sonner'
import type { inputsFieldsT } from '@/lib/types'

const { item } = defineProps<{ item: inputsFieldsT }>()
const store = useFormBuilderStore()

function deleteField() {
  if (!item?.name) return
  store.removeItemByName(item.name)
  toast.success('Success', { description: 'Field has been deleted' })
}

function editField() {
  store.setSelectedField({ label: 'Heading', value: 'heading' })
  store.startEditText(item)
}
</script>

<template>
  <div class="flex items-center justify-between py-2">
    <p class="text-lg font-semibold">{{ item.display?.label }}</p>
    <div class="flex gap-2">
      <Button size="icon" variant="secondary" class="h-8 w-8 text-blue-600" @click="editField">
        ✎
      </Button>
      <Button size="icon" variant="destructive" class="h-8 w-8" @click="deleteField"> − </Button>
    </div>
  </div>
</template>
