<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface CheckboxOption {
  label: string
  checked: boolean
}

const label = ref('Check All That Apply')
const helpText = ref('')
const checkboxes = ref<CheckboxOption[]>([
  { label: 'First Choice', checked: true },
  { label: 'Second Choice', checked: false },
])

function addCheckbox(index: number) {
  checkboxes.value.splice(index + 1, 0, { label: `New Choice`, checked: false })
}

function removeCheckbox(index: number) {
  if (checkboxes.value.length > 1) {
    checkboxes.value.splice(index, 1)
  }
}

function saveField() {
  console.log({
    label: label.value,
    helpText: helpText.value,
    checkboxes: checkboxes.value,
  })
}
</script>

<template>
  <Card class="w-full flex flex-col rounded-sm justify-start p-6">
    <CardHeader>
      <CardTitle class="text-lg font-semibold">Checkboxes</CardTitle>
    </CardHeader>

    <CardContent class="space-y-4">
      <!-- Label -->
      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Label</label>
        <Input v-model="label" placeholder="Check All That Apply" />
      </div>

      <!-- Checkboxes Section -->
      <div class="pb-4">
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm font-medium text-gray-700">Checkboxes</label>
          <div class="flex items-center gap-2 text-sm text-gray-600"></div>
        </div>

        <div class="space-y-2 border rounded-md px-2 pb-2">
          <div v-for="(cb, index) in checkboxes" :key="index" class="flex items-center gap-2 pt-2">
            <Input v-model="cb.label" class="flex-1" />
            <Button
              size="icon"
              variant="secondary"
              class="h-8 w-8 text-blue-600"
              @click="addCheckbox(index)"
            >
              +
            </Button>
            <Button
              size="icon"
              variant="destructive"
              class="h-8 w-8"
              @click="removeCheckbox(index)"
            >
              −
            </Button>
          </div>
        </div>
      </div>

      <!-- Help Text -->
      <div>
        <label class="text-sm font-medium text-gray-700">Help Text</label>
        <textarea
          v-model="helpText"
          class="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="Enter help text..."
        ></textarea>
      </div>
    </CardContent>

    <!-- Footer -->
    <CardFooter class="flex justify-between pt-4">
      <div class="flex gap-2">
        <Button @click="saveField" class="bg-blue-600 text-white hover:bg-blue-700"> Save</Button>
      </div>
    </CardFooter>
  </Card>
</template>
