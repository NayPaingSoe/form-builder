<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { useFormBuilderStore } from '@/stores/form_builder'
import { toast } from 'vue-sonner'

// Keep types permissive to avoid parent-child TS narrowing issues
interface DisplayConf {
  label?: string
  placeholder?: string
}
interface PropsConf {
  maxlength?: number
}
type AnyItem = {
  name: string
  display?: DisplayConf
  rule?: string
  props?: PropsConf
  type?: string
}

const { item, modelValue, propFunction } = defineProps<{
  item: AnyItem
  modelValue: unknown
  propFunction?: (v: string) => void
}>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
const store = useFormBuilderStore()

function onInput(e: Event) {
  const t = e.target as HTMLInputElement
  if (typeof propFunction === 'function') {
    propFunction(t.value)
  } else {
    emit('update:modelValue', t.value)
  }
}

function deleteField() {
  if (!item?.name) return
  store.removeItemByName(item.name)
  toast.success('Success', { description: 'Field has been deleted' })
}
</script>

<template>
  <div class="pb-4">
    <div class="pb-1">
      <label class="text-sm font-medium">
        {{ item.display?.label
        }}<span v-if="item.rule === 'required'" class="text-red-600"> *</span>
      </label>
    </div>
    <div class="flex gap-2">
      <Input
        :value="typeof modelValue === 'string' ? modelValue : String(modelValue ?? '')"
        :placeholder="item.display?.placeholder"
        :maxlength="item.props?.maxlength"
        :required="item.rule === 'required'"
        type="text"
        @input="onInput"
      />
      <Button size="icon" variant="secondary" class="h-8 w-8 text-blue-600"> ✎ </Button>
      <Button size="icon" variant="destructive" class="h-8 w-8" @click="deleteField"> − </Button>
    </div>
  </div>
</template>
