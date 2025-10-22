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
  prefill: { value: '' },
  value_constraints: { maximum: undefined, allow_decimal: 0 },
  visible: { duration: undefined },
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
  visible: yup.object({ duration: yup.number().optional() }).optional(),
  builder: yup.object({ type: yup.string().required() }),
  layout: yup.mixed<'Normal' | 'Compact'>().oneOf(['Normal', 'Compact']).required(),
  type: yup.string().oneOf(['Number']).required(),
})

const { errors, handleSubmit, defineField, setValues, resetForm } = useForm<NumberFieldInputsT>({
  validationSchema: toTypedSchema(numberSchema),
  initialValues: numberInputFields.value,
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
  const targetName =
    store.isEditingText && store.editingItemName ? store.editingItemName : values.name || 'field'
  const updated: NumberFieldInputsT = { ...values, name: targetName }

  const idx = store.items.findIndex((it) => it.name === targetName)
  if (idx !== -1) {
    const next = [...store.items]
    next[idx] = updated
    store.items = next
    toast.success('Success', { description: 'Number Field has been updated' })
    if (store.isEditingText) store.cancelEditText()
    resetFormInputs()
  } else {
    store.addItem(updated)
    toast.success('Success', { description: 'Number Field has been created' })
    resetFormInputs()
  }
})

function resetFormInputs() {
  resetForm({
    values: {
      name: '',
      display: { label: '', placeholder: '' },
      prefill: { value: '' },
      value_constraints: { maximum: undefined, allow_decimal: 0 },
      visible: { duration: undefined },
      builder: { type: 'simple_input' },
      layout: 'Normal',
      type: 'Number',
    },
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
  [() => store.isEditingText, () => store.editTextDraft],
  ([editing, draft]) => {
    if (!editing || !draft) return
    const sel = store.selectedField.value
    if (sel !== 'number') return

    const { display, prefill, value_constraints, visible, builder, layout, rule, name, type } =
      draft
    setValues({
      name: name || '',
      display: { label: display?.label || '', placeholder: display?.placeholder || '' },
      rule,
      prefill: { value: prefill?.value ?? '' },
      value_constraints: {
        maximum: value_constraints?.maximum ?? undefined,
        allow_decimal: value_constraints?.allow_decimal ?? 0,
      },
      visible: { duration: visible?.duration || undefined },
      builder: { type: builder?.type || 'simple_input' },
      layout: layout || 'Normal',
      type: type || 'Number',
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
        >Number</CardTitle
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
            placeholder=""
            class="h-9 rounded-md bg-white/80 border-slate-200 shadow-sm focus:ring-2 focus:ring-slate-950/5 focus:border-slate-400 placeholder:text-slate-400"
          />
          <span v-if="errors['display.label']" class="text-xs text-rose-600 mt-1 block">
            {{ errors['display.label'] }}
          </span>
        </div>

        <div class="pb-4">
          <label class="text-xs font-medium text-slate-600 mb-2 block">Placeholder</label>
          <Input
            v-model="fPlaceholder"
            placeholder=""
            class="h-9 rounded-md bg-white/80 border-slate-200 shadow-sm focus:ring-2 focus:ring-slate-950/5 focus:border-slate-400 placeholder:text-slate-400"
          />
          <span v-if="errors['display.placeholder']" class="text-xs text-rose-600 mt-1 block">
            {{ errors['display.placeholder'] }}
          </span>
        </div>

        <div class="pb-4">
          <label class="text-xs font-medium text-slate-600 mb-2 block">Predefined Value</label>
          <Input
            type="number"
            v-model.number="fPrefill"
            placeholder=""
            class="h-9 rounded-md bg-white/80 border-slate-200 shadow-sm focus:ring-2 focus:ring-slate-950/5 focus:border-slate-400 placeholder:text-slate-400"
          />
          <span v-if="errors['prefill.value']" class="text-xs text-rose-600 mt-1 block">
            {{ errors['prefill.value'] }}
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
          <label class="text-xs font-medium text-slate-600 mb-2 block">Maximum</label>
          <Input
            v-model.number="fMaximum"
            type="number"
            min="0"
            placeholder=""
            class="h-9 rounded-md bg-white/80 border-slate-200 shadow-sm focus:ring-2 focus:ring-slate-950/5 focus:border-slate-400 placeholder:text-slate-400"
          />
          <span v-if="errors['value_constraints.maximum']" class="text-xs text-rose-600 mt-1 block">
            {{ errors['value_constraints.maximum'] }}
          </span>
        </div>

        <div class="pb-4 flex items-center gap-2">
          <input
            id="allowDecimal"
            type="checkbox"
            v-model="allowDecimalBool"
            class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-400"
          />
          <label for="allowDecimal" class="text-sm font-medium text-slate-700">Allow Decimal</label>
        </div>

        <div class="pb-4">
          <label class="text-xs font-medium text-slate-600 mb-2 block">Visible Duration</label>
          <Input
            v-model="numberInputFields.visible.duration"
            placeholder=""
            type="number"
            class="h-9 rounded-md bg-white/80 border-slate-200 shadow-sm focus:ring-2 focus:ring-slate-950/5 focus:border-slate-400 placeholder:text-slate-400"
          />
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
          <span v-if="errors.layout" class="text-xs text-rose-600 mt-1 block">{{
            errors.layout
          }}</span>
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
  <pre></pre>
</template>
