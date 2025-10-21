<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFormBuilderStore } from '@/stores/form_builder'
import { toast } from 'vue-sonner'
import type { NumberFieldInputsT } from '@/lib/types'

const numberInputFields = ref<NumberFieldInputsT>({
  name: '',
  display: { label: '', placeholder: '' },
  // rule toggled via computed
  prefill: { value: 0 },
  value_constraints: { maximum: 0, allow_decimal: 0 },
  visible: { duration: '' },
  builder: { type: 'simple_input' },
  layout: 'Normal',
  type: 'Number',
})

const store = useFormBuilderStore()

function saveField() {
  const key = numberInputFields.value.name || 'field'
  const item: NumberFieldInputsT = { ...numberInputFields.value, name: key }
  store.addItem(item)
  toast.success('Success', {
    description: 'Number Field has been created',
  })
  // reset form fields
  resetFormInputs()
  console.log(store.items)
}

function resetFormInputs() {
  numberInputFields.value = {
    name: '',
    display: { label: '', placeholder: '' },
    prefill: { value: 0 },
    value_constraints: { maximum: 0, allow_decimal: 0 },
    visible: { duration: '' },
    builder: { type: 'simple_input' },
    layout: 'Normal',
    type: 'Number',
  }
}

const requiredBool = computed({
  get: () => numberInputFields.value.rule === 'required',
  set: (v: boolean) => {
    if (v) numberInputFields.value.rule = 'required'
    else delete numberInputFields.value.rule
  },
})

const allowDecimalBool = computed({
  get: () => numberInputFields.value.value_constraints.allow_decimal === 1,
  set: (v: boolean) => {
    numberInputFields.value.value_constraints.allow_decimal = v ? 1 : 0
  },
})
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
        <Input v-model="numberInputFields.name" placeholder="unique_field_name" />
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Label</label>
        <Input v-model="numberInputFields.display.label" placeholder="" />
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Placeholder</label>
        <Input v-model="numberInputFields.display.placeholder" placeholder="" />
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Predefined Value</label>
        <Input type="number" v-model.number="numberInputFields.prefill.value" placeholder="" />
      </div>

      <div class="pb-4 flex items-center gap-2">
        <input id="required" type="checkbox" v-model="requiredBool" />
        <label for="required" class="text-sm font-medium text-gray-700">Required</label>
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Maximum</label>
        <Input
          v-model.number="numberInputFields.value_constraints.maximum"
          type="number"
          min="1"
          placeholder=""
        />
      </div>

      <div class="pb-4 flex items-center gap-2">
        <input id="allowDecimal" type="checkbox" v-model="allowDecimalBool" />
        <label for="allowDecimal" class="text-sm font-medium text-gray-700">Allow Decimal</label>
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Visible Duration</label>
        <Input v-model="numberInputFields.visible.duration" placeholder="" />
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Layout</label>
        <select v-model="numberInputFields.layout" class="border rounded px-3 py-2 text-sm w-full">
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
