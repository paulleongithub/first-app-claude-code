export interface Item {
  id: string
  name: string
  quantity: number
  checked: boolean
  created_at: string
  updated_at: string
}

export interface ItemDraft {
  name: string
  quantity: number
}
