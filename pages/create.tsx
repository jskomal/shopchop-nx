import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '../utils'
import { TItem } from '../types'
import ItemToBuy from './components/ItemToBuy'
import Header from './components/Header'
import createStyles from '../styles/create.module.css'

function create() {
  const [items, setItems] = useState<TItem[]>([])
  const [filteredItems, setFilteredItems] = useState<TItem[]>([])
  const [errorText, setErrorText] = useState('\u00a0')
  const [list, setList] = useState<TItem[]>([])
  const isFirstLoad = useRef(true)

  useEffect(() => {
    const fetch = sessionStorage.getItem('fetch')
    if (typeof fetch === 'string') {
      const parsed = JSON.parse(fetch)
      setItems(parsed)
      setFilteredItems(parsed)
    } else {
      fetchItems()
    }
  }, [])

  useEffect(() => {
    const localList = sessionStorage.getItem('list')
    if (typeof localList === 'string' && isFirstLoad.current) {
      const parse = JSON.parse(localList)
      setList(parse)
      isFirstLoad.current = false
    } else {
      sessionStorage.setItem('list', JSON.stringify(list))
    }
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
    if (Items) {
      setItems(Items)
      setFilteredItems(Items)
      sessionStorage.setItem('fetch', JSON.stringify(Items))
    }
  }

  const addToList = (id: number, quantity: number) => {
    setItems((prev) => {
      const itemToAdd = prev.find((item) => item.id === id)
      if (itemToAdd) {
        itemToAdd.latest_quantity_purchased = quantity
        itemToAdd.total_quantity_purchased += quantity
        setList((prev) => {
          return [...prev, { ...itemToAdd }]
        })
        const merged = prev.map((item) => {
          if (item.id === itemToAdd.id) {
            return itemToAdd
          } else return item
        })
        handleErrorText(`Added ${quantity} ${itemToAdd.name} to the cart!`)
        sessionStorage.setItem('fetch', JSON.stringify(merged))
        return [...merged]
      } else {
        handleErrorText(`Could not find item with id ${id}.`)
        sessionStorage.setItem('fetch', JSON.stringify(prev))
        return [...prev]
      }
    })
  }

  const mappedItems = items.length ? (
    filteredItems.map((item) => (
      <ItemToBuy
        handleErrorText={handleErrorText}
        item={item}
        key={item.id}
        addToList={addToList}
      />
    ))
  ) : (
    <p style={{ textAlign: 'center' }}>Loading...</p>
  )

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const itemsToShow = items.filter((item) =>
      item.name.toLowerCase().trim().includes(e.target.value.toLowerCase().trim())
    )
    if (itemsToShow.length) {
      setFilteredItems(itemsToShow)
    } else {
      handleErrorText(`No items with a name containing ${e.target.value}.`)
    }
  }

  return (
    <div>
      {/* <button
        onClick={() => {
          sessionStorage.clear()
          localStorage.clear()
        }}
      >
        clearSession
      </button> */}
      <Header />
      <div className={createStyles.pageContainer}>
        <p className={createStyles.errorText}>{errorText}</p>
        <input
          className={createStyles.filterInput}
          type='text'
          placeholder='Filter for Items'
          onChange={handleFilter}
        />
        <div className={createStyles.itemContainer}>{mappedItems}</div>
        <div className={createStyles.navButtons}>
          <button>
            <Link href='/list'>View List</Link>
          </button>
          <button>Add new Item</button>
        </div>
      </div>
    </div>
  )
}

export default create
