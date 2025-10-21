<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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
  prefill: { value: '' },
  value_constraints: { maximum: 0, allow_decimal: 0 },
  visible: { duration: '' },
  builder: { type: 'simple_input' },
  layout: 'Normal',
  type: 'Number',
})

const store = useFormBuilderStore()

function saveField() {
  const targetName =
    store.isEditingText && store.editingItemName
      ? store.editingItemName
      : numberInputFields.value.name || 'field'
  const updated: NumberFieldInputsT = { ...numberInputFields.value, name: targetName }

  const idx = store.items.findIndex((it) => it.name === targetName)
  if (idx !== -1) {
    const next = [...store.items]
    next[idx] = updated
    store.items = next
    toast.success('Success', { description: 'Number Field has been updated' })
    if (store.isEditingText) store.cancelEditText()
  } else {
    store.addItem(updated)
    toast.success('Success', { description: 'Number Field has been created' })
    resetFormInputs()
  }
  console.log(store.items)
}

function resetFormInputs() {
  numberInputFields.value = {
    name: '',
    display: { label: '', placeholder: '' },
    prefill: { value: '' },
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

watch(
  () => store.isEditingText,
  (editing) => {
    if (editing && store.editTextDraft) {
      const { display, prefill, value_constraints, visible, builder, layout, rule, name, type } =
        store.editTextDraft
      numberInputFields.value = {
        name: name,
        display: { label: display?.label, placeholder: display?.placeholder },
        rule,
        prefill: { value: prefill?.value ? +prefill.value : '' },
        value_constraints: {
          maximum: value_constraints?.maximum || 0,
          allow_decimal: value_constraints?.allow_decimal || 0,
        },
        visible: { duration: visible?.duration || '' },
        builder: { type: builder?.type },
        layout: layout,
        type: type,
      }
    }
  },
)
</script>

<template>
  <!-- <Card class="w-full h-full flex flex-col items-center rounded-sm justify-start p-6"> -->
  <Card class="w-full flex flex-col rounded-sm justify-start p-6">
    <CardHeader>
      <CardTitle class="text-lg font-semibold">Number</CardTitle>
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
