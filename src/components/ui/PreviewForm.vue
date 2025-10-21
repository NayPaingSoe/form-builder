<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFormBuilderStore } from '@/stores/form_builder'

// const store = useFormBuilderStore()
// console.log(store.items)
const formValue = {
  name: 'full_name',
  display: {
    label: 'Full Name',
    placeholder: 'Enter Full Name',
  },
  rule: 'required',
  props: {
    maxlength: 280,
  },
  prefill: {
    value: 'mgmg',
  },
  builder: {
    type: 'simple_input',
  },
  layout: 'Normal',
  type: 'Text',
}
</script>

<template>
  <Card class="w-full flex flex-col rounded-sm justify-start p-6">
    <CardHeader>
      <CardTitle class="text-lg font-semibold pl-6">Preview Form</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4 w-full">
      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Name</label>
        <Input v-model="name" placeholder="unique_field_name" />
      </div>
    </CardContent>

    <CardFooter class="flex justify-between pt-4">
      <Button class="bg-blue-600 text-white hover:bg-blue-700">Save</Button>
    </CardFooter>
  </Card>
  <pre>

    {{ store }}
  </pre>
</template>
