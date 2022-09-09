import Link from 'next/link'
import { useState, useEffect } from 'react'
import { TItem, TList } from '../types'
import Header from './components/Header'
import listStyles from '../styles/list.module.css'
import ListItem from './components/ListItem'

function list() {
  const [currentList, setCurrentList] = useState<TItem[]>([])
  const [errorText, setErrorText] = useState('\u00a0')
  const [isCartEmpty, setisCartEmpty] = useState(true)
  const [listName, setListName] = useState('')
  const [comment, setComment] = useState('')

  useEffect(() => {
    const localList = sessionStorage.getItem('list')
    if (typeof localList === 'string') {
      const parse = JSON.parse(localList)
      setCurrentList(parse)
      setisCartEmpty(false)
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

  const mappedItems =
    currentList.length &&
    currentList.map((item) => <ListItem item={item} key={item.id} />)

  return (
    <div>
      <p className={listStyles.errorText}>{errorText}</p>
      <div className={listStyles.itemContainer}>{mappedItems}</div>
      <div className={listStyles.endSection}>
        <div className={listStyles.endPair}>
          <input
            type='text'
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder='Name This List'
            className={listStyles.input}
          />
          <textarea
            placeholder='Comments'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={listStyles.comment}
          ></textarea>
        </div>
        <div className={listStyles.buttonPair}>
          {!isCartEmpty && <button>Save List</button>}
          <button>
            <Link href='/create'>Add More Items</Link>
          </button>
        </div>
      </div>
    </div>
  )
}

export default list
