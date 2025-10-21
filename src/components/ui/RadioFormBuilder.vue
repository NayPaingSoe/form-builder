<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFormBuilderStore } from '@/stores/form_builder'
import { toast } from 'vue-sonner'
import type { RadioFieldInputsT } from '@/lib/types'

interface RadioOption {
  label: string
  value: string
}

const options = ref<RadioOption[]>([{ label: 'First Choice', value: 'first_choice' }])
const radioInputFields = ref<RadioFieldInputsT>({
  name: '',
  display: { label: '', placeholder: '' },
  // rule toggled via computed
  enum: [] as unknown as RadioFieldInputsT['enum'],
  builder: { type: 'simple_choice' },
  layout: 'Normal',
  type: 'Radio',
})

const store = useFormBuilderStore()

function addRadio(index: number) {
  options.value.splice(index + 1, 0, { label: 'New Choice', value: 'new_value' })
}

function removeRadio(index: number) {
  if (options.value.length > 1) {
    options.value.splice(index, 1)
  }
}

function saveField() {
  const targetName =
    store.isEditingText && store.editingItemName
      ? store.editingItemName
      : radioInputFields.value.name || 'field'
  const updated: RadioFieldInputsT = {
    ...radioInputFields.value,
    name: targetName,
    enum: options.value.map((o) => ({
      label: o.label,
      value: o.value,
    })) as unknown as RadioFieldInputsT['enum'],
  }

  const idx = store.items.findIndex((it) => it.name === targetName)
  if (idx !== -1) {
    const next = [...store.items]
    next[idx] = updated
    store.items = next
    toast.success('Success', { description: 'Radio Field has been updated' })
    if (store.isEditingText) store.cancelEditText()
  } else {
    store.addItem(updated)
    toast.success('Success', { description: 'Radio Field has been created' })
    resetFormInputs()
  }
  console.log(store.items)
}

function resetFormInputs() {
  radioInputFields.value = {
    name: '',
    display: { label: '', placeholder: '' },
    enum: [] as unknown as RadioFieldInputsT['enum'],
    builder: { type: 'simple_choice' },
    layout: 'Normal',
    type: 'Radio',
  }
  options.value = [{ label: 'First Choice', value: 'first_choice' }]
}

const requiredBool = computed({
  get: () => radioInputFields.value.rule === 'required',
  set: (v: boolean) => {
    if (v) radioInputFields.value.rule = 'required'
    else delete radioInputFields.value.rule
  },
})

// When entering edit mode, load the draft into the form
watch(
  () => store.isEditingText,
  (editing) => {
    if (editing && store.editTextDraft) {
      const { name, display, enum: dEnum, builder, layout, rule } = store.editTextDraft
      radioInputFields.value = {
        name,
        display: { label: display?.label, placeholder: display?.placeholder },
        rule,
        enum: dEnum,
        builder: { type: builder?.type || 'simple_choice' },
        layout,
        type: 'Radio',
      }
      // map enum to options list for editing UI
      options.value = dEnum?.map((o) => ({ label: o.label || '', value: o.value || '' })) || []
    }
  },
)
</script>

<template>
  <Card class="w-full flex flex-col rounded-sm justify-start p-6">
    <CardHeader>
      <CardTitle class="text-lg font-semibold">Radio</CardTitle>
    </CardHeader>

    <CardContent class="space-y-4">
      <!-- Name -->
      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Name</label>
        <Input v-model="radioInputFields.name" placeholder="" />
      </div>

      <!-- Label -->
      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Label</label>
        <Input v-model="radioInputFields.display.label" placeholder="" />
      </div>

      <!-- Placeholder -->
      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Placeholder</label>
        <Input v-model="radioInputFields.display.placeholder" placeholder="" />
      </div>

      <!-- Required -->
      <div class="pb-4 flex items-center gap-2">
        <input id="required" type="checkbox" v-model="requiredBool" />
        <label for="required" class="text-sm font-medium text-gray-700">Required</label>
      </div>

      <!-- Radio Options Section -->
      <div class="pb-4">
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm font-medium text-gray-700">Radio Options</label>
          <div class="flex items-center gap-2 text-sm text-gray-600"></div>
        </div>

        <div class="space-y-2 border rounded-md px-2 pb-2">
          <div
            v-for="(opt, index) in options"
            :key="index"
            class="grid grid-cols-2 gap-2 pt-2 items-center"
          >
            <Input v-model="opt.label" class="w-full" placeholder="" />
            <div class="flex items-center gap-2">
              <Input v-model="opt.value" class="w-full" placeholder="" />
              <Button
                size="icon"
                variant="secondary"
                class="h-8 w-8 text-blue-600"
                @click="addRadio(index)"
              >
                +
              </Button>
              <Button size="icon" variant="destructive" class="h-8 w-8" @click="removeRadio(index)">
                −
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Layout -->
      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Layout</label>
        <select v-model="radioInputFields.layout" class="border rounded px-3 py-2 text-sm w-full">
          <option value="Normal">Normal</option>
          <option value="Compact">Compact</option>
        </select>
      </div>
    </CardContent>

    <!-- Footer -->
    <CardFooter class="flex justify-between pt-4">
      <div class="flex gap-2">
        <Button @click="saveField" class="bg-blue-600 text-white hover:bg-blue-700"> Save</Button>
      </div>
    </CardFooter>
  </Card>
  <pre>

    {{ store }}
  </pre>
</template>
