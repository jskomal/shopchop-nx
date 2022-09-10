import { useState, useContext } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '../utils'
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

  const debounce = (fn: Function, ms = 400) => {
    let timeoutId: ReturnType<typeof setTimeout>
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn.apply(this, args), ms)
    }
  }

  const addToList = (id: number, quantity: number) => {
    setList((prevList: TItem[]) => {
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
            onChange={(e) => debounceAddToList(item.id, parseInt(e.target.value))}
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
