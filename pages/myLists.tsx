import { useState, useEffect } from 'react'
import { supabase } from '../utils'
import { TAPIList, TItem } from '../types'
import ShoppingList from './components/ShoppingList'

import myListStyles from '../styles/myLists.module.css'

function myLists() {
  const [myLists, setMyLists] = useState<TAPIList[]>([])

  useEffect(() => {
    fetchLists()
  }, [])

  const fetchLists = async () => {
    const { data: MyLists, error } = await supabase.from('MyLists').select('*')
    if (error) throw Error(error.message)
    setMyLists(MyLists)
    console.log(MyLists)
  }

  const mappedLists =
    myLists.length > 0 ? (
      myLists.map((list) => <ShoppingList list={list} key={list.id} />)
    ) : (
      <p>No lists here!</p>
    )

  return (
    <div className={myListStyles.container}>
      <p className={myListStyles.title}>Choose a list to shop from:</p>
      <div>{mappedLists}</div>
    </div>
  )
}

export default myLists
