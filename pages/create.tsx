import { useState, useEffect } from 'react'

import { supabase } from '../utils'
import { TItem } from '../types'
import ItemToBuy from './components/ItemToBuy'
import Header from './components/Header'

import createStyles from '../styles/create.module.css'

function create() {
  const [items, setItems] = useState<TItem[]>([])
  const [errorText, setErrorText] = useState('\u00a0')

  const handleErrorText = (input: string) => {
    setErrorText(input)
    setTimeout(() => {
      setErrorText('\u00a0')
    }, 3000)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    let { data: Items, error } = await supabase.from('Items').select('*')
    if (error) throw Error(error.message)
    if (Items) setItems(Items)
  }

  const mappedItems = items.length ? (
    items.map((item) => (
      <ItemToBuy handleErrorText={handleErrorText} item={item} key={item.id} />
    ))
  ) : (
    <p>Loading...</p>
  )

  return (
    <div>
      <Header />
      <p className={createStyles.errorText}>{errorText}</p>
      <div className={createStyles.itemContainer}>{mappedItems}</div>
      <div className={createStyles.navButtons}>
        <button>View List</button>
        <button>Add new Item</button>
      </div>
    </div>
  )
}

export default create
