<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useFormBuilderStore } from '@/stores/form_builder'
import { toast } from 'vue-sonner'
interface DisplayConf {
  label?: string
  placeholder?: string
}
interface EnumOption {
  label: string
  value: string
}
type AnyItem = {
  name: string
  display?: DisplayConf
  rule?: string
  enum?: EnumOption[]
  type?: string
}

const { item, modelValue } = defineProps<{ item: AnyItem; modelValue: unknown }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
const store = useFormBuilderStore()

function deleteField() {
  if (!item?.name) return
  store.removeItemByName(item.name)
  toast.success('Success', { description: 'Field has been deleted' })
}
</script>

<template>
  <div class="flex flex-col gap-0 pb-4">
    <div class="">
      <label class="text-sm font-medium">
        {{ item.display?.label
        }}<span v-if="item.rule === 'required'" class="text-red-600"> *</span>
      </label>
    </div>
    <div class="flex justify-between gap-2 pt-1">
      <label
        v-for="opt in item.enum || []"
        :key="item.name + '_' + opt.value"
        class="inline-flex items-center gap-2"
      >
        <input
          type="radio"
          :name="item.name"
          :value="opt.value"
          :checked="modelValue === opt.value"
          @change="() => emit('update:modelValue', opt.value)"
        />
        <span class="text-sm">{{ opt.label }}</span>
      </label>
      <div class="flex gap-2">
        <Button
          size="icon"
          variant="secondary"
          class="h-8 w-8 text-blue-600"
          @click="store.setSelectedField({ label: 'Radio Buttons', value: 'radio' })"
        >
          ✎
        </Button>
        <Button size="icon" variant="destructive" class="h-8 w-8" @click="deleteField"> − </Button>
      </div>
    </div>
  </div>
</template>
