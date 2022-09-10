import { useState } from 'react'
import dayjs from 'dayjs'

import { GetServerSideProps } from 'next'
import { TAPIList } from '../../types'

import { supabase } from '../../utils'

import shopListStyles from '../../styles/shopList.module.css'
import ShopCard from '../components/ShopCard'

type SingleListServerSideProps = {
  post: TAPIList
  error: string
}

function SingleList({ post, error }: SingleListServerSideProps) {
  const [list, setList] = useState(post)
  const [errorMessage, setErrorMessage] = useState(error)

  const mappedList = list.items.map((item) => (
    <ShopCard
      item={item}
      key={item.id}
      imgSrc={item.img}
      name={item.name}
      latest_quantity_purchased={item.latest_quantity_purchased}
    />
  ))

  if (!list) {
    return <p>{errorMessage}</p>
  }

  return (
    <div className={shopListStyles.container}>
      <div>
        <h1>{list.name}</h1>
        <p>{`created at ${dayjs(list.created_at).format('h:mm A, MMMM D')}`}</p>
        <p>Notes: {list.comment}</p>
      </div>
      <div className={shopListStyles.items}>{mappedList}</div>
      <div className={shopListStyles.bottomButtons}>
        <button>Mark Complete</button>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let { data: MyLists, error } = await supabase
    .from('MyLists')
    .select('*')
    .eq('id', context.query.id)

  if (MyLists) {
    return {
      props: {
        post: MyLists[0],
        error: error?.message || ''
      }
    }
  } else {
    return { props: { post: [], error: error?.message } }
  }
}

export default SingleList
