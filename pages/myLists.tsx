import Link from 'next/link'

import { useState, useEffect } from 'react'

import { supabase } from '../utils'
import { TAPIList } from '../types'
import dayjs from 'dayjs'
import myListStyles from '../styles/myLists.module.css'

type MyListsProps = {
  MyLists: TAPIList[]
}

function MyLists({ MyLists }: MyListsProps) {
  const [myLists, setMyLists] = useState<TAPIList[]>(MyLists)

  useEffect(() => {
    const localLists = localStorage.getItem('myLists')
    if (typeof localLists === 'string') {
      const parsed = JSON.parse(localLists)
      if (dayjs().isAfter(dayjs(parsed[parsed.length - 1].created_at), 'hour')) {
        fetchLists()
      } else {
        setMyLists(parsed)
      }
    } else {
      fetchLists()
    }
  }, [])

  const fetchLists = async () => {
    const { data: MyLists, error } = await supabase.from('MyLists').select('*')
    if (error) throw Error(error.message)
    setMyLists(MyLists)
    localStorage.setItem('myLists', JSON.stringify(MyLists))
  }

  const mappedLists =
    myLists.length > 0 ? (
      myLists.map((list) => {
        const itemPreview = list.items.map((item) => item.name).join(', ')
        return (
          <Link href='/myList/[id]' key={list.id}>
            <div className={myListStyles.card}>
              <h3>{list.name}</h3>
              <p>***</p>
              {list.comment && <p>{list.comment}</p>}
              <p>
                {itemPreview.length > 20
                  ? `${itemPreview.substring(0, 25)}...`
                  : itemPreview}
              </p>
              <p>{`${list.items.length} items`}</p>
              <p>{`Created ${dayjs(list.created_at).format('dddd, MMMM D, YYYY')}`}</p>
            </div>
          </Link>
        )
      })
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

export async function getStaticProps() {
  const { data: MyLists, error } = await supabase.from('MyLists').select('*')
  return {
    props: {
      MyLists,
    },
  }
}

export default MyLists
