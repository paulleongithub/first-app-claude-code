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

    if (!editingItem) {
      setName('')
      setQuantity('1')
    }
  }

  function incrementQuantity() {
    setQuantity((prev) => String((Number(prev) || 0) + 1))
  }

  function decrementQuantity() {
    setQuantity((prev) => String(Math.max(1, (Number(prev) || 0) - 1)))
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
          <div className="flex items-stretch rounded-md border border-gray-300">
            <input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full min-w-0 rounded-l-md border-0 px-3 py-2 text-sm [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <div className="flex flex-col border-l border-gray-300">
              <button
                type="button"
                onClick={incrementQuantity}
                aria-label="Aumentar quantidade"
                className="flex flex-1 items-center justify-center rounded-tr-md px-2 text-xs leading-none text-gray-600 hover:bg-gray-100"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={decrementQuantity}
                aria-label="Diminuir quantidade"
                className="flex flex-1 items-center justify-center rounded-br-md border-t border-gray-300 px-2 text-xs leading-none text-gray-600 hover:bg-gray-100"
              >
                ▼
              </button>
            </div>
          </div>
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
