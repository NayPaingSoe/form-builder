import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { inputsFieldsT } from '@/lib/types'

export const useFormBuilderStore = defineStore('form_builder', () => {
  const items = ref<inputsFieldsT[]>([])
  const selectedField = ref<{ label: string; value: string }>({ label: '', value: '' })
  const isEditingText = ref(false)
  const editingItemName = ref<string | null>(null)
  const editTextDraft = ref<inputsFieldsT | null>(null)

  function addItem(value: inputsFieldsT) {
    items.value = [...items.value, value]
  }

  function removeItemByName(name: string) {
    items.value = items.value.filter((it) => it?.name !== name)
  }

  function setSelectedField(payload: { label: string; value: string }) {
    selectedField.value = payload
  }

  function startEditText(item: inputsFieldsT) {
    isEditingText.value = true
    editingItemName.value = item.name
    editTextDraft.value = { ...item }
  }

  function applyEditText(updated: inputsFieldsT) {
    if (!isEditingText.value || !editingItemName.value) return
    items.value = items.value.map((it) => (it.name === editingItemName.value ? updated : it))
    cancelEditText()
  }

  function cancelEditText() {
    isEditingText.value = false
    editingItemName.value = null
    editTextDraft.value = null
  }

  return {
    items,
    addItem,
    removeItemByName,
    selectedField,
    setSelectedField,
    isEditingText,
    editingItemName,
    editTextDraft,
    startEditText,
    applyEditText,
    cancelEditText,
  }
})
