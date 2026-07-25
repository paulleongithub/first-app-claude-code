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
    <li
      className={`flex items-center justify-between gap-3 rounded-md border border-gray-200 px-3 py-2.5 transition-colors hover:bg-gray-50 ${item.checked ? 'opacity-60' : ''}`}
    >
      <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={item.checked}
          onChange={(e) => onToggle(item.id, e.target.checked)}
          className="h-5 w-5 shrink-0 cursor-pointer accent-blue-600"
        />
        <span className={`truncate ${item.checked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
          {item.name}
        </span>
        <span className="shrink-0 text-sm text-gray-500">x{item.quantity}</span>
      </label>
      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={() => onEdit(item)}
          aria-label="Editar"
          title="Editar"
          className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M13.586 3.586a2 2 0 1 1 2.828 2.828l-.793.793-2.828-2.828.793-.793ZM11.379 5.793 3 14.172V17h2.828l8.38-8.379-2.83-2.828Z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleDelete}
          aria-label="Excluir"
          title="Excluir"
          className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M8.75 1a.75.75 0 0 0-.75.75V3H4a.75.75 0 0 0 0 1.5h.324l.744 10.418A2.25 2.25 0 0 0 7.312 17h5.376a2.25 2.25 0 0 0 2.244-2.082L15.676 4.5H16a.75.75 0 0 0 0-1.5h-3.25V1.75a.75.75 0 0 0-.75-.75h-3.25ZM7.5 6.75a.75.75 0 0 1 1.5 0v6.5a.75.75 0 0 1-1.5 0v-6.5Zm4-.75a.75.75 0 0 0-.75.75v6.5a.75.75 0 0 0 1.5 0v-6.5a.75.75 0 0 0-.75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </li>
  )
}
