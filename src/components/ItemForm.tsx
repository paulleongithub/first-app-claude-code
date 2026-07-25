import { useEffect, useState } from 'react'
import type { Item, ItemDraft } from '../types/item'

interface ItemFormProps {
  editingItem: Item | null
  onSubmit: (draft: ItemDraft) => void
  onCancel: () => void
  onDeleteAll: () => void
  hasItems: boolean
}

export function ItemForm({ editingItem, onSubmit, onCancel, onDeleteAll, hasItems }: ItemFormProps) {
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

  function handleDeleteAll() {
    if (window.confirm('Excluir todos os itens da lista? Essa ação não pode ser desfeita.')) {
      onDeleteAll()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {editingItem && (
        <p className="text-sm font-medium text-blue-700">
          Editando &ldquo;{editingItem.name}&rdquo;
        </p>
      )}

      <div className="flex gap-3">
        <div className="flex-1">
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
            Nome do produto
          </label>
          <input
            id="name"
            type="text"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="w-28 shrink-0">
          <label htmlFor="quantity" className="mb-1 block text-sm font-medium text-gray-700">
            Quantidade
          </label>
          <div className="flex items-stretch overflow-hidden rounded-md border border-gray-300 transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
            <button
              type="button"
              onClick={decrementQuantity}
              aria-label="Diminuir quantidade"
              className="flex w-8 shrink-0 items-center justify-center text-base leading-none text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              &minus;
            </button>
            <input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full min-w-0 border-x border-gray-300 px-1 py-2 text-center text-sm [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              onClick={incrementQuantity}
              aria-label="Aumentar quantidade"
              className="flex w-8 shrink-0 items-center justify-center text-base leading-none text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:flex-none"
          >
            {editingItem ? 'Salvar' : 'Adicionar'}
          </button>
          {editingItem && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 sm:flex-none"
            >
              Cancelar
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={handleDeleteAll}
          disabled={!hasItems}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-red-300"
        >
          Limpar tudo
        </button>
      </div>
    </form>
  )
}
