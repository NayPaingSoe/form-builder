<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFormBuilderStore } from '@/stores/form_builder'
import { toast } from 'vue-sonner'
import { _ } from 'node_modules/tailwindcss/dist/colors-b_6i0Oi7'

const inputType = ref('Text')
const name = ref('')
const label = ref('')
const placeholder = ref('')
const predefined = ref('')
const required = ref(false)
const maxlength = ref<string>('280')
const layout = ref<'Normal' | 'Compact'>('Normal')

const store = useFormBuilderStore()

function saveField() {
  const key = name.value || 'field'
  const maxLenNum = maxlength.value ? Number(maxlength.value) : undefined
  const prefillVal = predefined.value
    ? isNaN(Number(predefined.value))
      ? predefined.value
      : Number(predefined.value)
    : undefined
  const item = {
    name: key,
    display: { label: label.value, placeholder: placeholder.value },
    ...(required.value ? { rule: 'required' } : {}),
    props: {
      ...(maxLenNum ? { maxlength: maxLenNum } : {}),
    },
    ...(prefillVal !== undefined ? { prefill: { value: prefillVal } } : {}),
    builder: { type: 'simple_input' },
    layout: layout.value,
    type: inputType.value,
  }
  store.addItem(item)
  toast.success('Success', {
    description: 'Text Field has been created',
  })
  // reset form fields
  resetFormInputs()
  console.log(store.items)
}
function resetFormInputs() {
  name.value = ''
  label.value = ''
  placeholder.value = ''
  predefined.value = ''
  required.value = false
  maxlength.value = '280'
  layout.value = 'Normal'
  inputType.value = 'Text'
}
</script>

<template>
  <Card class="w-full flex flex-col rounded-sm justify-start p-6">
    <CardHeader>
      <CardTitle class="text-lg font-semibold pl-6">Text</CardTitle>
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
        <Input v-model="predefined" placeholder="" />
      </div>

      <div class="pb-4 flex items-center gap-2">
        <input id="required" type="checkbox" v-model="required" />
        <label for="required" class="text-sm font-medium text-gray-700">Required</label>
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Max Length</label>
        <Input v-model="maxlength" type="number" min="1" placeholder="280" />
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
