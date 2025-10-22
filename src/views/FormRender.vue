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

const store = useFormBuilderStore()

const items = computed(() => store.items)

function getInitialValues(items: inputsFieldsT[]) {
  const values: Record<string, string | number | boolean> = {}
  for (const field of items) {
    if (!field?.name) continue
    const prefill = field.prefill?.value
    values[field.name] = prefill ?? ''
  }
  return values
}

const validationSchema = computed(() => {
  const shape: Record<string, yup.AnySchema> = {}

  for (const field of items.value) {
    if (!field?.name) continue

    // Text
    if (field.type === 'Text') {
      let schema = yup.string()
      if (field.rule === 'required') schema = schema.required('This field is required')
      const max = (field.props as unknown as { maxlength: number })?.maxlength
      if (max) schema = schema.max(max, `Must be at most ${max} characters`)
      shape[field.name] = schema
    }

    // Number
    if (field.type === 'Number') {
      let schema = yup.number().typeError('Must be a number')
      if (field.rule === 'required') schema = schema.required('This field is required')
      const vc = field.value_constraints
      if (vc?.minimum !== undefined) schema = schema.min(vc.minimum, `Minimum is ${vc.minimum}`)
      if (vc?.maximum !== undefined)
        schema = schema.max(vc.maximum as number, `Maximum is ${vc.maximum}`)
      if (!vc?.allow_decimal) schema = schema.integer('Must be an integer')
      shape[field.name] = schema
    }

    // Radio
    if (field.type === 'Radio') {
      const options = (field.enum as { value: string; label: string }[]).map((o) => o.value)
      let schema = yup.mixed().oneOf(options, 'This field is required')
      if (field.rule === 'required') schema = schema.required('This field is required')
      shape[field.name] = schema
    }
  }

  return yup.object(shape)
})

const { errors, handleSubmit, values, setValues, defineField } = useForm({
  validationSchema: computed(() => toTypedSchema(validationSchema.value)),
  initialValues: getInitialValues(items.value),
})

const fields = ref<Record<string, string | number | boolean>>({})
watch(
  items,
  (newItems) => {
    console.log('initialValue', getInitialValues(items.value))
    const next: Record<string, string | number | boolean> = {}
    for (const field of newItems) {
      if (!field?.name) continue
      const [inputRef] = defineField(field.name as any)
      next[field.name] = inputRef
    }
    fields.value = next
    console.log('fields', fields)
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
  <Card
    class="w-full flex flex-col justify-start min-h-[90vh] min-w-xl pt-4 border border-slate-200/70 bg-white/70 shadow-sm rounded-xl backdrop-blur"
  >
    <CardHeader class="p-0">
      <CardTitle
        class="text-base md:text-lg font-semibold tracking-tight text-slate-900 text-center pl-1"
        >Form Render</CardTitle
      >
      <hr class="border-slate-200/70 w-full" />
    </CardHeader>
    <div class="p-6 pt-0">
      <CardContent class="space-y-6 w-full max-w-2xl mx-auto">
        <div v-for="item in items" :key="item.name" class="space-y-4">
          <!-- Heading -->
          <div v-if="item.type === 'Heading'" class="pt-3 pb-4">
            <p class="text-lg font-semibold!">{{ item.display?.label }}</p>
          </div>

          <!-- Text -->
          <div v-else-if="item.type === 'Text'" class="pb-4">
            <pre>{{ fields[item.name] }}</pre>
            <label class="text-xs font-medium text-slate-600 mb-2 pb-1 block">
              {{ item.display?.label }}
              <span v-if="item.rule === 'required'" class="text-red-600"> *</span>
            </label>
            <Input
              @update:modelValue="fields[item.name] = $event"
              :modelValue="fields[item.name]"
              :placeholder="item.display?.placeholder"
              class="h-9 rounded-md bg-white/80 border-slate-200 shadow-sm focus:ring-2 focus:ring-slate-950/5 focus:border-slate-400 placeholder:text-slate-400"
            />
            <p v-if="errors[item.name]" class="text-xs text-rose-600">
              {{ errors[item.name] }}
            </p>
          </div>

          <!-- Number -->
          <div v-else-if="item.type === 'Number'" class="pb-4">
            <label class="text-xs font-medium text-slate-600 mb-2 pb-1 block">
              {{ item.display?.label }}
              <span v-if="item.rule === 'required'" class="text-red-600"> *</span>
            </label>
            <Input
              @update:modelValue="fields[item.name] = $event"
              :modelValue="fields[item.name]"
              type="number"
              :placeholder="item.display?.placeholder"
              :max="item.value_constraints?.maximum"
              :step="item.value_constraints?.allow_decimal ? 'any' : 1"
              class="h-9 rounded-md bg-white/80 border-slate-200 shadow-sm focus:ring-2 focus:ring-slate-950/5 focus:border-slate-400 placeholder:text-slate-400"
            />
            <p v-if="errors[item.name]" class="text-xs text-rose-600">
              {{ errors[item.name] }}
            </p>
          </div>

          <!-- Radio -->
          <div v-else-if="item.type === 'Radio'" class="pb-4">
            <label class="text-xs font-medium text-slate-600 mb-2 pb-1 lock">
              {{ item.display?.label }}
              <span v-if="item.rule === 'required'" class="text-red-600"> *</span>
            </label>
            <div v-for="opt in item.enum || []" :key="opt.value">
              <label class="flex items-center gap-2">
                <input
                  type="radio"
                  :name="item.name"
                  :value="opt.value"
                  v-model="fields[item.name]"
                  class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-400"
                />
                <span class="text-sm text-slate-700 pl-2">{{ opt.label }}</span>
              </label>
            </div>
            <p v-if="errors[item.name]" class="text-xs text-rose-600">
              {{ errors[item.name] }}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter class="flex justify-between pt-4">
        <Button
          v-if="items.length"
          class="h-9 px-4 rounded-md bg-slate-900 text-white hover:bg-slate-800 shadow-sm ring-1 ring-slate-900/10"
          @click="onSubmit"
        >
          Submit Form
        </Button>
        <!-- <pre>{{ validationSchema }}</pre> -->
      </CardFooter>
    </div>
  </Card>
</template>
