<script setup lang="ts">
import { watch } from 'vue'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFormBuilderStore } from '@/stores/form_builder'
import type { inputsFieldsT } from '@/lib/types'
import { toast } from 'vue-sonner'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'

const store = useFormBuilderStore()

const schema = yup.object({
  name: yup.string().trim().required('Name is required'),
  label: yup.string().trim().required('Label is required'),
})

const { errors, defineField, handleSubmit, resetForm, setValues } = useForm<{
  name: string
  label: string
}>({
  validationSchema: toTypedSchema(schema),
  initialValues: { name: '', label: '' },
})

const [fName] = defineField('name')
const [fLabel] = defineField('label')

const onSubmit = handleSubmit((values) => {
  const item: inputsFieldsT = {
    name: values.name,
    display: { label: values.label, placeholder: '' },
    builder: { type: 'heading' },
    layout: 'Normal' as const,
    type: 'Heading',
  }
  // Add or update if exists
  const idx = store.items.findIndex((it) => it.name === values.name)
  if (idx !== -1) {
    const next = [...store.items]
    next[idx] = item
    store.items = next
    toast.success('Success', { description: 'Heading updated' })
  } else {
    store.addItem(item)
    toast.success('Success', { description: 'Heading added' })
    resetForm({ values: { name: '', label: '' } })
  }
})

// When entering edit mode, load the draft into the form
watch(
  [() => store.isEditingText, () => store.editTextDraft],
  ([editing, draft]) => {
    if (!editing || !draft) return
    const sel = store.selectedField.value
    if (sel !== 'heading') return
    setValues({
      name: draft?.name || '',
      label: draft?.display?.label || '',
    })
  },
  { immediate: true },
)
</script>

<template>
  <Card class="w-full flex flex-col rounded-sm justify-start pt-4 min-h-[90vh]">
    <CardHeader class="p-0">
      <CardTitle class="text-lg font-semibold pl-12">Heading</CardTitle>
      <hr class="border-gray-300 w-full" />
    </CardHeader>
    <div class="p-6 pt-0">
      <CardContent class="space-y-4 w-full">
        <div class="pb-4">
          <label class="text-sm font-medium text-gray-700"
            >Name <span class="text-red-600">*</span></label
          >
          <Input v-model="fName" placeholder="unique_field_name" />
          <span v-if="errors.name" class="text-xs text-red-600 mt-1 block">{{ errors.name }}</span>
        </div>

        <div class="pb-4">
          <label class="text-sm font-medium text-gray-700"
            >Label <span class="text-red-600">*</span></label
          >
          <Input v-model="fLabel" placeholder="" />
          <span v-if="errors.label" class="text-xs text-red-600 mt-1 block">{{
            errors.label
          }}</span>
        </div>
      </CardContent>

      <CardFooter class="flex justify-center pt-12">
        <Button @click="onSubmit" class="bg-blue-600 text-white hover:bg-blue-700 px-10">
          {{ store.isEditingText ? 'Update' : 'Add' }}
        </Button>
      </CardFooter>
    </div>
  </Card>
</template>
