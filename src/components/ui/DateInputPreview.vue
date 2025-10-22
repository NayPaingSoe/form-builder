<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'
import { ref } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useFormBuilderStore } from '@/stores/form_builder'
import type { inputsFieldsT } from '@/lib/types'

const { item } = defineProps<{ item: inputsFieldsT }>()
const store = useFormBuilderStore()

const df = new DateFormatter('en-US', { dateStyle: 'long' })
const value = ref<DateValue>()

function deleteField() {
  if (!item?.name) return
  store.removeItemByName(item.name)
}
function editField() {
  store.setSelectedField({ label: 'Date', value: 'date' })
  store.startEditText(item)
}
</script>

<template>
  <div class="pb-4">
    <label class="text-xs font-medium text-slate-600 mb-2 pb-1 block">
      {{ item.display?.label }}
      <span v-if="item.rule === 'required'" class="text-red-600"> *</span>
    </label>
    <div class="flex items-center justify-between gap-2 w-full">
      <Popover>
        <PopoverTrigger as-child>
          <Button
            variant="outline"
            :class="cn('h-9 w-75 justify-start text-left font-normal', !value && 'text-slate-400')"
          >
            <CalendarIcon class="mr-2 h-4 w-4" />
            {{ value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date' }}
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <Calendar v-model="value" initial-focus />
        </PopoverContent>
      </Popover>
      <div class="flex items-center gap-2">
        <Button size="icon" variant="secondary" class="h-8 w-8 text-blue-600" @click="editField">
          ✎
        </Button>
        <Button size="icon" variant="destructive" class="h-8 w-8" @click="deleteField"> − </Button>
      </div>
    </div>
  </div>
</template>
