import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useFormBuilderStore = defineStore('form_builder', () => {
  const items = ref<unknown[]>([])

  function addItem(value: unknown) {
    items.value = [...items.value, value]
  }

  return { items, addItem }
})
