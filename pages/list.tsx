import Link from 'next/link'
import { useState, useEffect } from 'react'
import { TItem, TList } from '../types'
import listStyles from '../styles/list.module.css'
import ListItem from './components/ListItem'

function list() {
  const [currentList, setCurrentList] = useState<TItem[]>([])
  const [errorText, setErrorText] = useState('\u00a0')
  const [isCartEmpty, setIsCartEmpty] = useState(true)
  const [listName, setListName] = useState('')
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (currentList.length) {
      setIsCartEmpty(false)
    }
    const localList = sessionStorage.getItem('list')
    if (typeof localList === 'string') {
      const parse = JSON.parse(localList)
      setCurrentList(parse)
    } else {
      setErrorText('There are no items in the list, go add some!')
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

  const mappedItems =
    currentList.length > 0 ? (
      currentList.map((item) => (
        <ListItem item={item} key={item.id} removeItemFromList={removeItemFromList} />
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
            <button>Save List</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default list
