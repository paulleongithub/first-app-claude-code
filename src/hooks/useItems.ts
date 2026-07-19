import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Item, ItemDraft } from '../types/item'

function sortItems(items: Item[]): Item[] {
  return [...items].sort((a, b) => {
    if (a.checked !== b.checked) return a.checked ? 1 : -1
    return a.name.localeCompare(b.name)
  })
}

export function useItems() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('checked', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      setError(error.message)
    } else {
      setError(null)
      setItems(data as Item[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const addItem = useCallback(async (draft: ItemDraft) => {
    const { data, error } = await supabase
      .from('items')
      .insert(draft)
      .select()
      .single()

    if (error) {
      setError(error.message)
      return
    }
    setError(null)
    setItems((current) => sortItems([data as Item, ...current]))
  }, [])

  const updateItem = useCallback(async (id: string, draft: ItemDraft) => {
    const { data, error } = await supabase
      .from('items')
      .update(draft)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      setError(error.message)
      return
    }
    setError(null)
    setItems((current) => sortItems(current.map((item) => (item.id === id ? (data as Item) : item))))
  }, [])

  const toggleChecked = useCallback(async (id: string, checked: boolean) => {
    const { data, error } = await supabase
      .from('items')
      .update({ checked })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      setError(error.message)
      return
    }
    setError(null)
    setItems((current) => sortItems(current.map((item) => (item.id === id ? (data as Item) : item))))
  }, [])

  const deleteItem = useCallback(async (id: string) => {
    const { error } = await supabase.from('items').delete().eq('id', id)

    if (error) {
      setError(error.message)
      return
    }
    setError(null)
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  return { items, loading, error, addItem, updateItem, toggleChecked, deleteItem }
}
