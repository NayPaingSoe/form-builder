import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useFormBuilderStore = defineStore('form_builder', () => {
  type ItemWithName = { name: string } & Record<string, unknown>
  const items = ref<ItemWithName[]>([])

  function addItem(value: ItemWithName) {
    items.value = [...items.value, value]
  }

  function removeItemByName(name: string) {
    items.value = items.value.filter((it) => it?.name !== name)
  }

  return { items, addItem, removeItemByName }
})
