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
  <Card class="w-full flex flex-col justify-start pt-4 min-h-[90vh] border border-slate-200/70 bg-white/70 shadow-sm rounded-xl backdrop-blur">
    <CardHeader class="p-0">
      <CardTitle class="text-base md:text-lg font-semibold tracking-tight text-slate-900 pl-12">Heading</CardTitle>
      <hr class="border-slate-200/70 w-full" />
    </CardHeader>
    <div class="p-6 pt-0">
      <CardContent class="space-y-5 w-full max-w-2xl mx-auto">
        <div class="pb-4">
          <label class="text-xs font-medium text-slate-600 mb-2 block"
            >Name <span class="text-red-600">*</span></label
          >
          <Input v-model="fName" placeholder="unique_field_name" class="h-9 rounded-md bg-white/80 border-slate-200 shadow-sm focus:ring-2 focus:ring-slate-950/5 focus:border-slate-400 placeholder:text-slate-400" />
          <span v-if="errors.name" class="text-xs text-rose-600 mt-1 block">{{ errors.name }}</span>
        </div>

        <div class="pb-4">
          <label class="text-xs font-medium text-slate-600 mb-2 block"
            >Label <span class="text-red-600">*</span></label
          >
          <Input v-model="fLabel" placeholder="" class="h-9 rounded-md bg-white/80 border-slate-200 shadow-sm focus:ring-2 focus:ring-slate-950/5 focus:border-slate-400 placeholder:text-slate-400" />
          <span v-if="errors.label" class="text-xs text-rose-600 mt-1 block">{{
            errors.label
          }}</span>
        </div>
      </CardContent>

      <CardFooter class="flex justify-end pt-4">
        <Button @click="onSubmit" class="h-9 px-6 rounded-md bg-slate-900 text-white hover:bg-slate-800 shadow-sm ring-1 ring-slate-900/10">
          {{ store.isEditingText ? 'Update' : 'Add' }}
        </Button>
      </CardFooter>
    </div>
  </Card>
</template>
