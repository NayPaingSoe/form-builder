<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFormBuilderStore } from '@/stores/form_builder'
import type { inputsFieldsT } from '@/lib/types'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { toast } from 'vue-sonner'

// --- Store ---
const store = useFormBuilderStore()
const items = computed<inputsFieldsT[]>(() => (store.items as inputsFieldsT[]) || [])

// --- Helpers ---
function getInitialValues(items: inputsFieldsT[]) {
  const values: Record<string, any> = {}
  for (const field of items) {
    if (!field?.name) continue
    const prefill = field.prefill?.value
    switch (field.type) {
      case 'Radio':
        values[field.name] = prefill ?? ''
        break
      case 'Number':
        values[field.name] = prefill ?? undefined
        break
      default:
        values[field.name] = prefill ?? ''
    }
  }
  return values
}

// --- Validation Schema ---
const validationSchema = computed(() => {
  const shape: Record<string, yup.AnySchema> = {}

  for (const field of items.value) {
    if (!field?.name) continue

    // Text
    if (field.type === 'Text') {
      let schema = yup.string()
      if (field.rule === 'required') schema = schema.required('This field is required')
      const max = (field.props as any)?.maxlength
      if (max) schema = schema.max(max, `Must be at most ${max} characters`)
      shape[field.name] = schema
    }

    // Number
    if (field.type === 'Number') {
      let schema = yup.number().typeError('Must be a number')
      if (field.rule === 'required') schema = schema.required('This field is required')

      const vc = field.value_constraints
      if (vc?.minimum !== undefined) schema = schema.min(vc.minimum, `Minimum is ${vc.minimum}`)
      if (vc?.maximum !== undefined) schema = schema.max(vc.maximum, `Maximum is ${vc.maximum}`)
      if (!vc?.allow_decimal) schema = schema.integer('Must be an integer')

      shape[field.name] = schema
    }

    // Radio
    if (field.type === 'Radio') {
      const options = (field.enum || []).map((o: any) => o.value)
      let schema = yup.mixed().oneOf(options, 'Invalid option')
      if (field.rule === 'required') schema = schema.required('This field is required')
      shape[field.name] = schema
    }
  }

  return yup.object(shape)
})

// --- Form Setup ---
const { errors, handleSubmit, values, setValues, defineField } = useForm({
  validationSchema: computed(() => toTypedSchema(validationSchema.value)),
  initialValues: getInitialValues(items.value),
})

// --- Field Registration ---
const fields = ref<Record<string, any>>({})
watch(
  items,
  (newItems) => {
    const next: Record<string, any> = {}
    for (const field of newItems) {
      if (!field?.name) continue
      const [inputRef] = defineField(field.name)
      next[field.name] = inputRef
    }
    fields.value = next
    setValues(getInitialValues(newItems))
  },
  { immediate: true, deep: true },
)

// --- Submit ---
const onSubmit = handleSubmit((vals) => {
  toast.success('Submitted values', { description: JSON.stringify(vals) })
})
</script>

<template>
  <Card class="w-full flex flex-col rounded-sm justify-start p-6 min-h-[90vh] min-w-xl">
    <CardHeader>
      <CardTitle class="text-lg font-semibold pl-1">Form Render</CardTitle>
    </CardHeader>

    <CardContent class="space-y-6 w-full">
      <div v-for="item in items" :key="item.name" class="space-y-4">
        <!-- Text -->
        <div v-if="item.type === 'Text'" class="pb-4">
          <label class="text-sm font-medium">
            {{ item.display?.label }}
            <span v-if="item.rule === 'required'" class="text-red-600"> *</span>
          </label>
          <Input
            v-model="fields[item.name]"
            :placeholder="item.display?.placeholder"
            :maxlength="item.props?.maxlength"
          />
          <p v-if="errors[item.name]" class="text-xs text-red-600">{{ errors[item.name] }}</p>
        </div>

        <!-- Number -->
        <div v-if="item.type === 'Number'" class="pb-4">
          <label class="text-sm font-medium">
            {{ item.display?.label }}
            <span v-if="item.rule === 'required'" class="text-red-600"> *</span>
          </label>
          <Input
            v-model.number="fields[item.name]"
            type="number"
            :placeholder="item.display?.placeholder"
            :max="item.value_constraints?.maximum"
            :step="item.value_constraints?.allow_decimal ? 'any' : 1"
          />
          <p v-if="errors[item.name]" class="text-xs text-red-600">{{ errors[item.name] }}</p>
        </div>

        <!-- Radio -->
        <div v-if="item.type === 'Radio'" class="pb-4">
          <label class="text-sm font-medium block pb-1">
            {{ item.display?.label }}
            <span v-if="item.rule === 'required'" class="text-red-600"> *</span>
          </label>
          <div v-for="opt in item.enum || []" :key="opt.value">
            <label class="flex items-center space-x-2">
              <input
                type="radio"
                :name="item.name"
                :value="opt.value"
                v-model="fields[item.name]"
              />
              <span class="text-sm pl-2">{{ opt.label }}</span>
            </label>
          </div>
          <p v-if="errors[item.name]" class="text-xs text-red-600">{{ errors[item.name] }}</p>
        </div>
      </div>
    </CardContent>

    <CardFooter class="flex justify-between pt-4">
      <Button
        v-if="items.length"
        class="bg-blue-600 text-white hover:bg-blue-700"
        @click="onSubmit"
      >
        Submit Form
      </Button>
      <pre>{{ values }}</pre>
    </CardFooter>
  </Card>
</template>
