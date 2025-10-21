<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFormBuilderStore } from '@/stores/form_builder'
import { toast } from 'vue-sonner'
import type { NumberFieldInputsT } from '@/lib/types'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'

const numberInputFields = ref<NumberFieldInputsT>({
  name: '',
  display: { label: '', placeholder: '' },
  // rule toggled via computed
  prefill: { value: '' },
  value_constraints: { maximum: 0, allow_decimal: 0 },
  visible: { duration: '' },
  builder: { type: 'simple_input' },
  layout: 'Normal',
  type: 'Number',
})

const store = useFormBuilderStore()

const numberSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  display: yup.object({
    label: yup.string().trim().required('Label is required'),
    placeholder: yup.string().optional(),
  }),
  rule: yup.string().optional(),
  prefill: yup.object({
    value: yup.mixed<string | number | ''>().optional(),
  }),
  value_constraints: yup.object({
    maximum: yup
      .number()
      .typeError('Maximum must be a number')
      .min(0, 'Maximum must be >= 0')
      .nullable()
      .transform((v, o) => (o === '' || o === null ? undefined : v)),
    allow_decimal: yup.number().oneOf([0, 1]).required(),
  }),
  visible: yup.object({ duration: yup.string().optional() }).optional(),
  builder: yup.object({ type: yup.string().required() }),
  layout: yup.mixed<'Normal' | 'Compact'>().oneOf(['Normal', 'Compact']).required(),
  type: yup.string().oneOf(['Number']).required(),
}) as yup.ObjectSchema<Required<NumberFieldInputsT>>

const { errors, handleSubmit, defineField, setValues, resetForm } = useForm<Required<NumberFieldInputsT>>({
  validationSchema: toTypedSchema(numberSchema),
  initialValues: numberInputFields.value as Required<NumberFieldInputsT>,
})

const [fName] = defineField('name')
const [fLabel] = defineField('display.label')
const [fPlaceholder] = defineField('display.placeholder')
const [fPrefill] = defineField('prefill.value')
const [fMaximum] = defineField('value_constraints.maximum')
const [fAllowDecimal] = defineField('value_constraints.allow_decimal')
const [fLayout] = defineField('layout')
const [fRule] = defineField('rule')

const onSubmit = handleSubmit((values) => {
  const targetName = store.isEditingText && store.editingItemName ? store.editingItemName : values.name || 'field'
  const updated: NumberFieldInputsT = { ...values, name: targetName }

  const idx = store.items.findIndex((it) => it.name === targetName)
  if (idx !== -1) {
    const next = [...store.items]
    next[idx] = updated
    store.items = next
    toast.success('Success', { description: 'Number Field has been updated' })
    if (store.isEditingText) store.cancelEditText()
  } else {
    store.addItem(updated)
    toast.success('Success', { description: 'Number Field has been created' })
    resetFormInputs()
  }
  console.log(store.items)
})

function resetFormInputs() {
  resetForm({
    values: {
      name: '',
      display: { label: '', placeholder: '' },
      prefill: { value: '' },
      value_constraints: { maximum: 0 as unknown as number | '', allow_decimal: 0 },
      visible: { duration: '' },
      builder: { type: 'simple_input' },
      layout: 'Normal',
      type: 'Number',
    } as Required<NumberFieldInputsT>,
  })
}

const requiredBool = computed({
  get: () => (fRule.value as string | undefined) === 'required',
  set: (v: boolean) => {
    ;(fRule.value as string | undefined) = v ? 'required' : undefined
  },
})

const allowDecimalBool = computed({
  get: () => (fAllowDecimal.value as number) === 1,
  set: (v: boolean) => {
    ;(fAllowDecimal.value as number) = v ? 1 : 0
  },
})

watch(
  () => store.isEditingText,
  (editing) => {
    if (editing && store.editTextDraft) {
      const { display, prefill, value_constraints, visible, builder, layout, rule, name, type } =
        store.editTextDraft
      setValues({
        name: name || '',
        display: { label: display?.label || '', placeholder: display?.placeholder || '' },
        rule,
        prefill: { value: prefill?.value ?? '' },
        value_constraints: {
          maximum: (value_constraints?.maximum as number | '') ?? 0,
          allow_decimal: (value_constraints?.allow_decimal as number) ?? 0,
        },
        visible: { duration: visible?.duration || '' },
        builder: { type: builder?.type || 'simple_input' },
        layout: (layout as 'Normal' | 'Compact') ?? 'Normal',
        type: (type as string) || 'Number',
      } as Required<NumberFieldInputsT>)
    }
  },
)
</script>

<template>
  <!-- <Card class="w-full h-full flex flex-col items-center rounded-sm justify-start p-6"> -->
  <Card class="w-full flex flex-col rounded-sm justify-start p-6">
    <CardHeader>
      <CardTitle class="text-lg font-semibold">Number</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4 w-full">
      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Name</label>
        <Input v-model="fName" placeholder="unique_field_name" />
        <span v-if="errors.name" class="text-xs text-red-600 mt-1 block">{{ errors.name }}</span>
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Label</label>
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
        <Input type="number" v-model.number="fPrefill" placeholder="" />
        <span v-if="errors['prefill.value']" class="text-xs text-red-600 mt-1 block">
          {{ errors['prefill.value'] }}
        </span>
      </div>

      <div class="pb-4 flex items-center gap-2">
        <input id="required" type="checkbox" v-model="requiredBool" />
        <label for="required" class="text-sm font-medium text-gray-700">Required</label>
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Maximum</label>
        <Input v-model.number="fMaximum" type="number" min="0" placeholder="" />
        <span v-if="errors['value_constraints.maximum']" class="text-xs text-red-600 mt-1 block">
          {{ errors['value_constraints.maximum'] }}
        </span>
      </div>

      <div class="pb-4 flex items-center gap-2">
        <input id="allowDecimal" type="checkbox" v-model="allowDecimalBool" />
        <label for="allowDecimal" class="text-sm font-medium text-gray-700">Allow Decimal</label>
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Visible Duration</label>
        <Input v-model="numberInputFields.visible.duration" placeholder="" />
      </div>

      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Layout</label>
        <select v-model="fLayout" class="border rounded px-3 py-2 text-sm w-full">
          <option value="Normal">Normal</option>
          <option value="Compact">Compact</option>
        </select>
        <span v-if="errors.layout" class="text-xs text-red-600 mt-1 block">{{ errors.layout }}</span>
      </div>
    </CardContent>

    <CardFooter class="flex justify-between pt-4">
      <Button @click="onSubmit" class="bg-blue-600 text-white hover:bg-blue-700">Save</Button>
    </CardFooter>
  </Card>
  <pre>

    {{ store }}
  </pre>
</template>
