import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useContext } from 'react'
import { supabase } from '../utils'

import { TList } from '../types'
import currentListContext from '../context/currentListContext'

import listStyles from '../styles/list.module.css'

function CurrentList() {
  const { list, setList } = useContext(currentListContext)
  const [errorText, setErrorText] = useState('\u00a0')
  const [isCartEmpty, setIsCartEmpty] = useState(true)
  const [listName, setListName] = useState('')
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (list.length) setIsCartEmpty(false)
  }, [])

  const handleErrorText = (input: string) => {
    setErrorText(input)
    setTimeout(() => {
      setErrorText('\u00a0')
    }, 3000)
  }

  const removeItemFromList = (itemID: number) => {
    setList((prev) => {
      const filtered = prev.filter((item) => item.id !== itemID)
      sessionStorage.setItem('list', JSON.stringify(filtered))
      return [...filtered]
    })
  }

  const saveList = () => {
    const listToAdd: TList = {
      items: list,
      name: listName,
      comment: comment
    }
    if (!listToAdd.name) {
      handleErrorText('Please enter a name for this list!')
    } else {
      postList(listToAdd)
      handleErrorText(`Saved ${listToAdd.name} to My Lists!`)
      setList([])
      setIsCartEmpty(true)
      sessionStorage.removeItem('list')
    }
  }

  const postList = async (payload: TList) => {
    const { data, error } = await supabase.from('MyLists').insert([payload])
    if (error) throw Error(error.message)
  }

  const mappedItems =
    list.length > 0 ? (
      list.map((item) => (
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
        <Link href='/create'>
          <button>Go Back</button>
        </Link>
      </div>
    )

  return (
    <div className={listStyles.view}>
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
            <Link href='/create'>
              <button>Add More Items</button>
            </Link>
            <button onClick={saveList}>Save List</button>
          </div>
        )}
        <Link href='/myLists'>
          <button>See Saved Lists</button>
        </Link>
      </div>
    </div>
  )
}

export default CurrentList
