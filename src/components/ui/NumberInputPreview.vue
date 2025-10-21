<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFormBuilderStore } from '@/stores/form_builder'
import { toast } from 'vue-sonner'

interface DisplayConf {
  label?: string
  placeholder?: string
}
interface NumberConstraints {
  maximum?: number
  allow_decimal?: number
}
type AnyItem = {
  name: string
  display?: DisplayConf
  rule?: string
  value_constraints?: NumberConstraints
  type?: string
}

const { item, modelValue } = defineProps<{ item: AnyItem; modelValue: unknown }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: number | undefined): void }>()
const store = useFormBuilderStore()

function onInput(e: Event) {
  const t = e.target as HTMLInputElement
  const num = t.value === '' ? undefined : Number(t.value)
  emit('update:modelValue', typeof num === 'number' && !isNaN(num) ? num : undefined)
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
        :value="
          typeof modelValue === 'number'
            ? modelValue
            : modelValue === '' || modelValue == null
              ? undefined
              : Number(modelValue)
        "
        :placeholder="item.display?.placeholder"
        :required="item.rule === 'required'"
        type="number"
        :max="item.value_constraints?.maximum"
        :step="item.value_constraints?.allow_decimal ? 'any' : 1"
        @input="onInput"
      />
      <Button size="icon" variant="secondary" class="h-8 w-8 text-blue-600"> ✎ </Button>
      <Button size="icon" variant="destructive" class="h-8 w-8" @click="deleteField"> − </Button>
    </div>
  </div>
</template>
