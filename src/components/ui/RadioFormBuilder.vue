<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFormBuilderStore } from '@/stores/form_builder'
import { toast } from 'vue-sonner'

interface RadioOption {
  label: string
  value: string
}

const inputType = ref('Radio')
const name = ref('')
const label = ref('')
const placeholder = ref('')
const options = ref<RadioOption[]>([{ label: 'First Choice', value: 'first_choice' }])
const layout = ref<'Normal' | 'Compact'>('Normal')

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
  const key = name.value || 'field'
  const item = {
    name: key,
    display: { label: label.value, placeholder: placeholder.value },
    enum: options.value.map((o) => ({ label: o.label, value: o.value })),
    builder: { type: 'simple_choice' },
    layout: layout.value,
    type: inputType.value,
  }
  store.addItem(item)
  toast.success('Success', { description: 'Radio Field has been created' })
  resetFormInputs()
  console.log(store.items)
}

function resetFormInputs() {
  name.value = ''
  label.value = ''
  placeholder.value = ''
  options.value = [{ label: 'First Choice', value: 'first_choice' }]
  layout.value = 'Normal'
  inputType.value = 'Radio'
}
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
        <Input v-model="name" placeholder="" />
      </div>

      <!-- Label -->
      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Label</label>
        <Input v-model="label" placeholder="" />
      </div>

      <!-- Placeholder -->
      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Placeholder</label>
        <Input v-model="placeholder" placeholder="" />
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
        <select v-model="layout" class="border rounded px-3 py-2 text-sm w-full">
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
