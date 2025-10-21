import { ref } from 'vue'
import { defineStore } from 'pinia'

interface inputsFieldsT {
  name: string
  display?: { label?: string; placeholder?: string }
  rule?: string
  enum?: [
    {
      label: string
      value: string
    }[],
  ]
  value_constraints?: {
    maximum: number
    allow_decimal: number
  }
  props?: { maxlength?: number }
  prefill?: { value?: string | number | '' }
  builder: { type: string }
  visible?: {
    duration: string
  }
  layout: 'Normal' | 'Compact'
  type: string
}

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
    // make a shallow copy for draft editing
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
    // editing state/actions
    isEditingText,
    editingItemName,
    editTextDraft,
    startEditText,
    applyEditText,
    cancelEditText,
  }
})
