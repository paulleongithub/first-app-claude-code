import { useEffect, useState } from 'react'
import type { Item, ItemDraft } from '../types/item'

interface ItemFormProps {
  editingItem: Item | null
  onSubmit: (draft: ItemDraft) => void
  onCancel: () => void
}

export function ItemForm({ editingItem, onSubmit, onCancel }: ItemFormProps) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name)
      setQuantity(String(editingItem.quantity))
    } else {
      setName('')
      setQuantity('1')
    }
    setError(null)
  }, [editingItem])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const trimmedName = name.trim()
    const parsedQuantity = Number(quantity)

    if (!trimmedName) {
      setError('Informe o nome do produto.')
      return
    }
    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      setError('Quantidade deve ser um número inteiro maior que zero.')
      return
    }

    setError(null)
    onSubmit({ name: trimmedName, quantity: parsedQuantity })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
            Nome do produto
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="w-24">
          <label htmlFor="quantity" className="mb-1 block text-sm font-medium text-gray-700">
            Quantidade
          </label>
          <input
            id="quantity"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {editingItem ? 'Salvar' : 'Adicionar'}
        </button>
        {editingItem && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
