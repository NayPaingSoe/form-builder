<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFormBuilderStore } from '@/stores/form_builder'
import { toast } from 'vue-sonner'

interface TextFieldItem {
  name: string
  display: { label?: string; placeholder?: string }
  rule?: string
  props: { maxlength?: number }
  prefill: { value?: string }
  builder: { type: string }
  layout: 'Normal' | 'Compact'
  type: 'Text'
}

const textInputFields = ref<TextFieldItem>({
  name: '',
  display: {
    label: '',
    placeholder: '',
  },
  props: {
    maxlength: 40,
  },
  prefill: {
    value: '',
  },
  builder: {
    type: 'simple_input',
  },
  layout: 'Normal',
  type: 'Text',
})

const store = useFormBuilderStore()

function saveField() {
  const key = textInputFields.value.name || 'field'
  const item = { ...textInputFields.value, name: key }
  store.addItem(item)
  toast.success('Success', {
    description: 'Text Field has been created',
  })
  // reset form fields
  resetFormInputs()
  console.log(store.items)
}

const requiredBool = computed({
  get: () => textInputFields.value.rule === 'required',
  set: (v: boolean) => {
    if (v) textInputFields.value.rule = 'required'
    else delete textInputFields.value.rule
  },
})

function resetFormInputs() {
  textInputFields.value = {
    name: '',
    display: { label: '', placeholder: '' },
    props: { maxlength: 280 },
    prefill: { value: '' },
    builder: { type: 'simple_input' },
    layout: 'Normal',
    type: 'Text',
  }
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
        <Input v-model="textInputFields.name" placeholder="unique_field_name" />
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Label</label>
        <Input v-model="textInputFields.display.label" placeholder="" />
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Placeholder</label>
        <Input v-model="textInputFields.display.placeholder" placeholder="" />
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Predefined Value</label>
        <Input v-model="textInputFields.prefill.value" placeholder="" />
      </div>

      <div class="pb-4 flex items-center gap-2">
        <input id="required" type="checkbox" v-model="requiredBool" />
        <label for="required" class="text-sm font-medium text-gray-700">Required</label>
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Max Length</label>
        <Input
          v-model.number="textInputFields.props.maxlength"
          type="number"
          min="1"
          placeholder="280"
        />
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Layout</label>
        <select v-model="textInputFields.layout" class="border rounded px-3 py-2 text-sm w-full">
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
