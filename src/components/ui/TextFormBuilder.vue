<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFormBuilderStore } from '@/stores/form_builder'
import { toast } from 'vue-sonner'
import type { TextFieldInputsT } from '@/lib/types'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'

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

const textSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  display: yup.object({
    label: yup.string().trim().required('Label is required'),
    placeholder: yup.string().optional(),
  }),
  props: yup.object({
    maxlength: yup
      .number()
      .typeError('Max Length must be a number')
      .integer('Max Length must be an integer')
      .min(1, 'Max Length must be at least 1')
      .max(1000, 'Max Length is too large')
      .required('Max Length is required'),
  }),
  prefill: yup.object({
    value: yup.string().optional(),
  }),
  builder: yup.object({ type: yup.string().required() }),
  layout: yup.mixed<'Normal' | 'Compact'>().oneOf(['Normal', 'Compact']).required(),
  type: yup.string().oneOf(['Text']).required(),
})

const { errors, handleSubmit, defineField, setValues, resetForm } = useForm<
  Required<TextFieldInputsT>
>({
  validationSchema: toTypedSchema(textSchema),
  initialValues: textInputFields.value as Required<TextFieldInputsT>,
})

const [fName] = defineField('name')
const [fLabel] = defineField('display.label')
const [fPlaceholder] = defineField('display.placeholder')
const [fPrefill] = defineField('prefill.value')
const [fMaxlen] = defineField('props.maxlength')
const [fLayout] = defineField('layout')
const [fRule] = defineField('rule')

const onSubmit = handleSubmit((values) => {
  const targetName =
    store.isEditingText && store.editingItemName ? store.editingItemName : values.name || 'field'
  const updated = { ...values, name: targetName }

  const idx = store.items.findIndex((it) => it.name === targetName)
  if (idx !== -1) {
    const next = [...store.items]
    next[idx] = updated
    store.items = next
    toast.success('Success', { description: 'Text Field has been updated' })
    if (store.isEditingText) store.cancelEditText()
  } else {
    store.addItem(updated)
    toast.success('Success', { description: 'Text Field has been created' })
    resetFormInputs()
  }
  console.log(store.items)
})

const requiredBool = computed({
  get: () => (fRule.value as string | undefined) === 'required',
  set: (v: boolean) => {
    ;(fRule.value as string | undefined) = v ? 'required' : undefined
  },
})

function resetFormInputs() {
  resetForm({
    values: {
      name: '',
      display: { label: '', placeholder: '' },
      props: { maxlength: 280 },
      prefill: { value: '' },
      builder: { type: 'simple_input' },
      layout: 'Normal',
      type: 'Text',
    } as Required<TextFieldInputsT>,
  })
}

// When entering edit mode, load the draft into the form
watch(
  () => store.isEditingText,
  (editing) => {
    if (editing && store.editTextDraft) {
      const { display, props, prefill, builder, layout } = store.editTextDraft
      const name = store.editTextDraft?.name || ''
      setValues({
        name,
        display: {
          label: display?.label || '',
          placeholder: display?.placeholder || '',
        },
        ...(store.editTextDraft?.rule ? { rule: store.editTextDraft.rule } : {}),
        props: { maxlength: (props?.maxlength as number) || 280 },
        prefill: { value: (prefill?.value as string) || '' },
        builder: { type: (builder?.type as string) || 'simple_input' },
        layout: layout === 'Compact' ? 'Compact' : 'Normal',
        type: 'Text',
      } as Required<TextFieldInputsT>)
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
        <span v-if="errors['display.label']" class="text-xs text-red-600 mt-1 block">
          {{ errors['display.label'] }}
        </span>
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Placeholder</label>
        <Input v-model="fPlaceholder" placeholder="" />
        <span v-if="errors['display.placeholder']" class="text-xs text-red-600 mt-1 block">
          {{ errors['display.placeholder'] }}
        </span>
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Predefined Value</label>
        <Input v-model="fPrefill" placeholder="" />
        <span v-if="errors['prefill.value']" class="text-xs text-red-600 mt-1 block">
          {{ errors['prefill.value'] }}
        </span>
      </div>

      <div class="pb-4 flex items-center gap-2">
        <input id="required" type="checkbox" v-model="requiredBool" />
        <label for="required" class="text-sm font-medium text-gray-700">Required</label>
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Max Length</label>
        <Input v-model.number="fMaxlen" type="number" min="1" placeholder="280" />
        <span v-if="errors['props.maxlength']" class="text-xs text-red-600 mt-1 block">
          {{ errors['props.maxlength'] }}
        </span>
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Layout</label>
        <select v-model="fLayout" class="border rounded px-3 py-2 text-sm w-full">
          <option value="Normal">Normal</option>
          <option value="Compact">Compact</option>
        </select>
        <span v-if="errors.layout" class="text-xs text-red-600 mt-1 block">{{
          errors.layout
        }}</span>
      </div>
    </CardContent>

    <CardFooter class="flex justify-center">
      <Button @click="onSubmit" class="bg-blue-600 text-white hover:bg-blue-700 px-10">Add</Button>
    </CardFooter>
  </Card>
  <pre></pre>
</template>
