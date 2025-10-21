<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFormBuilderStore } from '@/stores/form_builder'
import { toast } from 'vue-sonner'
import type { TextFieldInputsT } from '@/lib/types'

const textInputFields = ref<TextFieldInputsT>({
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
  const targetName =
    store.isEditingText && store.editingItemName
      ? store.editingItemName
      : textInputFields.value.name || 'field'
  const updated = { ...textInputFields.value, name: targetName }

  const idx = store.items.findIndex((it) => it.name === targetName)
  if (idx !== -1) {
    // Update existing
    const next = [...store.items]
    next[idx] = updated
    // Directly assign to keep reactivity
    store.items = next
    toast.success('Success', { description: 'Text Field has been updated' })
    if (store.isEditingText) store.cancelEditText()
  } else {
    // Create new
    store.addItem(updated)
    toast.success('Success', { description: 'Text Field has been created' })
    resetFormInputs()
  }
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

// When entering edit mode, load the draft into the form
watch(
  () => store.isEditingText,
  (editing) => {
    if (editing && store.editTextDraft) {
      const { display, props, prefill, builder, layout } = store.editTextDraft
      const name = store.editTextDraft?.name || ''
      textInputFields.value = {
        name,
        display: {
          label: display?.label || '',
          placeholder: display?.placeholder || '',
        },
        ...(store.editTextDraft?.rule ? { rule: store.editTextDraft.rule } : {}),
        props: { maxlength: props?.maxlength || 280 },
        prefill: { value: prefill?.value || '' },
        builder: { type: builder?.type || 'simple_input' },
        layout: layout === 'Compact' ? 'Compact' : 'Normal',
        type: 'Text',
      }
    }
  },
)
</script>

<template>
  <Card class="w-full flex flex-col rounded-sm justify-start p-6">
    <CardHeader>
      <CardTitle class="text-lg font-semibold">Text</CardTitle>
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
