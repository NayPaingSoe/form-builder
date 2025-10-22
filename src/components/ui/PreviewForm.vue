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
import HeadingInputPreview from '@/components/ui/HeadingInputPreview.vue'

const store = useFormBuilderStore()
const router = useRouter()

const items = computed(() => store.items)
</script>

<template>
  <Card
    class="w-full flex flex-col justify-start pt-4 min-h-[90vh] border border-slate-200/70 bg-white/70 shadow-sm rounded-xl backdrop-blur"
  >
    <CardHeader class="p-0">
      <CardTitle class="text-base md:text-lg font-semibold tracking-tight text-slate-900 pl-12"
        >Preview Form</CardTitle
      >
      <hr class="border-slate-200/70 w-full" />
    </CardHeader>
    <div class="p-6 pt-0">
      <CardContent class="space-y-6 w-full max-w-2xl mx-auto">
        <VueDraggable v-model="store.items">
          <div v-for="item in items" :key="item.name" class="space-y-2">
            <!-- Heading -->
            <HeadingInputPreview v-if="item.type === 'Heading'" :item="item" />
            <!-- Text Field -->
            <TextInputPreview v-else-if="item.type === 'Text'" :item="item" />

            <!-- Number Field -->
            <NumberInputPreview v-else-if="item.type === 'Number'" :item="item" />

            <!-- Radio Field -->
            <RadioInputPreview v-else-if="item.type === 'Radio'" :item="item" />

            <!-- Fallback display -->
            <div v-else class="text-xs text-slate-500">Unsupported field type: {{ item.type }}</div>
          </div>
        </VueDraggable>
      </CardContent>

      <CardFooter class="flex justify-between pt-4">
        <Button
          v-if="items.length"
          class="h-9 px-4 rounded-md bg-slate-900 text-white hover:bg-slate-800 shadow-sm ring-1 ring-slate-900/10"
          @click="() => router.push({ name: 'renderer' })"
          >Preview User Form</Button
        >
      </CardFooter>
    </div>
    <pre>
  <!-- {{ store }} -->
</pre>
  </Card>
</template>
