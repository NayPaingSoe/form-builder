import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useFormBuilderStore = defineStore('form_builder', () => {
  type ItemWithName = { name: string } & Record<string, unknown>
  const items = ref<ItemWithName[]>([])
  const selectedField = ref<{ label: string; value: string }>({ label: '', value: '' })

  function addItem(value: ItemWithName) {
    items.value = [...items.value, value]
  }

  function removeItemByName(name: string) {
    items.value = items.value.filter((it) => it?.name !== name)
  }

  function setSelectedField(payload: { label: string; value: string }) {
    selectedField.value = payload
  }

  return { items, addItem, removeItemByName, selectedField, setSelectedField }
})
