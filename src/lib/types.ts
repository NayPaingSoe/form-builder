export interface inputsFieldsT {
  name: string
  display: { label: string; placeholder?: string }
  rule?: string
  enum?: {
    label: string
    value: string
  }[]
  value_constraints?: {
    minimum?: number
    maximum: number | undefined
    allow_decimal: number
  }
  props?: { maxlength?: number | null }
  prefill?: { value?: string | number | '' }
  builder: { type: string }
  visible?: {
    duration: number | undefined
  }
  layout: 'Normal' | 'Compact'
  type: string
}

export interface TextFieldInputsT {
  name: string
  display: { label: string; placeholder?: string }
  rule?: string
  props: { maxlength?: number | null }
  prefill: { value?: string | '' }
  builder: { type: string }
  layout: 'Normal' | 'Compact'
  type: string
}

export interface NumberFieldInputsT {
  name: string
  display: { label: string; placeholder?: string }
  rule?: string
  prefill: {
    value: string | number | ''
  }
  value_constraints: {
    minimum?: number
    maximum: number | undefined
    allow_decimal: number
  }
  visible: {
    duration: number | undefined
  }
  builder: {
    type: string
  }
  layout: 'Normal' | 'Compact'
  type: string
}
export interface RadioFieldInputsT {
  name: string
  rule?: string
  display: {
    label: string
    placeholder?: string
  }
  enum?: {
    label: string
    value: string
  }[]
  builder: {
    type: string
  }
  layout: 'Normal' | 'Compact'
  type: string
}
