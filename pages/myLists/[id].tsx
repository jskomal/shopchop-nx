import { useState, useRef, useEffect } from 'react'
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
  const [completeButtonText, setCompleteButtonText] = useState(
    'All items are not in cart, complete anyway?'
  )
  const completeButton = useRef(null)
  const isConfirmed = useRef(false)
  const [isListComplete, setIsListComplete] = useState(false)

  useEffect(() => {
    if (list.items.every((item) => item.isBought)) {
      setCompleteButtonText('All items are in your cart!')
      setIsListComplete(true)
    } else {
      setCompleteButtonText('All items are not in cart, complete anyway?')
      setIsListComplete(false)
    }
  }, [list])

  const markComplete = () => {
    if (isListComplete) {
      console.log('all good')
      // handle the finishing
    } else if (!isListComplete && !isConfirmed.current) {
      setCompleteButtonText('Mark Completed')
      isConfirmed.current = true
    } else if (!isListComplete && isConfirmed.current)
      console.log('Mark complete without all')
    //handle finish
  }

  const mappedList = list.items.map((item) => (
    <ShopCard
      key={item.id}
      id={item.id}
      imgSrc={item.img}
      name={item.name}
      latest_quantity_purchased={item.latest_quantity_purchased}
      isBought={item.isBought}
      setList={setList}
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
        <button ref={completeButton} onClick={markComplete}>
          {completeButtonText}
        </button>
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
