<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFormBuilderStore } from '@/stores/form_builder'
import { toast } from 'vue-sonner'
import type { RadioFieldInputsT } from '@/lib/types'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'

interface RadioOption {
  label: string
  value: string
}

const options = ref<RadioOption[]>([{ label: 'First Choice', value: 'first_choice' }])
const radioInputFields = ref<RadioFieldInputsT>({
  name: '',
  display: { label: '', placeholder: '' },
  // rule toggled via computed
  enum: [] as unknown as RadioFieldInputsT['enum'],
  builder: { type: 'simple_choice' },
  layout: 'Normal',
  type: 'Radio',
})

const store = useFormBuilderStore()

function addRadio(index: number) {
  options.value.splice(index + 1, 0, { label: 'New Choice', value: 'new_value' })
}

function removeRadio(index: number) {
  if (options.value.length > 1) {
    options.value.splice(index, 1)
  }
}

const radioSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  display: yup.object({
    label: yup.string().trim().required('Label is required'),
    placeholder: yup.string().optional(),
  }),
  rule: yup.string().optional(),
  builder: yup.object({ type: yup.string().required() }),
  layout: yup.mixed<'Normal' | 'Compact'>().oneOf(['Normal', 'Compact']).required(),
  type: yup.string().oneOf(['Radio']).required(),
}) as yup.ObjectSchema<Required<Omit<RadioFieldInputsT, 'enum'>>>

const { errors, handleSubmit, defineField, setValues, resetForm } = useForm<
  Required<Omit<RadioFieldInputsT, 'enum'>>
>({
  validationSchema: toTypedSchema(radioSchema),
  initialValues: radioInputFields.value as Required<Omit<RadioFieldInputsT, 'enum'>>,
})

const [fName] = defineField('name')
const [fLabel] = defineField('display.label')
const [fPlaceholder] = defineField('display.placeholder')
const [fLayout] = defineField('layout')
const [fRule] = defineField('rule')

const onSubmit = handleSubmit((values) => {
  if (!options.value.length || options.value.some((o) => !o.label || !o.value)) {
    toast.error('Invalid options', { description: 'Add at least one option with label and value' })
    return
  }
  const targetName =
    store.isEditingText && store.editingItemName ? store.editingItemName : values.name || 'field'
  const updated: RadioFieldInputsT = {
    ...(values as RadioFieldInputsT),
    name: targetName,
    enum: options.value.map((o) => ({
      label: o.label,
      value: o.value,
    })) as unknown as RadioFieldInputsT['enum'],
  }

  const idx = store.items.findIndex((it) => it.name === targetName)
  if (idx !== -1) {
    const next = [...store.items]
    next[idx] = updated
    store.items = next
    toast.success('Success', { description: 'Radio Field has been updated' })
    if (store.isEditingText) store.cancelEditText()
  } else {
    store.addItem(updated)
    toast.success('Success', { description: 'Radio Field has been created' })
    resetFormInputs()
  }
  console.log(store.items)
})

function resetFormInputs() {
  resetForm({
    values: {
      name: '',
      display: { label: '', placeholder: '' },
      builder: { type: 'simple_choice' },
      layout: 'Normal',
      type: 'Radio',
    } as Required<Omit<RadioFieldInputsT, 'enum'>>,
  })
  options.value = [{ label: 'First Choice', value: 'first_choice' }]
}

const requiredBool = computed({
  get: () => (fRule.value as string | undefined) === 'required',
  set: (v: boolean) => {
    ;(fRule.value as string | undefined) = v ? 'required' : undefined
  },
})

// When entering edit mode, load the draft into the form
watch(
  () => store.isEditingText,
  (editing) => {
    if (editing && store.editTextDraft) {
      const { name, display, enum: dEnum, builder, layout, rule } = store.editTextDraft
      setValues({
        name: name || '',
        display: { label: display?.label || '', placeholder: display?.placeholder || '' },
        rule,
        builder: { type: builder?.type || 'simple_choice' },
        layout: (layout as 'Normal' | 'Compact') || 'Normal',
        type: 'Radio',
      } as Required<Omit<RadioFieldInputsT, 'enum'>>)
      // map enum to options list for editing UI
      options.value = (dEnum?.map((o) => ({ label: o.label || '', value: o.value || '' })) ||
        []) as RadioOption[]
    }
  },
)
</script>

<template>
  <Card class="w-full flex flex-col rounded-sm justify-start p-6">
    <CardHeader>
      <CardTitle class="text-lg font-semibold">Radio</CardTitle>
    </CardHeader>

    <CardContent class="space-y-4">
      <!-- Name -->
      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700"
          >Name <span class="text-red-600">*</span></label
        >
        <Input v-model="fName" placeholder="" />
        <span v-if="errors.name" class="text-xs text-red-600 mt-1 block">{{ errors.name }}</span>
      </div>

      <!-- Label -->
      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700"
          >Label <span class="text-red-600">*</span></label
        >
        <Input v-model="fLabel" placeholder="" />
        <span v-if="errors['display.label']" class="text-xs text-red-600 mt-1 block">
          {{ errors['display.label'] }}
        </span>
      </div>

      <!-- Placeholder -->
      <div class="pb-4">
        <label class="text-sm font-medium text-gray-700">Placeholder</label>
        <Input v-model="fPlaceholder" placeholder="" />
        <span v-if="errors['display.placeholder']" class="text-xs text-red-600 mt-1 block">
          {{ errors['display.placeholder'] }}
        </span>
      </div>

      <!-- Required -->
      <div class="pb-4 flex items-center gap-2">
        <input id="required" type="checkbox" v-model="requiredBool" />
        <label for="required" class="text-sm font-medium text-gray-700">Required</label>
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
        <select v-model="fLayout" class="border rounded px-3 py-2 text-sm w-full">
          <option value="Normal">Normal</option>
          <option value="Compact">Compact</option>
        </select>
        <span v-if="errors.layout" class="text-xs text-red-600 mt-1 block">{{
          errors.layout
        }}</span>
      </div>
    </CardContent>

    <!-- Footer -->
    <CardFooter class="flex justify-center">
      <div class="flex gap-2">
        <Button @click="onSubmit" class="bg-blue-600 text-white hover:bg-blue-700 px-10">
          Add</Button
        >
      </div>
    </CardFooter>
  </Card>
</template>
