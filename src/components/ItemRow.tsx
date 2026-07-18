import type { Item } from '../types/item'

interface ItemRowProps {
  item: Item
  onToggle: (id: string, checked: boolean) => void
  onEdit: (item: Item) => void
  onDelete: (id: string) => void
}

export function ItemRow({ item, onToggle, onEdit, onDelete }: ItemRowProps) {
  function handleDelete() {
    if (window.confirm(`Excluir "${item.name}"?`)) {
      onDelete(item.id)
    }
  }

  return (
    <li className={`flex items-center justify-between gap-3 rounded-md border border-gray-200 px-3 py-2 ${item.checked ? 'opacity-60' : ''}`}>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={item.checked}
          onChange={(e) => onToggle(item.id, e.target.checked)}
          className="h-4 w-4"
        />
        <span className={item.checked ? 'text-gray-400 line-through' : 'text-gray-900'}>
          {item.name}
        </span>
        <span className="text-sm text-gray-500">x{item.quantity}</span>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(item)}
          aria-label="Editar"
          className="rounded p-1 text-gray-500 hover:bg-gray-100"
        >
          ✏️
        </button>
        <button
          type="button"
          onClick={handleDelete}
          aria-label="Excluir"
          className="rounded p-1 text-gray-500 hover:bg-gray-100"
        >
          🗑️
        </button>
      </div>
    </li>
  )
}
