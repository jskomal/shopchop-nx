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
  const mappedLists =
    MyLists.length > 0 ? (
      MyLists.map((list) => {
        const itemPreview = list.items.map((item) => item.name).join(', ')
        return (
          <Link
            href={{
              pathname: '/myLists/[id]',
              query: { id: list.id, post: JSON.stringify(list) },
            }}
            key={list.id}
          >
            <div className={myListStyles.card}>
              <h3>{list.name}</h3>
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
      <div className={myListStyles.listsView}>{mappedLists}</div>
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
