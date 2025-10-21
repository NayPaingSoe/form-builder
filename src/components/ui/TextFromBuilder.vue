<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from '@/components/ui/select'

const inputType = ref('Text')
const label = ref('Text Field')
const placeholder = ref('')
const predefined = ref('')
const helpText = ref('')

function saveField() {
  console.log({
    inputType: inputType.value,
    label: label.value,
    placeholder: placeholder.value,
    predefined: predefined.value,
    helpText: helpText.value,
  })
}
</script>

<template>
  <Card class="w-full h-full flex flex-col items-center rounded-sm justify-start p-6">
    <CardHeader>
      <CardTitle class="text-lg font-semibold">Text</CardTitle>
    </CardHeader>

    <CardContent class="space-y-4 w-90">
      <!-- <div>
        <label class="text-sm font-medium text-gray-700">Input Type</label>
        <Select v-model="inputType">
          <SelectTrigger>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Text">Text</SelectItem>
            <SelectItem value="Email">Email</SelectItem>
            <SelectItem value="Number">Number</SelectItem>
            <SelectItem value="Date">Date</SelectItem>
          </SelectContent>
        </Select>
      </div> -->

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Label</label>
        <Input v-model="label" placeholder="Text Field" />
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Placeholder</label>
        <Input v-model="placeholder" placeholder="Enter placeholder..." />
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Predefined Value</label>
        <Input v-model="predefined" placeholder="Default value..." />
      </div>
    </CardContent>

    <CardFooter class="flex justify-between pt-4">
      <Button @click="saveField" class="bg-blue-600 text-white hover:bg-blue-700">✔ Save</Button>
    </CardFooter>
  </Card>
</template>
