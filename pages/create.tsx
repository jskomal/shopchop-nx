import { useState, useEffect } from 'react'

import Link from 'next/link'

import { supabase } from '../utils'
import { TItem } from '../types'
import ItemToBuy from './components/ItemToBuy'
import Header from './components/Header'

import createStyles from '../styles/create.module.css'

function create() {
  const [items, setItems] = useState<TItem[]>([])
  const [errorText, setErrorText] = useState('\u00a0')
  const [list, setList] = useState<TItem[]>([])

  useEffect(() => {
    fetchItems()
  }, [])

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))
  }, [list])

  const handleErrorText = (input: string) => {
    setErrorText(input)
    setTimeout(() => {
      setErrorText('\u00a0')
    }, 3000)
  }

  const fetchItems = async () => {
    let { data: Items, error } = await supabase.from('Items').select('*')
    if (error) throw Error(error.message)
    if (Items) setItems(Items)
  }

  const addToList = (id: number, quantity: number) => {
    const itemToAdd = items.find((item) => item.id === id)
    if (itemToAdd) {
      itemToAdd.latest_quantity_purchased = quantity
      itemToAdd.total_quantity_purchased += quantity
      setList((prev) => {
        return [...prev, { ...itemToAdd }]
      })
      handleErrorText(`Added ${quantity} ${itemToAdd.name} to the cart!`)
    } else {
      handleErrorText(`Could not find item with id ${id}.`)
    }
  }

  const mappedItems = items.length ? (
    items.map((item) => (
      <ItemToBuy
        handleErrorText={handleErrorText}
        item={item}
        key={item.id}
        addToList={addToList}
      />
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
        <button>
          <Link href='/list'>View List</Link>
        </button>
        <button>Add new Item</button>
      </div>
    </div>
  )
}

export default create
