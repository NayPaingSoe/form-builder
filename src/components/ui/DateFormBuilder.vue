<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { toTypedSchema } from '@vee-validate/yup'
import { computed, watch } from 'vue'
import { toast } from 'vue-sonner'
import { useFormBuilderStore } from '@/stores/form_builder'
import type { inputsFieldsT } from '@/lib/types'

const store = useFormBuilderStore()

const dateSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  display: yup.object({
    label: yup.string().trim().required('Label is required'),
  }),
  rule: yup.mixed<'required' | ''>().oneOf(['required', '']).optional(),
  builder: yup.object({ type: yup.string().required() }),
  layout: yup.mixed<'Normal' | 'Compact'>().oneOf(['Normal', 'Compact']).required(),
  type: yup.string().oneOf(['Date']).required(),
})

const { errors, handleSubmit, defineField, setValues, resetForm } = useForm<inputsFieldsT>({
  validationSchema: toTypedSchema(dateSchema),
  initialValues: {
    name: '',
    display: { label: '' },
    rule: '',
    builder: { type: 'simple_input' },
    layout: 'Normal',
    type: 'Date',
  },
})

const [fName] = defineField('name')
const [fLabel] = defineField('display.label')
const [fRule] = defineField('rule')
const requiredBool = computed({
  get: () => (fRule.value as string | undefined) === 'required',
  set: (v: boolean) => {
    ;(fRule.value as string | undefined) = v ? 'required' : undefined
  },
})
const [fLayout] = defineField('layout')

const onSubmit = handleSubmit((values) => {
  const targetName =
    store.isEditingText && store.editingItemName ? store.editingItemName : values.name
  const updated: inputsFieldsT = { ...(values as inputsFieldsT), name: targetName }
  const idx = store.items.findIndex((it) => it.name === targetName)
  if (idx >= 0) {
    store.applyEditText(updated)
    toast.success('Success', { description: 'Date Field has been updated' })
    resetFormInputs()
  } else {
    store.addItem(updated)
    toast.success('Success', { description: 'Date Field has been created' })
    resetFormInputs()
  }
})

function resetFormInputs() {
  resetForm({
    values: {
      name: '',
      display: { label: '' },
      rule: '',
      builder: { type: 'simple_input' },
      layout: 'Normal',
      type: 'Date',
    },
  })
}

watch(
  [() => store.isEditingText, () => store.editTextDraft],
  ([editing, draft]) => {
    if (!editing || !draft) return
    const sel = store.selectedField.value
    if (sel !== 'date') return
    const { name, display, builder, layout, rule, type } = draft
    setValues({
      name: name || '',
      display: { label: display?.label || '' },
      rule: rule || '',
      builder: { type: builder?.type || 'simple_input' },
      layout: layout || 'Normal',
      type: type || 'Date',
    })
  },
  { immediate: true },
)
</script>

<template>
  <Card
    class="w-full flex flex-col justify-start pt-4 border border-slate-200/70 bg-white/70 shadow-sm rounded-xl backdrop-blur"
  >
    <CardHeader class="p-0">
      <CardTitle class="text-base md:text-lg font-semibold tracking-tight text-slate-900 pl-12"
        >Date</CardTitle
      >
      <hr class="border-slate-200/70 w-full" />
    </CardHeader>
    <div class="p-6 pt-0">
      <CardContent class="space-y-5 w-full max-w-2xl mx-auto">
        <div class="pb-4">
          <label class="text-xs font-medium text-slate-600 mb-2 block"
            >Name <span class="text-red-600">*</span></label
          >
          <Input
            v-model="fName"
            placeholder="unique_field_name"
            class="h-9 rounded-md bg-white/80 border-slate-200 shadow-sm focus:ring-2 focus:ring-slate-950/5 focus:border-slate-400 placeholder:text-slate-400"
          />
          <span v-if="errors.name" class="text-xs text-rose-600 mt-1 block">{{ errors.name }}</span>
        </div>

        <div class="pb-4">
          <label class="text-xs font-medium text-slate-600 mb-2 block"
            >Label <span class="text-red-600">*</span></label
          >
          <Input
            v-model="fLabel"
            class="h-9 rounded-md bg-white/80 border-slate-200 shadow-sm focus:ring-2 focus:ring-slate-950/5 focus:border-slate-400 placeholder:text-slate-400"
          />
          <span v-if="errors['display.label']" class="text-xs text-rose-600 mt-1 block">
            {{ errors['display.label'] }}
          </span>
        </div>

        <div class="pb-4 flex items-center gap-2">
          <input
            id="required"
            type="checkbox"
            v-model="requiredBool"
            class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-400"
          />
          <label for="required" class="text-sm font-medium text-slate-700">Required</label>
        </div>

        <div class="pb-4">
          <label class="text-xs font-medium text-slate-600 mb-2 block">Layout</label>
          <select
            v-model="fLayout"
            class="w-full h-9 rounded-md bg-white/80 border border-slate-200 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-950/5 focus:border-slate-400"
          >
            <option value="Normal">Normal</option>
            <option value="Compact">Compact</option>
          </select>
        </div>
      </CardContent>

      <CardFooter class="flex justify-end pt-4">
        <Button
          @click="onSubmit"
          class="h-9 px-6 rounded-md bg-slate-900 text-white hover:bg-slate-800 shadow-sm ring-1 ring-slate-900/10"
        >
          {{ store.isEditingText ? 'Update' : 'Add' }}
        </Button>
      </CardFooter>
    </div>
  </Card>
</template>
