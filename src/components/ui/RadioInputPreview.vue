<script setup lang="ts">
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
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="pb-1">
      <label class="text-sm font-medium">
        {{ item.display?.label
        }}<span v-if="item.rule === 'required'" class="text-red-600"> *</span>
      </label>
    </div>
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
  </div>
</template>
