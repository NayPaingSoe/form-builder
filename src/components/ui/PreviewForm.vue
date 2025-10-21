<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFormBuilderStore } from '@/stores/form_builder'

const store = useFormBuilderStore()
console.log(store.items)

// Types for items in the builder store
interface DisplayConf {
  label?: string
  placeholder?: string
}
interface PropsConf {
  maxlength?: number
}
interface PrefillConf {
  value?: unknown
}
interface BuilderConf {
  type?: string
}
interface NumberConstraints {
  maximum?: number
  allow_decimal?: number
}
interface EnumOption {
  label: string
  value: string
}
type FieldType = 'Text' | 'Number' | 'Radio'
interface FormItem {
  name: string
  display?: DisplayConf
  rule?: string
  props?: PropsConf
  prefill?: PrefillConf
  visible?: Record<string, string>
  builder?: BuilderConf
  layout?: string
  type: FieldType
  value_constraints?: NumberConstraints
  enum?: EnumOption[]
}

// Build reactive form data initialized from prefill values
const formData = ref<Record<string, unknown>>({})

function initFormData(items: FormItem[]) {
  const initial: Record<string, unknown> = {}
  items.forEach((it) => {
    const key = it?.name
    if (!key) return
    if (it?.type === 'Radio') {
      initial[key] = it?.prefill?.value ?? ''
    } else if (it?.type === 'Number') {
      initial[key] = it?.prefill?.value ?? undefined
    } else {
      initial[key] = it?.prefill?.value ?? ''
    }
  })
  formData.value = initial
}

const items = computed<FormItem[]>(() => (store.items as FormItem[]) || [])
initFormData(items.value)

// If items change after init, refresh the form data (simple strategy)
watch(items, (nv) => initFormData(nv), { deep: true })

function isRequired(item: FormItem) {
  return item?.rule === 'required'
}

// Very simple visibility engine supporting rules like "required|is:full"
function isVisible(item: FormItem) {
  const vis = item?.visible
  if (!vis) return true
  const entries = Object.entries(vis)
  return entries.every(([dep, rule]) => {
    const val = formData.value[dep]
    if (typeof rule !== 'string') return true
    const isIdx = rule.indexOf('is:')
    if (isIdx >= 0) {
      const expected = rule.slice(isIdx + 3)
      return String(val) === expected
    }
    return true
  })
}
</script>

<template>
  <Card class="w-full flex flex-col rounded-sm justify-start p-6">
    <CardHeader>
      <CardTitle class="text-lg font-semibold pl-6">Preview Form</CardTitle>
    </CardHeader>
    <CardContent class="space-y-6 w-full">
      <div v-for="it in items" :key="it.name" v-show="isVisible(it)" class="space-y-2">
        <div class="pb-1">
          <label class="text-sm font-medium text-gray-700">
            {{ it.display?.label }}<span v-if="isRequired(it)" class="text-red-600"> *</span>
          </label>
        </div>

        <!-- Text Field -->
        <div v-if="it.type === 'Text'">
          <Input
            v-model="formData[it.name]"
            :placeholder="it.display?.placeholder"
            :maxlength="it.props?.maxlength"
            :required="isRequired(it)"
            type="text"
          />
        </div>

        <!-- Number Field -->
        <div v-else-if="it.type === 'Number' && it.builder?.type === 'simple_input'">
          <Input
            v-model.number="formData[it.name]"
            :placeholder="it.display?.placeholder"
            :required="isRequired(it)"
            type="number"
            :max="it.value_constraints?.maximum"
            :step="it.value_constraints?.allow_decimal ? 'any' : 1"
          />
        </div>

        <!-- Radio Field -->
        <div
          v-else-if="it.type === 'Radio' && it.builder?.type === 'simple_choice'"
          class="space-y-2"
        >
          <div class="flex flex-col gap-2">
            <label
              v-for="opt in it.enum"
              :key="it.name + '_' + opt.value"
              class="inline-flex items-center gap-2"
            >
              <input type="radio" :name="it.name" :value="opt.value" v-model="formData[it.name]" />
              <span class="text-sm">{{ opt.label }}</span>
            </label>
          </div>
        </div>

        <!-- Fallback display -->
        <div v-else class="text-xs text-gray-500">Unsupported field type: {{ it.type }}</div>
      </div>
    </CardContent>

    <CardFooter class="flex justify-between pt-4">
      <Button
        class="bg-blue-600 text-white hover:bg-blue-700"
        @click="() => console.log({ ...formData })"
        >Save</Button
      >
    </CardFooter>
  </Card>
  <pre>

    {{ formData }}
  </pre>
</template>
