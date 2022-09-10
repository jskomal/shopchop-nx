import { useState, useContext } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase, debounce } from '../utils'
import { TItem } from '../types'
import createStyles from '../styles/create.module.css'
import currentListContext from '../context/currentListContext'

type TStaticProps = {
  Items: TItem[]
  error: string
}

function Create({ Items, error }: TStaticProps) {
  const [items] = useState<TItem[]>(Items)
  const [filteredItems, setFilteredItems] = useState<TItem[]>(Items)
  const [errorText, setErrorText] = useState(error || '\u00a0')
  const listContext = useContext(currentListContext)
  const { list, setList } = listContext

  const handleErrorText = (input: string) => {
    setErrorText(input)
    setTimeout(() => {
      setErrorText('\u00a0')
    }, 3000)
  }

  const addToList = (itemToAdd: TItem, quantity: number) => {
    const indexOfFound = list.findIndex((item) => item.id == itemToAdd.id)
    switch (true) {
      case quantity === 0:
        setList((prev) => {
          const filtered = prev.filter((item) => item.id !== itemToAdd.id)
          return [...filtered]
        })
        handleErrorText(`removed ${itemToAdd.name} from the shopping list`)
        break
      case quantity < 0:
        handleErrorText('Please enter a positive number')
        break
      case indexOfFound > -1:
        setList((prev) => {
          prev[indexOfFound].total_quantity_purchased -=
            prev[indexOfFound].latest_quantity_purchased
          prev[indexOfFound].latest_quantity_purchased = quantity
          prev[indexOfFound].total_quantity_purchased += quantity
          return [...prev]
        })
        handleErrorText(`Updated ${itemToAdd.name}'s quantity to ${quantity}`)
        break
      case indexOfFound === -1:
        setList((prev) => [
          ...prev,
          {
            ...itemToAdd,
            latest_quantity_purchased: quantity,
            total_quantity_purchased: itemToAdd.total_quantity_purchased + quantity
          }
        ])
        handleErrorText(`Added ${quantity} ${itemToAdd.name} to the shopping list`)
        break
      default:
        handleErrorText('Something went very very wrong')
    }
  }

  const debounceAddToList = debounce(addToList)

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
            src={item.img}
            width={80}
            height={80}
            layout='fixed'
            alt={item.name}
            className={createStyles.img}
          />
          <p>{item.name}</p>
          <input
            type='number'
            onChange={(e) => debounceAddToList(item, parseInt(e.target.value))}
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
      {/* <button
        onClick={() => {
          sessionStorage.clear()
          localStorage.clear()
        }}
      >
        clearSession
      </button> */}
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
      error: error?.message || null
    }
  }
}

export default Create
