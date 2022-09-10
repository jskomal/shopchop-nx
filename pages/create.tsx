import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '../utils'
import { TItem } from '../types'
import createStyles from '../styles/create.module.css'

type TStaticProps = {
  Items: TItem[]
}

function Create({ Items }: TStaticProps) {
  const [items, setItems] = useState<TItem[]>(Items)
  const [filteredItems, setFilteredItems] = useState<TItem[]>(Items)
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

  const fetchItems = async () => {
    let { data: Items, error } = await supabase.from('Items').select('*')
    if (error) throw Error(error.message)
    if (Items) {
      setItems(Items)
      setFilteredItems(Items)
      sessionStorage.setItem('fetch', JSON.stringify(Items))
    }
  }

  const handleErrorText = (input: string) => {
    setErrorText(input)
    setTimeout(() => {
      setErrorText('\u00a0')
    }, 3000)
  }

  const addToList = (id: number, quantity: number) => {
    setList((prevList) => {
      const indexOfFound = prevList.findIndex((item) => item.id == id)
      if (quantity === 0 && indexOfFound !== -1) {
        prevList[indexOfFound].total_quantity_purchased -=
          prevList[indexOfFound].latest_quantity_purchased
        prevList[indexOfFound].latest_quantity_purchased = 0
        handleErrorText(`Removed ${prevList[indexOfFound].name} from cart!`)
        const filtered = prevList.filter((item) => item.id !== id)
        return [...filtered]
      } else if (quantity < 0) {
        handleErrorText('Please enter a positive value')
        return [...prevList]
      } else if (indexOfFound > -1) {
        prevList[indexOfFound].latest_quantity_purchased = quantity
        prevList[indexOfFound].total_quantity_purchased += quantity
        handleErrorText(
          `Updated ${prevList[indexOfFound].name}'s quantity to ${quantity}!`
        )
        return [...prevList]
      } else {
        const dangerouslyMutableItem = items.find((item) => item.id === id)
        if (dangerouslyMutableItem) {
          const itemToAdd = { ...dangerouslyMutableItem }
          itemToAdd.latest_quantity_purchased = quantity
          itemToAdd.total_quantity_purchased += quantity
          handleErrorText(`Added ${quantity} ${itemToAdd.name} to the cart!`)
          return [...prevList, { ...itemToAdd }]
        } else {
          handleErrorText('Something went horribly wrong')
          return [...prevList]
        }
      }
    })
  }

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const itemsToShow = items.filter((item) =>
      item.name.toLowerCase().trim().includes(e.target.value.toLowerCase().trim())
    )
    if (itemsToShow.length) {
      setFilteredItems(itemsToShow)
    } else {
      handleErrorText(`No items with a name containing ${e.target.value} found.`)
    }
  }

  const mappedItems = Items.length ? (
    filteredItems.map((item) => {
      const listQuantity = list.find(
        (listItem) => item.id === listItem.id
      )?.latest_quantity_purchased
      return (
        <div className={createStyles.card} key={item.id}>
          <Image
            src={item?.img}
            width={80}
            height={80}
            layout='fixed'
            alt={item?.name}
            className={createStyles.img}
          />
          <p>{item.name}</p>
          <input
            type='number'
            onChange={(e) => addToList(item.id, parseInt(e.target.value))}
            className={createStyles.quantInput}
            placeholder={
              listQuantity !== undefined ? listQuantity.toString() : 'Quantity'
            }
          />
        </div>
      )
    })
  ) : (
    <p style={{ textAlign: 'center' }}>Loading...</p>
  )

  return (
    <div>
      <button
        onClick={() => {
          sessionStorage.clear()
          localStorage.clear()
        }}
      >
        clearSession
      </button>
      <div className={createStyles.pageContainer}>
        <p className={createStyles.errorText}>{errorText}</p>
        <input
          className={createStyles.filterInput}
          type='text'
          placeholder='Filter items'
          onChange={handleFilter}
        />
        <div className={createStyles.itemContainer}>{mappedItems}</div>
        <div className={createStyles.navButtons}>
          <button>
            <Link href='/currentList'>View List</Link>
          </button>
          <button>Add new Item</button>
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  let { data: Items, error } = await supabase.from('Items').select('*')
  return {
    props: {
      Items,
    },
  }
}

export default Create
