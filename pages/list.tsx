import Link from 'next/link'
import { useState, useEffect } from 'react'
import { TItem, TList } from '../types'
import Header from './components/Header'

function list() {
  const [currentList, setCurrentList] = useState<TItem[]>([])
  const [errorText, setErrorText] = useState('\u00a0')
  const [isCartEmpty, setisCartEmpty] = useState(true)
  const [listName, setListName] = useState('')
  const [comment, setComment] = useState('')

  useEffect(() => {
    const localList = localStorage.getItem('list')
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

  return (
    <div>
      <Header />
      <p style={{ textAlign: 'center' }}>{errorText}</p>
      {/* Add Cart View Here */}
      <input
        type='text'
        value={listName}
        onChange={(e) => setListName(e.target.value)}
        placeholder='Name This List'
      />
      <textarea
        placeholder='Comments'
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      {!isCartEmpty && <button>Save List</button>}
      <button>
        <Link href='/create'>Add More Items</Link>
      </button>
    </div>
  )
}

export default list
