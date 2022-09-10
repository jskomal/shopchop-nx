import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { TItem, TList } from '../types'
import listStyles from '../styles/list.module.css'
// import ListItem from './components/ListItem'
import { supabase } from '../utils'

function CurrentList() {
  const [currentList, setCurrentList] = useState<TItem[]>([])
  const [errorText, setErrorText] = useState('\u00a0')
  const [isCartEmpty, setIsCartEmpty] = useState(true)
  const [listName, setListName] = useState('')
  const [comment, setComment] = useState('')

  useEffect(() => {
    //fetch currentList
    const localList = sessionStorage.getItem('list')
    if (typeof localList === 'string') {
      const parse = JSON.parse(localList)
      setCurrentList(parse)
      setIsCartEmpty(false)
    }
  }, [])

  const handleErrorText = (input: string) => {
    setErrorText(input)
    setTimeout(() => {
      setErrorText('\u00a0')
    }, 3000)
  }

  const removeItemFromList = (itemID: number) => {
    setCurrentList((prev) => {
      const filtered = prev.filter((item) => item.id !== itemID)
      sessionStorage.setItem('list', JSON.stringify(filtered))
      return [...filtered]
    })
  }

  const saveList = () => {
    const listToAdd: TList = {
      items: currentList,
      name: listName,
      comment: comment,
    }
    if (!listToAdd.name) {
      handleErrorText('Please enter a name for this list!')
    } else {
      postList(listToAdd)
      handleErrorText(`Saved ${listToAdd.name} to My Lists!`)
      setCurrentList([])
      setIsCartEmpty(true)
      sessionStorage.removeItem('list')
    }
  }

  const postList = async (payload: TList) => {
    const { data, error } = await supabase.from('MyLists').insert([payload])
    if (error) throw Error(error.message)
  }

  const mappedItems =
    currentList.length > 0 ? (
      currentList.map((item) => (
        // <ListItem item={item} key={item.id} removeItemFromList={removeItemFromList} />
        <div className={listStyles.card} key={item.id}>
          <Image
            src={item.img}
            alt={item.name}
            width={80}
            height={80}
            layout='fixed'
            className={listStyles.img}
          />
          <div className={listStyles.namePair}>
            <p>{item.name}</p>
            <p>Quantity: {item?.latest_quantity_purchased}</p>
          </div>
          <button onClick={() => removeItemFromList(item?.id)}>Remove from List</button>
        </div>
      ))
    ) : (
      <div className={listStyles.itemContainer}>
        <p className={listStyles.noItems}>No Items in this list!</p>
        <button>
          <Link href='/create'>Go Back</Link>
        </button>
      </div>
    )

  return (
    <div>
      <p className={listStyles.errorText}>{errorText}</p>
      <div className={listStyles.itemContainer}>{mappedItems}</div>
      <div className={listStyles.endSection}>
        <div className={listStyles.endPair}>
          {!isCartEmpty && (
            <input
              type='text'
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder='Name This List'
              className={listStyles.input}
            />
          )}
          {!isCartEmpty && (
            <textarea
              placeholder='Comments'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={listStyles.comment}
            ></textarea>
          )}
        </div>
        {!isCartEmpty && (
          <div className={listStyles.buttonPair}>
            <button>
              <Link href='/create'>Add More Items</Link>
            </button>
            <button>
              <Link href='/myLists'>See Saved Lists</Link>
            </button>
            <button onClick={saveList}>Save List</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CurrentList
