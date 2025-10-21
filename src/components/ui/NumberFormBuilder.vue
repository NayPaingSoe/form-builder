<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFormBuilderStore } from '@/stores/form_builder'
import { toast } from 'vue-sonner'

const inputType = ref('Number')
const name = ref('')
const label = ref('')
const placeholder = ref('')
const predefined = ref('')
const required = ref(false)
const maximum = ref<string>('')
const allowDecimal = ref(false)
const visibleField = ref('')
const visibleRule = ref('')
const layout = ref<'Normal' | 'Compact'>('Normal')

const store = useFormBuilderStore()

function saveField() {
  const key = name.value || 'field'
  const maxNum = maximum.value ? Number(maximum.value) : undefined
  const prefillVal = predefined.value
    ? isNaN(Number(predefined.value))
      ? predefined.value
      : Number(predefined.value)
    : undefined
  const item = {
    name: key,
    display: { label: label.value, placeholder: placeholder.value },
    ...(required.value ? { rule: 'required' } : {}),
    ...(maxNum !== undefined || allowDecimal.value !== undefined
      ? {
          value_constraints: {
            ...(maxNum !== undefined ? { maximum: maxNum } : {}),
            ...(allowDecimal.value !== undefined
              ? { allow_decimal: allowDecimal.value ? 1 : 0 }
              : {}),
          },
        }
      : {}),
    ...(prefillVal !== undefined ? { prefill: { value: prefillVal } } : {}),
    ...(visibleField.value?.trim() && visibleRule.value?.trim()
      ? { visible: { [visibleField.value.trim()]: visibleRule.value.trim() } }
      : {}),
    builder: { type: 'simple_input' },
    layout: layout.value,
    type: inputType.value,
  }
  store.addItem(item)
  toast.success('Success', {
    description: 'Number Field has been created',
  })
  console.log(store.items)
}
</script>

<template>
  <!-- <Card class="w-full h-full flex flex-col items-center rounded-sm justify-start p-6"> -->
  <Card class="w-full flex flex-col rounded-sm justify-start p-6">
    <CardHeader>
      <CardTitle class="text-lg font-semibold pl-6">Number</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4 w-full">
      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Name</label>
        <Input v-model="name" placeholder="unique_field_name" />
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Label</label>
        <Input v-model="label" placeholder="" />
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Placeholder</label>
        <Input v-model="placeholder" placeholder="" />
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Predefined Value</label>
        <Input type="number" v-model="predefined" placeholder="" />
      </div>

      <div class="pb-4 flex items-center gap-2">
        <input id="required" type="checkbox" v-model="required" />
        <label for="required" class="text-sm font-medium text-gray-700">Required</label>
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Maximum</label>
        <Input v-model="maximum" type="number" min="1" placeholder="" />
      </div>

      <div class="pb-4 flex items-center gap-2">
        <input id="allowDecimal" type="checkbox" v-model="allowDecimal" />
        <label for="allowDecimal" class="text-sm font-medium text-gray-700">Allow Decimal</label>
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Visible When Field</label>
        <Input v-model="visibleField" placeholder="" />
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Visible Rule</label>
        <Input v-model="visibleRule" placeholder="required|is:full" />
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Layout</label>
        <select v-model="layout" class="border rounded px-3 py-2 text-sm w-full">
          <option value="Normal">Normal</option>
          <option value="Compact">Compact</option>
        </select>
      </div>
    </CardContent>

    <CardFooter class="flex justify-between pt-4">
      <Button @click="saveField" class="bg-blue-600 text-white hover:bg-blue-700">Save</Button>
    </CardFooter>
  </Card>
  <pre>

    {{ store }}
  </pre>
</template>
