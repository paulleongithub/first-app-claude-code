import { useState } from 'react'
import { useItems } from './hooks/useItems'
import { ItemForm } from './components/ItemForm'
import { ItemRow } from './components/ItemRow'
import type { Item, ItemDraft } from './types/item'

function App() {
  const { items, loading, error, addItem, updateItem, toggleChecked, deleteItem, deleteAllItems } = useItems()
  const [editingItem, setEditingItem] = useState<Item | null>(null)

  function handleSubmit(draft: ItemDraft) {
    if (editingItem) {
      updateItem(editingItem.id, draft)
      setEditingItem(null)
    } else {
      addItem(draft)
    }
  }

  function handleDelete(id: string) {
    if (editingItem?.id === id) {
      setEditingItem(null)
    }
    deleteItem(id)
  }

  function handleDeleteAll() {
    setEditingItem(null)
    deleteAllItems()
  }

  const uncheckedCount = items.filter((item) => !item.checked).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md px-4 py-8 sm:py-12">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Lista de Compras</h1>
          {items.length > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              {uncheckedCount} de {items.length} {items.length === 1 ? 'item pendente' : 'itens pendentes'}
            </p>
          )}
        </header>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <ItemForm
            editingItem={editingItem}
            onSubmit={handleSubmit}
            onCancel={() => setEditingItem(null)}
            onDeleteAll={handleDeleteAll}
            hasItems={items.length > 0}
          />

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <ul className="mt-6 flex flex-col gap-2">
            {loading && (
              <li className="rounded-md border border-dashed border-gray-200 px-3 py-8 text-center text-sm text-gray-500">
                Carregando...
              </li>
            )}
            {!loading && items.length === 0 && (
              <li className="rounded-md border border-dashed border-gray-200 px-3 py-8 text-center text-sm text-gray-500">
                Nenhum item na lista ainda. Adicione o primeiro produto acima.
              </li>
            )}
            {items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onToggle={toggleChecked}
                onEdit={setEditingItem}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
