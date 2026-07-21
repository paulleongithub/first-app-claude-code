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

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Lista de Compras</h1>

      <ItemForm
        editingItem={editingItem}
        onSubmit={handleSubmit}
        onCancel={() => setEditingItem(null)}
        onDeleteAll={handleDeleteAll}
        hasItems={items.length > 0}
      />

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <ul className="mt-6 flex flex-col gap-2">
        {loading && <li className="text-sm text-gray-500">Carregando...</li>}
        {!loading && items.length === 0 && (
          <li className="text-sm text-gray-500">Nenhum item na lista ainda.</li>
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
  )
}

export default App
