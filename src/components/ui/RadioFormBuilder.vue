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
  enum: [],
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
})

const { errors, handleSubmit, defineField, setValues, resetForm } = useForm<
  Omit<RadioFieldInputsT, 'enum'>
>({
  validationSchema: toTypedSchema(radioSchema),
  initialValues: radioInputFields.value,
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
  const updated = {
    ...values,
    name: targetName,
    enum: options.value.map((o) => ({
      label: o.label,
      value: o.value,
    })),
  }

  const idx = store.items.findIndex((it) => it.name === targetName)
  if (idx !== -1) {
    const next = [...store.items]
    next[idx] = updated
    store.items = next
    toast.success('Success', { description: 'Radio Field has been updated' })
    if (store.isEditingText) store.cancelEditText()
    resetFormInputs()
  } else {
    store.addItem(updated)
    toast.success('Success', { description: 'Radio Field has been created' })
    resetFormInputs()
  }
})

function resetFormInputs() {
  resetForm({
    values: {
      name: '',
      display: { label: '', placeholder: '' },
      builder: { type: 'simple_choice' },
      layout: 'Normal',
      type: 'Radio',
    },
  })
  options.value = [{ label: 'First Choice', value: 'first_choice' }]
}

const requiredBool = computed({
  get: () => (fRule.value as string | undefined) === 'required',
  set: (v: boolean) => {
    ;(fRule.value as string | undefined) = v ? 'required' : undefined
  },
})

watch(
  [() => store.isEditingText, () => store.editTextDraft],
  ([editing, draft]) => {
    if (!editing || !draft) return
    const sel = store.selectedField.value
    if (sel !== 'radio') return

    const { name, display, enum: dEnum, builder, layout, rule } = draft
    setValues({
      name: name || '',
      display: { label: display?.label || '', placeholder: display?.placeholder || '' },
      rule,
      builder: { type: builder?.type || 'simple_choice' },
      layout: layout || 'Normal',
      type: 'Radio',
    })

    options.value = dEnum?.map((o) => ({ label: o.label || '', value: o.value || '' })) || []
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
        >Radio</CardTitle
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
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs font-medium text-slate-600">Radio Options</label>
            <div class="flex items-center gap-2 text-xs text-slate-500"></div>
          </div>

          <div class="space-y-2 border border-slate-200 rounded-lg px-3 py-2 bg-white/60">
            <div
              v-for="(opt, index) in options"
              :key="index"
              class="grid grid-cols-2 gap-2 pt-2 items-center"
            >
              <Input
                v-model="opt.label"
                class="w-full h-9 rounded-md bg-white/80 border-slate-200 shadow-sm focus:ring-2 focus:ring-slate-950/5 focus:border-slate-400 placeholder:text-slate-400"
                placeholder=""
              />
              <div class="flex items-center gap-2">
                <Input
                  v-model="opt.value"
                  class="w-full h-9 rounded-md bg-white/80 border-slate-200 shadow-sm focus:ring-2 focus:ring-slate-950/5 focus:border-slate-400 placeholder:text-slate-400"
                  placeholder=""
                />
                <Button
                  size="icon"
                  variant="secondary"
                  class="h-8 w-8 text-slate-700 hover:text-slate-900"
                  @click="addRadio(index)"
                >
                  +
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  class="h-8 w-8"
                  @click="removeRadio(index)"
                >
                  −
                </Button>
              </div>
            </div>
          </div>
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

      <!-- Footer -->
      <CardFooter class="flex justify-end">
        <div class="flex gap-2">
          <Button
            @click="onSubmit"
            class="h-9 px-6 rounded-md bg-slate-900 text-white hover:bg-slate-800 shadow-sm ring-1 ring-slate-900/10"
          >
            {{ store.isEditingText ? 'Update' : 'Add' }}
          </Button>
        </div>
      </CardFooter>
    </div>
  </Card>
</template>
