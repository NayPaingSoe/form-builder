<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useFormBuilderStore } from '@/stores/form_builder'
import TextInputPreview from '@/components/ui/TextInputPreview.vue'
import NumberInputPreview from '@/components/ui/NumberInputPreview.vue'
import RadioInputPreview from '@/components/ui/RadioInputPreview.vue'
import { VueDraggable } from 'vue-draggable-plus'

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
type FieldType = 'Text' | 'Number' | 'Radio' | 'Heading'
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

const store = useFormBuilderStore()
const router = useRouter()

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

const items = computed<FormItem[]>(() => (store.items as unknown as FormItem[]) || [])
initFormData(items.value)

// If items change after init, refresh the form data (simple strategy)
watch(items, (nv) => initFormData(nv), { deep: true })

function isRequired(item: FormItem) {
  return item?.rule === 'required'
}
</script>

<template>
  <Card class="w-full flex flex-col rounded-sm justify-start pt-4 min-h-[90vh]">
    <CardHeader class="p-0">
      <CardTitle class="text-lg font-semibold pl-12">Preview Form</CardTitle>
      <hr class="border-gray-300 w-full" />
    </CardHeader>
    <div class="p-6 pt-0">
      <CardContent class="space-y-6 w-full">
        <VueDraggable v-model="store.items">
          <div v-for="it in items" :key="it.name" class="space-y-2">
            <!-- Heading -->
            <div v-if="it.type === 'Heading'" class="py-4">
              <p class="text-lg font-semibold!">{{ it.display?.label }}</p>
            </div>
            <!-- Text Field -->
            <TextInputPreview
              v-else-if="it.type === 'Text'"
              :item="it"
              type="builder"
              v-model="formData[it.name]"
            />

            <!-- Number Field -->
            <NumberInputPreview
              v-else-if="it.type === 'Number' && it.builder?.type === 'simple_input'"
              :item="it"
              v-model="formData[it.name]"
            />

            <!-- Radio Field -->
            <RadioInputPreview
              v-else-if="it.type === 'Radio' && it.builder?.type === 'simple_choice'"
              :item="it"
              v-model="formData[it.name]"
            />

            <!-- Fallback display -->
            <div v-else class="text-xs text-gray-500">Unsupported field type: {{ it.type }}</div>
          </div>
        </VueDraggable>
      </CardContent>

      <CardFooter class="flex justify-between pt-4">
        <Button
          v-if="items.length"
          class="bg-blue-600 text-white hover:bg-blue-700"
          @click="() => router.push({ name: 'renderer' })"
          >Open Form Render</Button
        >
      </CardFooter>
    </div>
  </Card>
</template>
